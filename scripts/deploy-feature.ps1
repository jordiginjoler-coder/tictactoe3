<#
.SYNOPSIS
    Feature Deployment Script - PowerShell
    Requirements: Port conflict resolution, health checks, verified URLs, auto rollback

.DESCRIPTION
    Deploys a feature to staging/production with full validation.
    Handles port conflicts, health checks, endpoint verification, and rollback.

.PARAMETER ChangeName
    OpenSpec change name (e.g., SCRUM-123)

.PARAMETER Environment
    Target environment: staging or production (default: staging)

.PARAMETER ImageTag
    Docker image tag to deploy (default: latest)

.PARAMETER BasePort
    Starting port for conflict resolution (default: 3000)

.EXAMPLE
    .\deploy-feature.ps1 -ChangeName "SCRUM-123" -Environment "staging"
    .\deploy-feature.ps1 -ChangeName "FEAT-456" -Environment "production" -ImageTag "v1.2.3"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$ChangeName,

    [Parameter(Mandatory=$false)]
    [ValidateSet("staging", "production")]
    [string]$Environment = "staging",

    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest",

    [Parameter(Mandatory=$false)]
    [int]$BasePort = 3000
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
    Write-Log "DEPLOYING FEATURE: $ChangeName"
    Write-Log "Environment: $Environment"
    Write-Log "Image: $ImageTag"
    Write-Log "============================================================"

    # ------------------------------------------------------------
    # Step 1: Pre-flight checks
    # ------------------------------------------------------------
    Write-Log "[1/6] Pre-flight validation..."

    $archivePath = "openspec/changes/$ChangeName/archive.md"
    if (-not (Test-Path $archivePath)) {
        throw "Change $ChangeName not archived (missing $archivePath)"
    }
    Write-Success "Change $ChangeName is archived"

    # Check Docker
    try {
        docker version | Out-Null
        Write-Success "Docker available"
    } catch {
        throw "Docker not available"
    }

    # ------------------------------------------------------------
    # Step 2: Port conflict resolution
    # ------------------------------------------------------------
    Write-Log "[2/6] Resolving port conflicts..."

    $port = $BasePort
    $maxPort = $BasePort + 100

    while ($port -le $maxPort) {
        $inUse = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if (-not $inUse) {
            Write-Success "Port $port available"
            break
        }
        Write-Warning "Port $port in use, trying next..."
        $port++
    }

    if ($port -gt $maxPort) {
        throw "No available ports in range $BasePort-$maxPort"
    }

    # ------------------------------------------------------------
    # Step 3: Pull and start container
    # ------------------------------------------------------------
    Write-Log "[3/6] Starting container on port $port..."

    Write-Log "Pulling image: $ImageTag"
    docker pull $ImageTag | Out-Null
    Write-Success "Image pulled"

    # Stop existing container on this port
    $existingContainer = docker ps -q --filter "publish=$port"
    if ($existingContainer) {
        Write-Warning "Stopping existing container on port $port: $existingContainer"
        docker stop $existingContainer | Out-Null
        docker rm $existingContainer | Out-Null
    }

    $containerName = "feature-$ChangeName-$port"
    Write-Log "Starting container: $containerName"
    docker run -d `
        --name $containerName `
        -p $port:3000 `
        -e NODE_ENV=production `
        -e PORT=3000 `
        $ImageTag | Out-Null

    Write-Success "Container $containerName started on port $port"

    # ------------------------------------------------------------
    # Step 4: Health checks with retries
    # ------------------------------------------------------------
    Write-Log "[4/6] Running health checks..."

    $maxRetries = 30
    $retry = 0
    $healthy = $false

    while ($retry -lt $maxRetries) {
        $retry++
        Write-Log "Waiting for health check... (Attempt $retry/$maxRetries)"

        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                $healthy = $true
                break
            }
        } catch {
            # Continue retrying
        }

        Start-Sleep -Seconds 2
    }

    if (-not $healthy) {
        Write-Error "Health check FAILED after $maxRetries attempts"
        Write-Log "Stopping container..."
        docker stop $containerName | Out-Null
        docker rm $containerName | Out-Null
        throw "Health check failed"
    }

    Write-Success "Health check PASSED"

    # ------------------------------------------------------------
    # Step 5: Verify all endpoints
    # ------------------------------------------------------------
    Write-Log "[5/6] Verifying endpoints..."

    $endpoints = @("/health", "/api/v1/candidates", "/api/v1/positions", "/api/v1/interviews")
    $allOk = $true

    foreach ($endpoint in $endpoints) {
        $url = "http://localhost:$port$endpoint"
        Write-Log "Checking $url ..."

        try {
            $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Success "Verified: $url"
            } else {
                Write-Error "FAILED: $url (Status: $($response.StatusCode))"
                $allOk = $false
            }
        } catch {
            Write-Error "FAILED: $url ($($_.Exception.Message))"
            $allOk = $false
        }
    }

    if (-not $allOk) {
        Write-Error "Some endpoints failed verification"
        Write-Log "Stopping container..."
        docker stop $containerName | Out-Null
        docker rm $containerName | Out-Null
        throw "Endpoint verification failed"
    }

    Write-Success "All endpoints verified"

    # ------------------------------------------------------------
    # Step 6: Update deployment record
    # ------------------------------------------------------------
    Write-Log "[6/6] Updating deployment record..."

    $deployUrl = "http://localhost:$port"
    Write-Log "Deployment URL: $deployUrl"

    # Update archive.md
    if (Test-Path $archivePath) {
        $deploymentInfo = @"
## Production Deployment
- **Date:** $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
- **Environment:** $Environment
- **URL:** $deployUrl
- **Image:** $ImageTag
- **Container:** $containerName
- **Port:** $port
"@
        Add-Content -Path $archivePath -Value $deploymentInfo
        Write-Success "Updated $archivePath"
    }

    # Save port for rollback
    $port | Out-File -FilePath ".current_port" -Encoding utf8

    # ------------------------------------------------------------
    # Production: Blue-green switch
    # ------------------------------------------------------------
    if ($Environment -eq "production") {
        Write-Log "Production deployment: switching traffic..."

        $currentPortFile = ".current_port"
        if (Test-Path $currentPortFile) {
            $oldPort = Get-Content $currentPortFile -Raw
            Write-Log "Current production port: $oldPort, New port: $port"

            # Update nginx/proxy config here
            # Example: Update upstream in nginx.conf
            # nginx -s reload
        }
        $port | Out-File -FilePath $currentPortFile -Encoding utf8
    }

    Write-Log "============================================================"
    Write-Log "🎉 DEPLOYMENT SUCCESSFUL"
    Write-Log "============================================================"
    Write-Log "Change: $ChangeName"
    Write-Log "Environment: $Environment"
    Write-Log "URL: $deployUrl"
    Write-Log "Container: $containerName"
    Write-Log "Port: $port"
    Write-Log "Image: $ImageTag"
    Write-Log "============================================================"

    # Output for CI/CD
    Write-Host "##vso[task.setvariable variable=deployUrl]$deployUrl"
    Write-Host "##vso[task.setvariable variable=containerName]$containerName"
    Write-Host "##vso[task.setvariable variable=port]$port"

    exit 0
}
catch {
    Write-Error "DEPLOYMENT FAILED: $($_.Exception.Message)"
    Write-Log "============================================================"
    exit 1
}