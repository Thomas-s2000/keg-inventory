# Guide d'Installation Complet - Inventaire de Fûts

## Méthode 1: Cloner depuis un Repository Git

### Étape 1: Créer un Repository Git

Si vous voulez partager ce projet, vous devez d'abord créer un repository:

#### Sur GitHub:
1. Aller sur https://github.com
2. Cliquer sur "New repository"
3. Nommer le repository: `keg-inventory`
4. Choisir "Public" ou "Private"
5. Ne pas initialiser avec README (on en a déjà un)
6. Cliquer "Create repository"

#### Depuis Replit vers GitHub:
```bash
# Dans le terminal de Replit:
git init
git add .
git commit -m "Initial commit - Keg Inventory App"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/keg-inventory.git
git push -u origin main
```

### Étape 2: Cloner sur votre Ordinateur Local

```bash
# Ouvrir un terminal et naviguer où vous voulez le projet
cd ~/Documents  # ou C:\Users\VotreNom\Documents sur Windows

# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/keg-inventory.git

# Aller dans le dossier
cd keg-inventory

# Vérifier que tous les fichiers sont là
ls -la  # ou dir sur Windows
```

## Méthode 2: Télécharger les Fichiers Directement

### Depuis Replit:
1. Dans Replit, cliquer sur les 3 points (...) en haut à droite
2. Choisir "Download as zip"
3. Extraire le fichier ZIP sur votre ordinateur
4. Ouvrir un terminal dans le dossier extrait

## Installation des Outils Nécessaires

### 1. Installer Node.js

**Windows:**
1. Aller sur https://nodejs.org/
2. Télécharger la version LTS (recommandée)
3. Exécuter l'installateur et suivre les instructions
4. Redémarrer votre ordinateur

**macOS:**
```bash
# Avec Homebrew (recommandé)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node

# Ou télécharger depuis https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
# Mettre à jour les paquets
sudo apt update

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### 2. Installer PostgreSQL

**Windows:**
1. Aller sur https://www.postgresql.org/download/windows/
2. Télécharger PostgreSQL (version 15 ou plus récente)
3. Exécuter l'installateur
4. **IMPORTANT:** Noter le mot de passe du superutilisateur 'postgres'
5. Garder le port par défaut (5432)

**macOS:**
```bash
# Avec Homebrew
brew install postgresql@15
brew services start postgresql@15

# Ou télécharger depuis https://postgresapp.com/
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Alternative: PostgreSQL avec Docker (Plus Simple)

Si vous préférez éviter l'installation complète de PostgreSQL:

```bash
# Installer Docker Desktop
# Windows/macOS: https://www.docker.com/products/docker-desktop/
# Linux: https://docs.docker.com/engine/install/

# Lancer PostgreSQL dans un conteneur
docker run --name keg-postgres \
  -e POSTGRES_DB=keg_inventory \
  -e POSTGRES_USER=keg_user \
  -e POSTGRES_PASSWORD=motdepasse123 \
  -p 5432:5432 \
  -d postgres:15
```

## Configuration du Projet

### 1. Installer les Dépendances
```bash
# Dans le dossier du projet
npm install

# Cela peut prendre quelques minutes
```

### 2. Configurer la Base de Données

#### Si PostgreSQL est installé localement:
```bash
# Se connecter à PostgreSQL
# Windows: utiliser pgAdmin ou la ligne de commande psql
# macOS/Linux:
sudo -u postgres psql

# Dans PostgreSQL, créer la base et l'utilisateur:
CREATE DATABASE keg_inventory;
CREATE USER keg_user WITH PASSWORD 'motdepasse123';
GRANT ALL PRIVILEGES ON DATABASE keg_inventory TO keg_user;
ALTER USER keg_user CREATEDB;
\q
```

### 3. Créer le Fichier de Configuration

```bash
# Créer le fichier .env dans le dossier racine
# Windows:
echo. > .env

# macOS/Linux:
touch .env
```

**Contenu du fichier .env:**
```env
DATABASE_URL=postgresql://keg_user:motdepasse123@localhost:5432/keg_inventory
PGHOST=localhost
PGPORT=5432
PGUSER=keg_user
PGPASSWORD=motdepasse123
PGDATABASE=keg_inventory
NODE_ENV=development
```

### 4. Initialiser la Base de Données
```bash
# Créer les tables
npm run db:push

# Si tout va bien, vous verrez:
# "No changes detected" ou "Tables created successfully"
```

### 5. Tester l'Application
```bash
# Lancer l'application
npm run dev

# Ouvrir votre navigateur sur:
# http://localhost:5000
```

## Configuration pour le Réseau Local

### 1. Modifier le Serveur
Éditer le fichier `server/index.ts`:

```typescript
// Trouver cette ligne (vers la fin du fichier):
httpServer.listen(port, () => {

// La remplacer par:
httpServer.listen(port, '0.0.0.0', () => {
```

### 2. Redémarrer l'Application
```bash
# Arrêter avec Ctrl+C, puis relancer:
npm run dev
```

### 3. Trouver votre Adresse IP
```bash
# Windows:
ipconfig | findstr "IPv4"

# macOS:
ifconfig | grep "inet 192"

# Linux:
hostname -I
```

### 4. Accès depuis la Tablette
1. Connecter la tablette au même WiFi
2. Ouvrir un navigateur sur la tablette
3. Aller à: `http://VOTRE_IP:5000`
   - Exemple: `http://192.168.1.145:5000`

## Vérification que Tout Fonctionne

### Tests à Faire:
1. ✅ Ajouter un type de bière (ex: "Blonde", 50 fûts)
2. ✅ Ajouter des fûts (+10)
3. ✅ Enlever des fûts (-5)
4. ✅ Supprimer un type de bière
5. ✅ Accéder depuis la tablette

### Si Quelque Chose ne Fonctionne Pas:

**Erreur "Port 5000 already in use":**
```bash
# Changer le port dans server/index.ts
const port = 3001; // au lieu de 5000
```

**Erreur de base de données:**
```bash
# Vérifier que PostgreSQL fonctionne
# Windows: Services → PostgreSQL
# macOS/Linux:
sudo systemctl status postgresql

# Ou avec Docker:
docker ps
```

**L'app n'est pas accessible depuis la tablette:**
1. Vérifier l'IP: `ping VOTRE_IP` depuis la tablette
2. Désactiver temporairement le pare-feu
3. S'assurer que le serveur écoute sur `0.0.0.0`

## Scripts Utiles

```bash
# Développement
npm run dev                 # Lancer en mode développement

# Production
npm run build              # Construire l'application
npm start                  # Lancer en production

# Base de données
npm run db:push           # Mettre à jour les tables
npm run db:studio         # Interface graphique pour la DB

# Maintenance
npm install               # Réinstaller les dépendances
npm update               # Mettre à jour les dépendances
```

Votre application de gestion d'inventaire de fûts est maintenant prête à être utilisée!