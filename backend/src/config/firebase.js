const admin = require('firebase-admin');

let firebaseApp = null;

const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  if (process.env.FIREBASE_PROJECT_ID) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  return firebaseApp;
};

const verifyFirebaseToken = async (idToken) => {
  const app = initFirebase();
  if (!app) return null;
  return admin.auth().verifyIdToken(idToken);
};

const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  const app = initFirebase();
  if (!app || !fcmToken) return;

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
    });
  } catch (error) {
    console.error('FCM send error:', error.message);
  }
};

module.exports = { initFirebase, verifyFirebaseToken, sendPushNotification };
