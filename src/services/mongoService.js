// Question: Pourquoi créer des services séparés ?
// Réponse: Pour améliorer la modularité, la réutilisabilité, la testabilité, la clarté et la scalabilité de l'application.

const { ObjectId } = require('mongodb');

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('ID invalide');
  }

  const objectId = new ObjectId(id);
  const result = await collection.findOne({ _id: objectId });

  if (!result) {
    throw new Error('Document non trouvé');
  }

  return result;
}

// Export des services
module.exports = {
  findOneById,
};