const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const UserController = require('../controllers/userController');

const userController = new UserController();

// Public routes (no authentication required)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/password-reset', userController.requestPasswordReset);

// Protected routes (authentication required)
router.use(authenticateUser);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
