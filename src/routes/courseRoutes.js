const express = require('express');
const courseController = require('../controllers/courseController');

const courseRouter = express.Router();

courseRouter.put('/:id', courseController.updateCourse);
courseRouter.delete('/:id', courseController.deleteCourse);

courseRouter.get('/stats/overview', courseController.getCourseStats);
courseRouter.get('/stats/enrollment', courseController.getEnrollmentStats);

courseRouter.post('/:id/sections', courseController.addSection);
courseRouter.put('/:id/sections/:sectionId', courseController.updateSection);

module.exports = courseRouter;