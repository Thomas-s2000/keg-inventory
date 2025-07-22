@echo off
echo Demarrage de l'application Keg Inventory...
echo Verification du fichier .env...
if not exist .env (
    echo ERREUR: Le fichier .env n'existe pas!
    echo Veuillez creer le fichier .env avec vos parametres de base de donnees.
    echo Voir INSTALLATION.md pour les instructions.
    pause
    exit /b 1
)
echo Configuration trouvee, demarrage du serveur...
set NODE_ENV=development
npx cross-env NODE_ENV=development tsx server/index.ts