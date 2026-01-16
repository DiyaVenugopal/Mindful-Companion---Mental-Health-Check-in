# Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Firebase Setup (2 minutes)

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable **Firestore Database** (start in test mode)
4. Enable **Anonymous Authentication**
5. Copy your Firebase config from Project Settings

### 2. Google Cloud API Key (2 minutes)

1. Go to https://console.cloud.google.com/
2. Enable **Cloud Natural Language API**
3. Create an API Key in Credentials
4. Copy the API key

### 3. Configure (1 minute)

1. Copy `config.example.js` to `config.js`
2. Paste your Firebase config into `config.js`
3. Paste your Google Cloud API key into `config.js`

### 4. Run

Open `index.html` in your browser or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

Visit `http://localhost:8000`

## ✅ That's it!

The chatbot will work with fallback responses even if Dialogflow is not configured. You can add Dialogflow later for more advanced conversations.

## 🔧 Optional: Dialogflow Setup

1. Go to https://dialogflow.cloud.google.com/
2. Create a new agent
3. Copy the Project ID
4. Add it to `config.js`

**Note**: For production, you'll need a backend proxy for Dialogflow authentication.

## 📝 Important Notes

- The app works with fallback responses if APIs are not configured
- All data is stored anonymously in Firebase
- Make sure to set up Firestore security rules before production use
- Restrict your API keys in Google Cloud Console for security

## 🆘 Need Help?

Check the full README.md for detailed instructions and troubleshooting.
