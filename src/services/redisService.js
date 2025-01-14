// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Définir des TTL, utiliser des clés structurées, surveiller les performances, et optimiser les requêtes coûteuses.
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Utiliser des noms de clés descriptifs avec des préfixes, limiter leur longueur, éviter les caractères spéciaux, et définir des TTL pour les clés temporaires.

const redis = require("redis");
const client = redis.createClient();

// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl) {
  return new Promise((resolve, reject) => {
    client.set(key, JSON.stringify(data), "EX", ttl, (err, reply) => {
      if (err) {
        return reject(err);
      }
      resolve(reply);
    });
  });
}

module.exports = {
  cacheData,
};
