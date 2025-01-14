# Learning Platform Template

Projet NoSQL, ENSET Mohammedia

## Description

Ce projet est une plateforme d'apprentissage utilisant MongoDB et Redis pour la gestion des données et du cache. Il est construit avec Express.js et suit les bonnes pratiques de modularité et de gestion des configurations.

## Prérequis

- Node.js
- MongoDB
- Redis

## Installation

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/Amyn617/learning-platform-nosql
    cd learning-platform-template
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```

3. Configurez les variables d'environnement en créant un fichier [.env](http://_vscodecontentref_/0) à la racine du projet :
    ```properties
    MONGO_URI=mongodb://127.0.0.1:27017
    MONGODB_DB_NAME=learning_platform
    REDIS_URI=redis://localhost:6379
    PORT=3000
    ```

## Démarrage

Pour démarrer le serveur, utilisez la commande suivante :
```bash
npm start