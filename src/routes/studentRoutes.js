const express = require('express');
const studentRouter = express.Router();

// Define your student routes here
studentRouter.get('/', (req, res) => {
  res.send('Student route');
});

module.exports = studentRouter;