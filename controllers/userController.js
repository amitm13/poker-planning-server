const { auth, db } = require('../services/firebase');

class UserController {
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
