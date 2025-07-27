const { admin, db, auth } = require('./../services/firebase');

class SessionController {

  // Create a new planning session
  async createSession(req, res) {
    try {
      const { name, pointSystem, isPublic } = req.body;
      const userId = req.user.uid;
      
      const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const session = {
        name,
        pointSystem,
        isPublic,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        participants: [userId],
        sessionCode,
        status: 'active',
        currentVoting: null
      };

      await db.collection('sessions').doc(sessionCode).set(session);
      
      res.status(201).json({ 
        message: 'Session created successfully',
        sessionCode,
        session 
      });
    } catch (error) {
      console.error('Create Session Error:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  }

  // Join a session
  async joinSession(req, res) {
    try {
      const { sessionCode } = req.params;
      const userId = req.user.uid;

      const sessionRef = db.collection('sessions').doc(sessionCode);
      const session = await sessionRef.get();

      if (!session.exists) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const sessionData = session.data();
      if (!sessionData.isPublic && !sessionData.participants.includes(userId)) {
        return res.status(403).json({ error: 'Not authorized to join this session' });
      }

      if (!sessionData.participants.includes(userId)) {
        await sessionRef.update({
          participants: [...sessionData.participants, userId]
        });
      }

      res.json({ message: 'Joined session successfully', session: sessionData });
    } catch (error) {
      console.error('Join Session Error:', error);
      res.status(500).json({ error: 'Failed to join session' });
    }
  }

  // Submit vote
  async submitVote(req, res) {
    try {
      const { sessionCode } = req.params;
      const { vote } = req.body;
      const userId = req.user.uid;

      const sessionRef = db.collection('sessions').doc(sessionCode);
      const session = await sessionRef.get();

      if (!session.exists) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const votingRef = sessionRef.collection('voting').doc('current');
      await votingRef.set({
        [userId]: {
          vote,
          timestamp: new Date().toISOString()
        }
      }, { merge: true });

      res.json({ message: 'Vote submitted successfully' });
    } catch (error) {
      console.error('Submit Vote Error:', error);
      res.status(500).json({ error: 'Failed to submit vote' });
    }
  }

  // Reveal votes
  async revealVotes(req, res) {
    try {
      const { sessionCode } = req.params;
      const userId = req.user.uid;

      const sessionRef = db.collection('sessions').doc(sessionCode);
      const session = await sessionRef.get();

      if (!session.exists) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const sessionData = session.data();
      if (sessionData.createdBy !== userId) {
        return res.status(403).json({ error: 'Only session creator can reveal votes' });
      }

      const votingRef = sessionRef.collection('voting').doc('current');
      const votes = await votingRef.get();
      
      if (!votes.exists) {
        return res.status(404).json({ error: 'No votes found' });
      }

      const votesData = votes.data();
      const voteValues = Object.values(votesData).map(v => v.vote);
      const average = voteValues.reduce((a, b) => a + b, 0) / voteValues.length;

      await sessionRef.update({
        lastVoting: {
          votes: votesData,
          average,
          revealedAt: new Date().toISOString()
        }
      });

      res.json({ 
        message: 'Votes revealed',
        votes: votesData,
        average
      });
    } catch (error) {
      console.error('Reveal Votes Error:', error);
      res.status(500).json({ error: 'Failed to reveal votes' });
    }
  }

  // Get session history
  async getSessionHistory(req, res) {
    try {
      const userId = req.user.uid;
      
      const sessionsSnapshot = await db.collection('sessions')
        .where('participants', 'array-contains', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const sessions = [];
      sessionsSnapshot.forEach(doc => {
        sessions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.json({ sessions });
    } catch (error) {
      console.error('Get Session History Error:', error);
      res.status(500).json({ error: 'Failed to get session history' });
    }
  }
}

module.exports = SessionController;