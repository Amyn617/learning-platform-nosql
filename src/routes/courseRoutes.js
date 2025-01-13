const express = require('express');
const courseController = require('../controllers/courseController');

const courseRouter = express.Router();

// Define your routes here
courseRouter.put('/:id', courseController.updateCourse);
courseRouter.delete('/:id', courseController.deleteCourse);

// Routes pour les statistiques et rapports
courseRouter.get('/stats/overview', courseController.getCourseStats);
courseRouter.get('/stats/enrollment', courseController.getEnrollmentStats);

// Gestion des sections de cours
courseRouter.post('/:id/sections', courseController.addSection);
courseRouter.put('/:id/sections/:sectionId', courseController.updateSection);

module.exports = courseRouter;