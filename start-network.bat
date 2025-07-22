@echo off
echo ========================================
echo   Keg Inventory - Mode Reseau Local
echo ========================================
echo.
echo Ce script active l'acces depuis le reseau local
echo (tablettes, telephones sur le meme WiFi)
echo.

echo Verification des dependances...
if not exist node_modules (
    echo Installation des dependances...
    npm install
)

echo Verification du fichier .env...
if not exist .env (
    echo Creation du fichier .env...
    call create-env.bat
)

echo.
echo Configuration pour acces reseau local...
echo.

echo Recherche de votre adresse IP...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo Adresse IP trouvee: %%b
        set LOCAL_IP=%%b
        goto :found_ip
    )
)
:found_ip

echo.
echo ========================================
echo      SERVEUR DEMARRE
echo ========================================
echo.
echo Acces local: http://localhost:5000
if defined LOCAL_IP (
    echo Acces reseau: http://%LOCAL_IP%:5000
    echo.
    echo Sur votre tablette/telephone:
    echo 1. Connectez-vous au meme WiFi
    echo 2. Ouvrez le navigateur
    echo 3. Allez sur: http://%LOCAL_IP%:5000
)
echo.
echo Appuyez sur Ctrl+C pour arreter
echo ========================================
echo.

set NODE_ENV=development
set NETWORK_ACCESS=true
echo Demarrage du serveur avec acces reseau...
npx tsx server/index.ts
if errorlevel 1 (
    echo.
    echo ERREUR: Le serveur a rencontre un probleme
    echo Verifiez que PostgreSQL est demarre
    echo.
)

echo.
echo Serveur arrete.
pause