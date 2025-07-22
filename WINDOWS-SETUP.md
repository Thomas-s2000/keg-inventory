# Installation Windows - Guide Rapide

## Installation en 5 Étapes

### 1. Cloner le Projet
```bash
git clone https://github.com/Thomas-s2000/keg-inventory.git
cd keg-inventory
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Créer la Configuration
```bash
# Exécuter le script de configuration automatique
create-env.bat
```

### 4. Démarrer PostgreSQL

#### Option A: Avec Docker (Recommandé)
```bash
docker run --name keg-postgres -e POSTGRES_DB=keg_inventory -e POSTGRES_USER=keg_user -e POSTGRES_PASSWORD=motdepasse123 -p 5432:5432 -d postgres:15
```

#### Option B: Installation PostgreSQL Classique
1. Télécharger : https://www.postgresql.org/download/windows/
2. Installer avec les paramètres par défaut
3. Créer la base de données :

```sql
-- Dans pgAdmin ou psql
CREATE DATABASE keg_inventory;
CREATE USER keg_user WITH PASSWORD 'motdepasse123';
GRANT ALL PRIVILEGES ON DATABASE keg_inventory TO keg_user;
ALTER USER keg_user CREATEDB;
```

### 5. Démarrer l'Application
```bash
# Créer les tables
npm run db:push

# Démarrer l'application
start-dev.bat
```

## Vérification

L'application sera disponible sur : http://localhost:5000

## Accès Réseau Local (Tablette)

1. **Modifier server/index.ts** :
   - Chercher : `httpServer.listen(port,`
   - Remplacer par : `httpServer.listen(port, '0.0.0.0',`

2. **Trouver votre IP** :
   ```bash
   ipconfig | findstr "IPv4"
   ```

3. **Sur la tablette** : `http://192.168.1.XXX:5000`

## Dépannage

### "Cannot find package 'dotenv'"
✅ **Résolu** : L'application utilise maintenant un système de lecture .env natif

### "Port 5000 already in use"
```bash
# Vérifier qui utilise le port
netstat -ano | findstr :5000

# Ou changer le port dans server/index.ts
const port = 3001;
```

### "Database connection failed"
```bash
# Vérifier PostgreSQL
docker ps  # Si Docker
# ou
net start postgresql-x64-15  # Si installation Windows
```

### Problèmes de permissions PostgreSQL
```sql
-- Se connecter en tant que postgres
psql -U postgres

-- Accorder tous les privilèges
GRANT ALL PRIVILEGES ON DATABASE keg_inventory TO keg_user;
GRANT ALL ON SCHEMA public TO keg_user;
GRANT CREATE ON SCHEMA public TO keg_user;
```

## Scripts Disponibles

- `create-env.bat` - Créer le fichier de configuration
- `start-dev.bat` - Démarrer en développement
- `start-prod.bat` - Construire et démarrer en production

Votre application de gestion d'inventaire de fûts est maintenant prête !