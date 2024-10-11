
# depot-direct-app

Dépôt de fichiers pour la communauté UdeM

## Frontend

Le frontend de cette application est construit avec Angular version 16.2.1. Il fournit une interface conviviale pour le téléchargement de fichiers et d'autres fonctionnalités.

## Backend

Le backend est développé avec Node.js et utilise un serveur personnalisé pour gérer les requêtes API et les téléchargements de fichiers.

### Serveur de développement

Pour exécuter le serveur de développement du frontend, utilisez la commande suivante :

```bash
ng serve
```

Naviguez vers `http://localhost:4200/` pour accéder au frontend. L'application se rechargera automatiquement lorsque vous apporterez des modifications à l'un des fichiers du frontend.

### Serveur backend

Pour démarrer le serveur Node.js backend, utilisez :

```bash
node server.js
```

Cela gérera les processus backend, y compris les téléchargements de fichiers et le service des API.

## Build et Tests

Suivez les processus habituels de construction et de tests pour Angular et Node.js, comme mentionné dans les sections ci-dessous.
