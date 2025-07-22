@echo off
echo Construction et demarrage en production...
set NODE_ENV=production
npm run build
node dist/index.js