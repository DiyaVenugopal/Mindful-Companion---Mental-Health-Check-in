// Configuration file for the Mental Health Check-in Chatbot
// ⚠️ IMPORTANT: You MUST replace these with your actual Firebase credentials!
// Follow QUICK-SETUP.md for step-by-step instructions

const CONFIG = {
    // Firebase Configuration (REQUIRED)
    // Get these from: Firebase Console > Project Settings > General > Your apps
    // Step-by-step: See QUICK-SETUP.md or FIREBASE-SETUP.md
    firebase: {
        apiKey: "AIzaSyDdA1panig3dRqgiRL_elPdrWrSqMp3h-Q",
        authDomain: "feelio-b2e81.firebaseapp.com",
        projectId: "feelio-b2e81",
        storageBucket: "feelio-b2e81.firebasestorage.app",
        messagingSenderId: "1056925058145",
        appId: "1:1056925058145:web:1cb80ef331b279c6b49620",
        measurementId: "G-64HDFMD5HL"
    },

    // Dialogflow Configuration (OPTIONAL - chatbot works with fallback responses without this)
    // Step-by-step: See QUICK-SETUP.md or DIALOGFLOW-SETUP.md
    // 1. Go to dialogflow.cloud.google.com
    // 2. Create agent (use same project as Firebase)
    // 3. Get Project ID from Settings > General
    dialogflow: {
        projectId: "feelio-b2e81", // Replace with your Dialogflow project ID (optional)
        sessionId: "anonymous-session-" + Date.now(), // Unique session per user
        languageCode: "en-US"
    },

    // Google Gemini AI Configuration (REQUIRED for chatbot)
    // Step-by-step: 
    // 1. Go to https://makersuite.google.com/app/apikey
    // 2. Create a new API key
    // 3. Copy and paste it here
    gemini: {
        apiKey: "AIzaSyA9G3C04wlV1Df8YJvajxifCXLunNtJt0o", // Replace with your Gemini API key
        model: "gemini-pro" // Model to use
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
        enableGemini: true, // Enable Gemini AI for chatbot
        enableJournaling: true, // Enable journaling feature
        enableDistressDetection: true // Enable automatic distress detection
    }
};

// Make config available globally
window.CONFIG = CONFIG;
