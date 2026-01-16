# 🚀 Quick Setup Guide - Get Your Credentials

## ⚡ FASTEST WAY: Follow these steps in order

### 1️⃣ Firebase Setup (REQUIRED - 5 minutes)

**You MUST do this first!**

1. **Go to:** https://console.firebase.google.com/
2. **Click:** "Add project" or "Create a project"
3. **Name it:** `mindful-companion` (or any name)
4. **Click:** Continue → Continue → Create project
5. **Wait** for project to be created

#### Get Your Firebase Config:

1. In Firebase Console, click the **Web icon** (`</>`)
2. App nickname: `Mindful Companion`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click **Register app**
5. **COPY THE ENTIRE CONFIG** - It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. **Open `config.js`** in your project
7. **Replace** the firebase section with your values:

```javascript
firebase: {
    apiKey: "PASTE_YOUR_API_KEY_HERE",
    authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
    projectId: "PASTE_YOUR_PROJECT_ID_HERE",
    storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "PASTE_YOUR_APP_ID_HERE"
}
```

#### Enable Authentication:

1. In Firebase Console → **Authentication** → **Get started**
2. Click **Sign-in method** tab
3. Click **Email/Password**
4. **Toggle Enable** to ON
5. Click **Save**

#### Enable Firestore:

1. In Firebase Console → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode**
4. Select location (closest to you)
5. Click **Enable**

**✅ Firebase is now ready!**

---

### 2️⃣ Google Cloud Natural Language API (5 minutes)

1. **Go to:** https://console.cloud.google.com/
2. **Select** your Firebase project (or create new)
3. Go to **APIs & Services** → **Library**
4. Search: **"Cloud Natural Language API"**
5. Click it → Click **Enable**
6. Go to **APIs & Services** → **Credentials**
7. Click **+ CREATE CREDENTIALS** → **API key**
8. **COPY THE API KEY**
9. **Click "Restrict key"** → Select **Cloud Natural Language API** → Save
10. **Open `config.js`** → Replace `YOUR_GOOGLE_CLOUD_API_KEY` with your key

**✅ Natural Language API ready!**

---

### 3️⃣ Dialogflow (OPTIONAL - 5 minutes)

1. **Go to:** https://dialogflow.cloud.google.com/
2. Click **Create Agent**
3. Name: `Mindful Companion`
4. Google Project: **Select your Firebase project**
5. Click **Create**
6. Click **Settings** (⚙️) → **General** tab
7. **Copy Project ID**
8. **Open `config.js`** → Replace `YOUR_DIALOGFLOW_PROJECT_ID`

**✅ Dialogflow ready! (Optional - works without it)**

---

## 🎯 After Setup:

1. **Save `config.js`**
2. **Refresh your browser** (http://localhost:8000)
3. **Try signing up** - it should work now!

## ❓ Need Help?

- See `FIREBASE-SETUP.md` for detailed Firebase steps
- See `GOOGLE-CLOUD-SETUP.md` for NLP API details
- See `DIALOGFLOW-SETUP.md` for Dialogflow setup
