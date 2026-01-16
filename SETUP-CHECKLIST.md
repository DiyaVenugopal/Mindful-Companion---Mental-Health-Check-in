# ✅ Setup Checklist

Use this checklist to make sure everything is configured correctly.

## 🔥 Firebase (REQUIRED)

- [ ] Created Firebase project at https://console.firebase.google.com/
- [ ] Registered web app and got config object
- [ ] Copied `apiKey` to config.js
- [ ] Copied `authDomain` to config.js
- [ ] Copied `projectId` to config.js
- [ ] Copied `storageBucket` to config.js
- [ ] Copied `messagingSenderId` to config.js
- [ ] Copied `appId` to config.js
- [ ] Enabled Email/Password authentication in Firebase Console
- [ ] Created Firestore database (test mode is fine)
- [ ] Updated Firestore security rules (see FIREBASE-SETUP.md)

## 🧠 Google Cloud Natural Language API (REQUIRED)

- [ ] Enabled Natural Language API in Google Cloud Console
- [ ] Created API key in Credentials section
- [ ] Restricted API key to Natural Language API only
- [ ] Copied API key to config.js (nlp.apiKey)

## 💬 Dialogflow (OPTIONAL)

- [ ] Created Dialogflow agent
- [ ] Got Project ID from Settings
- [ ] Copied Project ID to config.js (dialogflow.projectId)

## 🧪 Testing

- [ ] Saved config.js with all credentials
- [ ] Refreshed browser (http://localhost:8000)
- [ ] Tried to sign up with email/password
- [ ] Sign up worked without errors
- [ ] Can log in with created account
- [ ] Chatbot responds to messages
- [ ] Mood selector works
- [ ] Journal entry saves (check Firebase Console)

## 🐛 Troubleshooting

If sign up fails:
- [ ] Check browser console for errors (F12)
- [ ] Verify all Firebase config values are correct
- [ ] Make sure Email/Password auth is enabled
- [ ] Check Firestore is created
- [ ] Verify API key has no extra spaces

If chatbot doesn't respond:
- [ ] Check browser console for errors
- [ ] Verify Dialogflow config (or it will use fallback)
- [ ] Check Natural Language API key is correct

## 📝 Notes

Write any issues or notes here:
_________________________________
_________________________________
_________________________________
