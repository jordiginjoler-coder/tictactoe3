@echo off
chcp 65001 >nul

echo =========================================
echo GIT INITIALIZATION
echo =========================================

:: Usar directorio donde esta el script (robusto si mueves el proyecto)
cd /d "%~dp0"

echo [1/6] Inicializando repositorio Git...
git init
if errorlevel 1 (
    echo ERROR: No se pudo inicializar el repositorio Git
    pause
    exit /b 1
)
echo OK: Repositorio Git inicializado correctamente

echo [2/6] Agregando todos los archivos...
git add -A
if errorlevel 1 (
    echo ERROR: No se pudieron agregar los archivos
    pause
    exit /b 1
)
echo OK: Todos los archivos agregados

echo [3/6] Configurando usuario (local, no global)...
git config user.email "jordiginjoler@gmail.com"
if errorlevel 1 (
    echo ERROR: No se pudo configurar el email
    pause
    exit /b 1
)
git config user.name "Jordi"
if errorlevel 1 (
    echo ERROR: No se pudo configurar el nombre
    pause
    exit /b 1
)
echo OK: Usuario configurado localmente (jordiginjoler@gmail.com / Jordi)

echo [4/6] Creando commit inicial...
git commit -m "chore: initial commit - project setup"
if errorlevel 1 (
    echo WARNING: No hay cambios para commit (archivos en .gitignore?)
) else (
    echo OK: Commit inicial creado
)

echo [5/6] Verificando remote 'origin'...
git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo AVISO: No hay remote 'origin' configurado
    echo.
    echo Para conectar con GitHub, ejecuta despues:
    echo   git remote add origin https://github.com/USUARIO/REPO.git
    echo   git push -u origin main
) else (
    echo OK: Remote 'origin' configurado
    git remote get-url origin
)

echo [6/6] Estado final del repositorio...
git status
echo.

echo =========================================
echo RESUMEN
echo =========================================
echo OK: Git repository: Creado
echo OK: Archivos: Agregados
echo OK: Usuario local: jordiginjoler@gmail.com (Jordi)
echo OK: Commit inicial: Creado
echo.
echo Proximos pasos:
echo   1. Crea el repo en GitHub: https://github.com/new
echo   2. git remote add origin https://github.com/jordiginjoler-coder/TU-REPO.git
echo   3. git push -u origin main
echo =========================================
pause
exit /b 0