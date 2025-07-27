const { auth, db } = require('../services/firebase');

class UserController {
  // Register new user
  async register(req, res) {
    try {
      const { email, password, displayName } = req.body;

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: false
      });

      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email,
        displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      res.status(201).json({ 
        message: 'User registered successfully',
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName
        }
      });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(400).json({ 
        error: 'Failed to register user',
        message: error.message 
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      // Verify the Firebase ID token
      const { authorization } = req.headers;
      
      if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const idToken = authorization.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);
      
      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      res.json({
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          ...userData
        }
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(401).json({ 
        error: 'Authentication failed',
        message: error.message 
      });
    }
  }

  // Password reset request
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      
      await auth.generatePasswordResetLink(email);
      
      res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      console.error('Password Reset Error:', error);
      res.status(400).json({ 
        error: 'Failed to send password reset email',
        message: error.message 
      });
    }
  }
  // Update user profile
  async updateProfile(req, res) {
    try {
      const { displayName, photoURL } = req.body;
      const userId = req.user.uid;

      await auth.updateUser(userId, {
        displayName,
        photoURL
      });

      await db.collection('users').doc(userId).set({
        displayName,
        photoURL,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Update Profile Error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.uid;
      const userRecord = await auth.getUser(userId);
      
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      res.json({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        ...userData
      });
    } catch (error) {
      console.error('Get Profile Error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }
}

module.exports = UserController;
