@echo off
echo Test simple pour reseau...

echo 1. Test Node.js...
node --version
if errorlevel 1 (
    echo ERREUR: Node.js non trouve
    pause
    exit /b 1
)

echo 2. Test npm...
npm --version
if errorlevel 1 (
    echo ERREUR: npm non trouve
    pause
    exit /b 1
)

echo 3. Test package.json...
if not exist package.json (
    echo ERREUR: package.json manquant
    pause
    exit /b 1
)

echo 4. Test dependencies...
if not exist node_modules npm install

echo 5. Test fichier .env...
if not exist .env (
    echo Creation .env...
    echo DATABASE_URL=postgresql://keg_user:motdepasse123@localhost:5432/keg_inventory > .env
    echo NODE_ENV=development >> .env
)

echo 6. Test serveur simple...
echo Test avec variables d'environnement...

set NODE_ENV=development
set NETWORK_ACCESS=true

echo Variables definies:
echo NODE_ENV=%NODE_ENV%
echo NETWORK_ACCESS=%NETWORK_ACCESS%

echo.
echo Lancement du serveur...
echo Si ca crash, l'erreur s'affichera ci-dessous:
echo ================================================

npx tsx server/index.ts

echo ================================================
echo Test termine.
pause