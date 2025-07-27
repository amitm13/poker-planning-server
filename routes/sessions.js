const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const SessionController = require('../controllers/sessionController');

const sessionController = new SessionController();

// Protect all routes
router.use(authenticateUser);

// Session routes
router.post('/create', sessionController.createSession);
router.post('/:sessionCode/join', sessionController.joinSession);
router.post('/:sessionCode/vote', sessionController.submitVote);
router.post('/:sessionCode/reveal', sessionController.revealVotes);
router.get('/history', sessionController.getSessionHistory);

module.exports = router;
