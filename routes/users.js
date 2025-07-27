const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const UserController = require('../controllers/userController');

const userController = new UserController();

// Protect all routes
router.use(authenticateUser);

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
