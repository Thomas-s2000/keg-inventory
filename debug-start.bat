@echo off
echo ========================================
echo      Debug Application Keg Inventory
echo ========================================
echo.

echo 1. Verification Node.js...
node --version
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou pas dans le PATH
    echo Telecharger depuis: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js trouve

echo.
echo 2. Verification npm...
npm --version
if errorlevel 1 (
    echo ERREUR: npm n'est pas disponible
    pause
    exit /b 1
)
echo ✓ npm trouve

echo.
echo 3. Verification dossier projet...
if not exist package.json (
    echo ERREUR: Vous n'etes pas dans le bon dossier
    echo Le fichier package.json est manquant
    echo Allez dans le dossier keg-inventory
    pause
    exit /b 1
)
echo ✓ package.json trouve

echo.
echo 4. Verification dependances...
if not exist node_modules (
    echo Installation des dependances...
    npm install
    if errorlevel 1 (
        echo ERREUR: Echec installation dependances
        pause
        exit /b 1
    )
)
echo ✓ Dependencies installees

echo.
echo 5. Verification fichier .env...
if not exist .env (
    echo Creation du fichier .env...
    call create-env.bat
)
echo ✓ Fichier .env present

echo.
echo 6. Test de connexion base de donnees...
echo Verification si PostgreSQL est accessible...
timeout /t 2 >nul

echo.
echo 7. Demarrage du serveur...
echo URL: http://localhost:5000
echo Pour arreter: Ctrl+C
echo.
echo Si le serveur ne demarre pas, lisez l'erreur ci-dessous:
echo --------------------------------------------------------
set NODE_ENV=development
npx tsx server/index.ts

echo.
echo --------------------------------------------------------
echo Le serveur s'est arrete.
echo Verifiez les erreurs ci-dessus.
echo.
pause