const express = require("express");
const config = require("./config/env");
const db = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

// Fonction pour configurer les middlewares Express
function setupMiddlewares(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

// Fonction pour configurer les routes
function setupRoutes(app) {
  app.use("/api/courses", courseRoutes);
  app.use("/api/students", studentRoutes);

  // Middleware de gestion d'erreurs global
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Une erreur est survenue" });
  });
}

// Fonction pour la fermeture propre des connexions
async function gracefulShutdown() {
  try {
    console.log("Arrêt du serveur...");
    await db.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de l'arrêt:", error);
    process.exit(1);
  }
}

// Fonction principale de démarrage
async function startServer() {
  try {
    // 1. Connexion à la base de données
    await db.connectMongo();
    console.log("Connecté à la base de données");

    // 2. Configuration des middlewares
    setupMiddlewares(app);

    // 3. Configuration des routes
    setupRoutes(app);

    // 4. Démarrage du serveur
    const server = app.listen(config.port, () => {
      console.log(`Serveur démarré sur le port ${config.port}`);
    });

    // Gestion des signaux d'arrêt
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
}

// Démarrage de l'application
startServer();
