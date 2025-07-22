@echo off
echo ========================================
echo     Test Connexion Base de Donnees
echo ========================================
echo.

echo 1. Verification du fichier .env...
if not exist .env (
    echo Creation du fichier .env...
    echo DATABASE_URL=postgresql://keg_user:motdepasse123@localhost:5432/keg_inventory > .env
    echo PGHOST=localhost >> .env
    echo PGPORT=5432 >> .env
    echo PGUSER=keg_user >> .env
    echo PGPASSWORD=motdepasse123 >> .env
    echo PGDATABASE=keg_inventory >> .env
    echo NODE_ENV=development >> .env
)
echo ✓ Fichier .env present

echo.
echo 2. Contenu du fichier .env:
type .env

echo.
echo 3. Test si PostgreSQL repond sur le port 5432...
netstat -an | findstr ":5432"
if errorlevel 1 (
    echo ❌ PostgreSQL ne semble pas actif sur le port 5432
    echo.
    echo Solutions possibles:
    echo 1. Demarrer PostgreSQL avec Docker:
    echo    docker run --name keg-postgres -e POSTGRES_DB=keg_inventory -e POSTGRES_USER=keg_user -e POSTGRES_PASSWORD=motdepasse123 -p 5432:5432 -d postgres:15
    echo.
    echo 2. Ou verifier si PostgreSQL est installe localement
    echo.
) else (
    echo ✓ Un service ecoute sur le port 5432
)

echo.
echo 4. Test creation des tables...
echo Tentative de creation des tables avec Drizzle...
npm run db:push
if errorlevel 1 (
    echo ❌ Echec creation des tables
    echo Verifiez que PostgreSQL est demarre et accessible
) else (
    echo ✓ Tables creees avec succes
)

echo.
echo 5. Test de demarrage du serveur...
echo Demarrage en mode test (5 secondes)...
timeout /t 2 >nul

start /b npx tsx server/index.ts
timeout /t 3 >nul

echo.
echo 6. Test de l'API...
echo Test de l'endpoint /api/beer-types...
curl -s http://localhost:5000/api/beer-types
if errorlevel 1 (
    echo.
    echo ❌ Impossible de contacter l'API
    echo Verifiez que le serveur demarre correctement
) else (
    echo.
    echo ✓ API accessible
)

echo.
echo Test termine. Arret du serveur de test...
taskkill /f /im node.exe 2>nul
taskkill /f /im tsx.exe 2>nul

echo.
pause