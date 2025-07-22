@echo off
echo Demarrage de l'application Keg Inventory...
echo.

echo Verification des dependances...
if not exist node_modules (
    echo Installation des dependances en cours...
    npm install
    if errorlevel 1 (
        echo ERREUR: Echec de l'installation des dependances
        pause
        exit /b 1
    )
)

echo Verification du fichier .env...
if not exist .env (
    echo ERREUR: Le fichier .env n'existe pas!
    echo Creation automatique du fichier .env...
    call create-env.bat
    echo.
    echo Fichier .env cree. Redemarrage...
    echo.
)

echo Configuration trouvee, demarrage du serveur...
echo URL: http://localhost:5000
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
set NODE_ENV=development
npx tsx server/index.ts
echo.
echo Le serveur s'est arrete.
pause