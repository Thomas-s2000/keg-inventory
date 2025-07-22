@echo off
echo ========================================
echo   Keg Inventory - Mode Reseau Local
echo ========================================
echo.

echo Verification des dependances...
if not exist node_modules npm install

echo Verification du fichier .env...
if not exist .env call create-env.bat

echo.
echo Demarrage serveur avec acces reseau...
echo.
echo IMPORTANT: Trouvez votre IP avec cette commande:
echo ipconfig | findstr "IPv4"
echo.
echo Sur votre tablette, utilisez: http://VOTRE_IP:5000
echo (Remplacez VOTRE_IP par l'adresse trouvee ci-dessus)
echo.
echo Appuyez sur une touche pour continuer...
pause >nul

echo.
echo Demarrage du serveur...
echo Local: http://localhost:5000
echo Reseau: http://[VOTRE_IP]:5000
echo.

set NODE_ENV=development
set NETWORK_ACCESS=true
npx tsx server/index.ts

echo.
echo Serveur arrete.
pause