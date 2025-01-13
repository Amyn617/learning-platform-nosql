// routes/courseRoutes.js
const express = require('express');
const courseRouter = express.Router();
const courseController = require('../controllers/courseController');
const { validateCourse, checkCourseExists } = require('../middlewares/courseValidation');
const { requireAuth, isAdmin } = require('../middlewares/auth');

/**
 * Routes pour la gestion des cours
 * Base URL: /api/courses
 */

// Routes publiques
router.get('/', courseController.listCourses);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/:id', checkCourseExists, courseController.getCourseById);
router.get('/:id/preview', checkCourseExists, courseController.getCoursePreview);

// Routes protégées (nécessitent authentification)
router.use(requireAuth);

// Routes pour les instructeurs et administrateurs
router.post('/', 
  isAdmin,
  validateCourse, 
  courseController.createCourse
);

router.put('/:id',
  isAdmin,
  checkCourseExists,
  validateCourse,
  courseController.updateCourse
);

router.delete('/:id',
  isAdmin,
  checkCourseExists,
  courseController.deleteCourse
);

// Routes pour les statistiques et rapports
router.get('/stats/overview', isAdmin, courseController.getCourseStats);
router.get('/stats/enrollment', isAdmin, courseController.getEnrollmentStats);

// Gestion des sections de cours
router.post('/:id/sections',
  isAdmin,
  checkCourseExists,
  courseController.addSection
);

router.put('/:id/sections/:sectionId',
  isAdmin,
  checkCourseExists,
  courseController.updateSection
);

module.exports = courseRouter;