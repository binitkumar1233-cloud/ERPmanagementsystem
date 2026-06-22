const admin = require('firebase-admin');

if (!admin.apps.length) {
    // Requires FIREBASE_SERVICE_ACCOUNT env var (JSON string of the service account key)
    // Download from Firebase Console → Project Settings → Service Accounts → Generate new private key
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

module.exports = admin;
