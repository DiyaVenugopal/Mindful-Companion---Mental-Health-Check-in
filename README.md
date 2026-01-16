# Mindful Companion - Mental Health Check-in Chatbot

A friendly, anonymous web-based mental health check-in chatbot designed to help students express their emotions without fear of judgment. Built with Google Cloud technologies including Dialogflow, Firebase, and Natural Language API.

## 🌟 Features

- **Anonymous Conversations**: All interactions are anonymous and secure
- **Friendly Animated Companion**: Cheerful chatbot interface with mood-responsive avatar
- **Mood Tracking**: Simple, interactive mood selection and tracking
- **Journaling**: Optional journaling feature to record thoughts and feelings
- **Sentiment Analysis**: Uses Google Cloud Natural Language API to analyze emotional patterns
- **Distress Detection**: Automatically detects signs of distress and offers counselor connection
- **Resource Links**: Quick access to mental health resources and crisis support
- **Modern UI**: Beautiful, responsive design with smooth animations

## 🛠️ Technologies Used

- **Dialogflow**: Natural language understanding and conversation management
- **Firebase**: 
  - Firestore for storing journal entries and conversation data
  - Anonymous Authentication for privacy
- **Google Cloud Natural Language API**: Sentiment analysis and emotional pattern detection
- **Vanilla JavaScript**: No framework dependencies for fast loading
- **Modern CSS**: Gradient designs, animations, and responsive layout

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Firebase Project** 
3. **Dialogflow Agent** (optional, fallback responses available)
4. **Natural Language API** enabled in Google Cloud Console

## 🚀 Setup Instructions

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (or set up security rules)
4. Enable **Anonymous Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Anonymous" provider
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (`</>`) to add a web app
   - Copy the Firebase configuration object

### Step 2: Google Cloud Natural Language API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable the **Cloud Natural Language API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Natural Language API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
   - (Optional) Restrict the API key to Natural Language API only

### Step 3: Dialogflow Setup (Optional)

1. Go to [Dialogflow Console](https://dialogflow.cloud.google.com/)
2. Create a new agent or use an existing one
3. Note your Project ID from the Dialogflow settings
4. **Note**: For production, you'll need to set up a backend proxy to securely handle Dialogflow authentication. The current implementation uses fallback responses when Dialogflow is not configured.

### Step 4: Configure the Application

1. Open `config.js` in the project root
2. Replace the placeholder values with your actual credentials:

```javascript
const CONFIG = {
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        // ... other Firebase config
    },
    dialogflow: {
        projectId: "YOUR_DIALOGFLOW_PROJECT_ID",
        // ...
    },
    nlp: {
        apiKey: "YOUR_GOOGLE_CLOUD_API_KEY",
    },
    counselor: {
        email: "counselor@campus.edu", // Replace with actual email
        name: "Campus Counseling Center"
    }
};
```

### Step 5: Firebase Security Rules

Update your Firestore security rules to allow anonymous writes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anonymous users to create journal entries
    match /journalEntries/{entryId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow anonymous users to create counselor requests
    match /counselorRequests/{requestId} {
      allow create: if request.auth != null;
      // Only allow admins to read (set up admin authentication separately)
      allow read: if false;
    }
    
    // Allow anonymous users to create conversation logs
    match /conversations/{conversationId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Step 6: Run the Application

1. Open `index.html` in a modern web browser
2. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```
3. Navigate to `http://localhost:8000` (or the port your server uses)

## 📁 Project Structure

```
tech/
├── index.html              # Main HTML file
├── styles.css              # All styling and animations
├── app.js                  # Main application logic
├── config.js               # Configuration file (add your credentials here)
├── firebase-config.js      # Firebase initialization and services
├── dialogflow-config.js    # Dialogflow integration
├── nlp-service.js          # Natural Language API service
└── README.md               # This file
```

## 🔒 Privacy & Security

- All conversations are anonymous by default
- Firebase Anonymous Authentication ensures user privacy
- No personal information is stored unless user opts in for counselor contact
- All data is encrypted in transit and at rest
- API keys should be restricted in production environments

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
    /* ... */
}
```

### Adjusting Distress Detection

Modify thresholds in `config.js`:

```javascript
distressThresholds: {
    negativeSentimentThreshold: -0.3,
    highMagnitudeThreshold: 0.5,
    distressKeywords: [/* your keywords */]
}
```

### Customizing Bot Responses

Edit the fallback responses in `dialogflow-config.js` or configure your Dialogflow agent with custom intents and responses.

## 🚨 Crisis Resources

The application includes quick access to:
- Crisis Text Line (Text HOME to 741741)
- National Suicide Prevention Lifeline (Call 988)
- Campus Counseling Services
- Self-help resources

## 📝 Notes

- **Dialogflow**: The current implementation uses fallback responses. For production, implement a backend proxy to securely handle Dialogflow authentication.
- **Natural Language API**: Falls back to keyword-based analysis if API key is not configured.
- **Firebase**: Ensure proper security rules are set up before deploying to production.

## 🤝 Contributing

This is a student project designed to help with mental health awareness. Feel free to fork and customize for your institution.

## 📄 License

This project is provided as-is for educational and mental health support purposes.

## 🆘 Support

If you or someone you know is in crisis:
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: Call 988
- **Emergency Services**: Call 911

---

**Remember**: This chatbot is a tool to support mental health, but it is not a replacement for professional mental health care. Always seek professional help for serious mental health concerns.
