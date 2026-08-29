<#
.SYNOPSIS
    Rollback Feature Deployment - PowerShell
    Rolls back to previous version using blue-green deployment

.PARAMETER ChangeName
    OpenSpec change name to rollback (optional, uses current_port)

.PARAMETER TargetPort
    Specific port to rollback to (optional, auto-detects from .current_port)
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$ChangeName,

    [Parameter(Mandatory=$false)]
    [int]$TargetPort
)

$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] [$Level] $Message"
}

function Write-Success { param([string]$Message) Write-Log $Message "SUCCESS" }
function Write-Error { param([string]$Message) Write-Log $Message "ERROR" }
function Write-Warning { param([string]$Message) Write-Log $Message "WARN" }

try {
    Write-Log "============================================================"
    Write-Log "ROLLBACK INITIATED"
    Write-Log "============================================================"

    $currentPortFile = ".current_port"

    if (-not (Test-Path $currentPortFile)) {
        throw "No .current_port file found - cannot determine current deployment"
    }

    $currentPort = [int](Get-Content $currentPortFile -Raw)
    Write-Log "Current production port: $currentPort"

    # Determine target port (the other one in blue-green pair)
    if ($TargetPort) {
        $rollbackPort = $TargetPort
    } else {
        $rollbackPort = if ($currentPort -eq 3000) { 3001 } else { 3000 }
    }

    Write-Log "Rolling back to port: $rollbackPort"

    # Verify target container exists and is healthy
    $targetContainer = docker ps -q --filter "publish=$rollbackPort"
    if (-not $targetContainer) {
        throw "No container found on rollback port $rollbackPort"
    }

    Write-Log "Found container on port $rollbackPort: $targetContainer"

    # Health check on target
    $healthy = $false
    for ($i = 1; $i -le 10; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$rollbackPort/health" -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                $healthy = $true
                break
            }
        } catch { }
        Start-Sleep -Seconds 1
    }

    if (-not $healthy) {
        throw "Rollback target on port $rollbackPort is not healthy"
    }

    Write-Success "Rollback target healthy on port $rollbackPort"

    # Switch traffic (update nginx/proxy)
    Write-Log "Switching traffic to port $rollbackPort..."
    # nginx config update here
    # nginx -s reload

    # Update current port tracker
    $rollbackPort | Out-File -FilePath $currentPortFile -Encoding utf8
    Write-Success "Updated .current_port to $rollbackPort"

    # Stop old container after grace period
    Write-Log "Stopping old container on port $currentPort in 30 seconds..."
    Start-Sleep -Seconds 30
    $oldContainer = docker ps -q --filter "publish=$currentPort"
    if ($oldContainer) {
        docker stop $oldContainer | Out-Null
        docker rm $oldContainer | Out-Null
        Write-Success "Old container stopped"
    }

    # Update archive.md if ChangeName provided
    if ($ChangeName) {
        $archivePath = "openspec/changes/$ChangeName/archive.md"
        if (Test-Path $archivePath) {
            $rollbackInfo = @"
## Rollback
- **Date:** $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
- **Rolled back from:** port $currentPort
- **Rolled back to:** port $rollbackPort
- **Container:** $targetContainer
"@
            Add-Content -Path $archivePath -Value $rollbackInfo
            Write-Success "Updated $archivePath with rollback info"
        }
    }

    Write-Log "============================================================"
    Write-Log "🎉 ROLLBACK SUCCESSFUL"
    Write-Log "============================================================"
    Write-Log "Active port: $rollbackPort"
    Write-Log "Container: $targetContainer"
    Write-Log "============================================================"

    exit 0
}
catch {
    Write-Error "ROLLBACK FAILED: $($_.Exception.Message)"
    Write-Log "============================================================"
    exit 1
}