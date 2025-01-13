const { ObjectId } = require("mongodb");
const db = require("../config/db");
const mongoService = require("../services/mongoService");
const redisService = require("../services/redisService");

// Constantes pour les messages d'erreur
const ERRORS = {
  INVALID_INPUT: "Données d'entrée invalides",
  NOT_FOUND: "Cours non trouvé",
  SERVER_ERROR: "Erreur serveur interne",
};

/**
 * Crée un nouveau cours
 * Le contrôleur:
 * 1. Valide les données d'entrée
 * 2. Appelle les services pour la logique métier
 * 3. Gère la réponse HTTP
 */
async function createCourse(req, res) {
  try {
    const { title, description, duration } = req.body;

    // Validation des données d'entrée
    if (!title || !description || !duration) {
      return res.status(400).json({
        error: ERRORS.INVALID_INPUT,
        details: "Tous les champs sont requis",
      });
    }

    // Appel au service pour la création
    const course = await mongoService.createCourse({
      title,
      description,
      duration,
    });

    // Invalider le cache
    await redisService.invalidateCourseCache();

    // Réponse avec le nouveau cours
    res.status(201).json(course);
  } catch (error) {
    console.error("Erreur création cours:", error);
    res.status(500).json({ error: ERRORS.SERVER_ERROR });
  }
}

/**
 * Récupère un cours par son ID
 * Utilise le cache Redis si disponible
 */
async function getCourseById(req, res) {
  try {
    const courseId = req.params.id;

    // Validation de l'ID
    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({
        error: ERRORS.INVALID_INPUT,
        details: "ID de cours invalide",
      });
    }

    // Tentative de récupération depuis le cache
    let course = await redisService.getCourseFromCache(courseId);

    if (!course) {
      // Si pas en cache, récupération depuis MongoDB
      course = await mongoService.getCourseById(courseId);

      if (!course) {
        return res.status(404).json({ error: ERRORS.NOT_FOUND });
      }

      // Mise en cache pour les prochaines requêtes
      await redisService.cacheCourse(courseId, course);
    }

    res.json(course);
  } catch (error) {
    console.error("Erreur récupération cours:", error);
    res.status(500).json({ error: ERRORS.SERVER_ERROR });
  }
}

/**
 * Met à jour un cours existant
 */
async function updateCourse(req, res) {
  try {
    const courseId = req.params.id;
    const updates = req.body;

    // Validation
    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({
        error: ERRORS.INVALID_INPUT,
        details: "ID de cours invalide",
      });
    }

    // Mise à jour via le service
    const updatedCourse = await mongoService.updateCourse(courseId, updates);

    if (!updatedCourse) {
      return res.status(404).json({ error: ERRORS.NOT_FOUND });
    }

    // Invalidation du cache
    await redisService.invalidateCourseCache(courseId);

    res.json(updatedCourse);
  } catch (error) {
    console.error("Erreur mise à jour cours:", error);
    res.status(500).json({ error: ERRORS.SERVER_ERROR });
  }
}

/**
 * Supprime un cours
 */
async function deleteCourse(req, res) {
  try {
    const courseId = req.params.id;

    // Validation
    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({
        error: ERRORS.INVALID_INPUT,
        details: "ID de cours invalide",
      });
    }

    // Suppression via le service
    const result = await mongoService.deleteCourse(courseId);

    if (!result) {
      return res.status(404).json({ error: ERRORS.NOT_FOUND });
    }

    // Nettoyage du cache
    await redisService.invalidateCourseCache(courseId);

    res.status(204).send();
  } catch (error) {
    console.error("Erreur suppression cours:", error);
    res.status(500).json({ error: ERRORS.SERVER_ERROR });
  }
}

// Export des contrôleurs
module.exports = {
  updateCourse: (req, res) => {
    res.send("Course updated");
  },
  deleteCourse: (req, res) => {
    res.send("Course deleted");
  },
  getCourseStats: (req, res) => {
    res.send("Course stats");
  },
  getEnrollmentStats: (req, res) => {
    res.send("Enrollment stats");
  },
  addSection: (req, res) => {
    res.send("Section added");
  },
  updateSection: (req, res) => {
    res.send("Section updated");
  },
};
