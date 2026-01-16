// Example Configuration file
// Copy this file to config.js and fill in your actual credentials

const CONFIG = {
    // Firebase Configuration
    // Get these from Firebase Console > Project Settings > General > Your apps
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    },

    // Dialogflow Configuration
    // Get these from Dialogflow Console > Settings > General
    dialogflow: {
        projectId: "YOUR_DIALOGFLOW_PROJECT_ID",
        sessionId: "anonymous-session-" + Date.now(), // Unique session per user
        languageCode: "en-US"
    },

    // Google Cloud Natural Language API
    // You'll need to enable this API in Google Cloud Console
    // and set up authentication (API key or service account)
    nlp: {
        apiKey: "YOUR_GOOGLE_CLOUD_API_KEY", // Optional: if using API key
        // Or use service account authentication (recommended for production)
    },

    // Distress Detection Thresholds
    distressThresholds: {
        // Sentiment score ranges from -1 (very negative) to 1 (very positive)
        negativeSentimentThreshold: -0.3,
        // Magnitude indicates emotional intensity (0 to infinity)
        highMagnitudeThreshold: 0.5,
        // Keywords that might indicate distress
        distressKeywords: [
            "suicide", "kill myself", "end it all", "want to die",
            "hopeless", "worthless", "no point", "give up",
            "self harm", "hurt myself", "can't go on"
        ]
    },

    // Counselor Contact Information
    counselor: {
        email: "counselor@campus.edu", // Replace with actual counselor email
        name: "Campus Counseling Center"
    },

    // Feature Flags
    features: {
        enableNLP: true, // Enable Natural Language API analysis
        enableDialogflow: true, // Enable Dialogflow conversations
        enableJournaling: true, // Enable journaling feature
        enableDistressDetection: true // Enable automatic distress detection
    }
};

// Make config available globally
window.CONFIG = CONFIG;
