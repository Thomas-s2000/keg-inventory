# Application de Gestion d'Inventaire de Fûts

Application web moderne pour gérer l'inventaire de fûts de bière avec interface sombre et responsive optimisée pour tablettes.

## Installation Complète

### Prérequis

1. **Node.js** (version 18 ou plus récente)
   - Télécharger depuis: https://nodejs.org/
   - Vérifier l'installation: `node --version`

2. **PostgreSQL** (version 12 ou plus récente)
   - Télécharger depuis: https://www.postgresql.org/download/

3. **Git** 
   - Télécharger depuis: https://git-scm.com/

### Étape 1: Cloner le Projet

```bash
# Cloner le repository
git clone [URL_DU_REPOSITORY]

# Aller dans le dossier du projet
cd keg-inventory

# Vérifier les fichiers
ls -la
```

### Étape 2: Installation des Dépendances

```bash
# Installer toutes les dépendances Node.js
npm install

# Cela va installer toutes les dépendances listées dans package.json
```

### Étape 3: Configuration PostgreSQL

#### Option A: Installation Locale PostgreSQL

**Sur Windows:**
1. Télécharger PostgreSQL depuis https://www.postgresql.org/download/windows/
2. Installer avec les paramètres par défaut
3. Noter le mot de passe du superutilisateur 'postgres'

**Sur macOS:**
```bash
# Avec Homebrew
brew install postgresql
brew services start postgresql
```

**Sur Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Configuration de la Base de Données

```bash
# Se connecter à PostgreSQL (mot de passe demandé)
sudo -u postgres psql

# Dans l'interface PostgreSQL, exécuter:
CREATE DATABASE keg_inventory;
CREATE USER keg_user WITH PASSWORD 'motdepasse123';
GRANT ALL PRIVILEGES ON DATABASE keg_inventory TO keg_user;
\q
```

#### Option B: PostgreSQL avec Docker (Recommandé)

```bash
# Installer Docker Desktop depuis https://www.docker.com/

# Lancer PostgreSQL
docker run --name keg-postgres \
  -e POSTGRES_DB=keg_inventory \
  -e POSTGRES_USER=keg_user \
  -e POSTGRES_PASSWORD=motdepasse123 \
  -p 5432:5432 \
  -d postgres:15

# Vérifier que le conteneur fonctionne
docker ps
```

### Étape 4: Configuration des Variables d'Environnement

Créer un fichier `.env` dans le dossier racine du projet:

```bash
# Créer le fichier .env
touch .env

# Ou sur Windows:
type nul > .env
```

Contenu du fichier `.env`:
```env
DATABASE_URL=postgresql://keg_user:motdepasse123@localhost:5432/keg_inventory
PGHOST=localhost
PGPORT=5432
PGUSER=keg_user
PGPASSWORD=motdepasse123
PGDATABASE=keg_inventory
NODE_ENV=development
```

### Étape 5: Initialisation de la Base de Données

```bash
# Créer les tables dans la base de données
npm run db:push

# Vous devriez voir: "No changes detected" si tout est ok
```

### Étape 6: Lancement de l'Application

```bash
# Démarrer le serveur de développement
npm run dev

# L'application sera disponible sur:
# http://localhost:5000
```

## Accès depuis le Réseau Local (Tablette/Téléphone)

### Étape 1: Modifier la Configuration Serveur

Éditer le fichier `server/index.ts` et modifier cette ligne:
```typescript
// Chercher cette ligne:
httpServer.listen(port, () => {

// La remplacer par:
httpServer.listen(port, '0.0.0.0', () => {
```

### Étape 2: Trouver l'Adresse IP de votre Ordinateur

```bash
# Windows:
ipconfig

# macOS/Linux:
ifconfig
# ou
hostname -I
```

Chercher votre adresse IP locale (généralement 192.168.1.XXX)

### Étape 3: Configurer le Pare-feu

**Windows:**
1. Aller dans "Paramètres Windows" > "Réseau et Internet" > "Pare-feu Windows"
2. Cliquer sur "Paramètres avancés"
3. Créer une nouvelle règle entrante pour le port 5000

**macOS:**
```bash
# Permettre les connexions sur le port 5000
sudo pfctl -f /etc/pf.conf
```

**Linux:**
```bash
# Avec ufw
sudo ufw allow 5000

# Avec iptables
sudo iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
```

### Étape 4: Accès depuis la Tablette

1. Connecter la tablette au même réseau WiFi
2. Ouvrir le navigateur sur la tablette
3. Aller à: `http://192.168.1.XXX:5000` (remplacer XXX par votre IP)

## Scripts Disponibles

```bash
# Développement
npm run dev              # Lancer en mode développement

# Production
npm run build           # Construire l'application
npm start              # Lancer en mode production

# Base de données
npm run db:push        # Mettre à jour le schéma de la base
npm run db:studio      # Interface graphique pour la base

# Tests
npm test               # Lancer les tests (si disponibles)
```

## Dépannage

### Problème: Port 5000 déjà utilisé
```bash
# Trouver quel processus utilise le port
lsof -i :5000

# Ou modifier le port dans server/index.ts:
const port = 3000;
```

### Problème: Erreur de connexion à la base
```bash
# Vérifier que PostgreSQL fonctionne
sudo systemctl status postgresql

# Ou avec Docker:
docker ps
docker logs keg-postgres
```

### Problème: L'application n'est pas accessible depuis la tablette
1. Vérifier l'adresse IP: `ping 192.168.1.XXX`
2. Vérifier le pare-feu
3. S'assurer que le serveur écoute sur `0.0.0.0`

## Structure du Projet

```
keg-inventory/
├── client/          # Application frontend React
├── server/          # Serveur backend Express
├── shared/          # Types et schémas partagés
├── package.json     # Dépendances et scripts
├── .env            # Variables d'environnement
└── README.md       # Ce fichier
```

L'application est maintenant prête à être utilisée sur votre réseau local!