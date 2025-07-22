@echo off
echo Creation du fichier .env pour l'application Keg Inventory...
echo.

if exist .env (
    echo Le fichier .env existe deja.
    echo Voulez-vous le remplacer? (O/N)
    set /p choice=
    if /i not "%choice%"=="O" (
        echo Operation annulee.
        pause
        exit /b 0
    )
)

echo DATABASE_URL=postgresql://keg_user:motdepasse123@localhost:5432/keg_inventory > .env
echo PGHOST=localhost >> .env
echo PGPORT=5432 >> .env
echo PGUSER=keg_user >> .env
echo PGPASSWORD=motdepasse123 >> .env
echo PGDATABASE=keg_inventory >> .env
echo NODE_ENV=development >> .env

echo.
echo Fichier .env cree avec succes!
echo.
echo Configuration par defaut:
echo - Base de donnees: keg_inventory
echo - Utilisateur: keg_user
echo - Mot de passe: motdepasse123
echo - Port: 5432
echo.
echo Pour modifier ces parametres, editez le fichier .env
echo.
pause