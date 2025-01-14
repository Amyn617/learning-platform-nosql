const { MongoClient } = require("mongodb");
const redis = require("redis");
const config = require("./env");

// Variables pour stocker les instances des clients
let mongoClient, redisClient, db;

// Fonction de tentative avec retry
async function withRetry(operation, attempts = RETRY_ATTEMPTS) {
  let lastError;

  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Tentative ${i + 1}/${attempts} échouée:`, error.message);

      if (i < attempts - 1) {
        await wait(RETRY_DELAY);
      }
    }
  }
  throw lastError;
}

// Connexion à MongoDB avec gestion des erreurs et retries
async function connectMongo() {
  try {
    if (!mongoClient) {
      // return withRetry(async () => {
      mongoClient = new MongoClient(config.mongodb.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });

      await mongoClient.connect();
      db = mongoClient.db(config.mongodb.dbName);
      console.log("dgdg");
    }
    return db;
  } catch (error) {
    throw error;
  }
}

// Fonction de tentative avec retry
async function withRetry(operation, attempts = RETRY_ATTEMPTS) {
  let lastError;

  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Tentative ${i + 1}/${attempts} échouée:`, error.message);

      if (i < attempts - 1) {
        await wait(RETRY_DELAY);
      }
    }
  }

  throw lastError;
}

// Connexion à Redis avec gestion des erreurs et retries
async function connectRedis() {
  if (redisClient?.isReady) return redisClient;

  return withRetry(async () => {
    redisClient = redis.createClient({
      url: config.redis.url,
      retry_strategy: function (options) {
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error("Retry time exhausted");
        }
        return Math.min(options.attempt * 100, 3000);
      },
    });

    // Gestionnaires d'événements Redis
    redisClient.on("error", (err) => console.error("Erreur Redis:", err));
    redisClient.on("reconnecting", () =>
      console.log("Redis: tentative de reconnexion...")
    );

    await redisClient.connect();
    console.log("Redis connecté avec succès");

    return redisClient;
  });
}

// Fonction de fermeture propre des connexions
async function disconnect() {
  const tasks = [];

  if (mongoClient) {
    tasks.push(
      mongoClient
        .close()
        .then(() => console.log("MongoDB déconnecté"))
        .catch((err) =>
          console.error("Erreur lors de la déconnexion MongoDB:", err)
        )
    );
  }

  if (redisClient?.isReady) {
    tasks.push(
      redisClient
        .quit()
        .then(() => console.log("Redis déconnecté"))
        .catch((err) =>
          console.error("Erreur lors de la déconnexion Redis:", err)
        )
    );
  }

  await Promise.allSettled(tasks);
}

// Fonction pour vérifier l'état des connexions
async function checkConnections() {
  const status = {
    mongodb: false,
    redis: false,
  };

  try {
    if (db) {
      await db.command({ ping: 1 });
      status.mongodb = true;
    }
  } catch (error) {
    console.error("MongoDB health check failed:", error);
  }

  try {
    if (redisClient?.isReady) {
      await redisClient.ping();
      status.redis = true;
    }
  } catch (error) {
    console.error("Redis health check failed:", error);
  }

  return status;
}

// Export des fonctions et clients
module.exports = {
  connectMongo,
  connectRedis,
  disconnect,
  checkConnections,
  getMongoDb: () => db,
  getRedisClient: () => redisClient,
};
