// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : La validation des variables d'environnement au démarrage contribue à la sécurité, la fiabilité, et la facilité de débogage de l'application.
// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : L'application peut échouer à démarrer, se comporter de manière inattendue, générer des erreurs ou exposer des vulnérabilités de sécurité.

// config/env.js
require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGODB_DB_NAME,
  },
  redis: {
    url: process.env.REDIS_URI,
  },
};

function validateEnv() {
  const requiredEnvVars = ["MONGO_URI", "MONGODB_DB_NAME", "REDIS_URI"];
  
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`La variable d'environnement requise ${varName} est manquante.`);
    }
  });
}

// Appeler la fonction de validation au démarrage
validateEnv();

module.exports = config;
