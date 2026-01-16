# Firebase Setup Guide - Step by Step

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `mindful-companion` (or any name you prefer)
4. Click **Continue**
5. **Disable** Google Analytics (optional, you can enable later)
6. Click **Create project**
7. Wait for project creation (30 seconds)

## Step 2: Register Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register app nickname: `Mindful Companion Web`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click **Register app**
5. **COPY THE CONFIG OBJECT** - You'll see something like:

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

## Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Click **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **Enable** to ON
   - Click **Save**

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to you)
5. Click **Enable**

### Important: Update Security Rules

After creating Firestore, go to **Rules** tab and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Journal entries - users can create and read their own
    match /journalEntries/{entryId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Counselor requests - users can create, admins read
    match /counselorRequests/{requestId} {
      allow create: if request.auth != null;
      allow read: if false; // Only admins (set up separately)
    }
    
    // Conversations - users can create and read their own
    match /conversations/{conversationId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

Click **Publish**

## Step 5: Update config.js

1. Open `config.js` in your project
2. Replace the placeholder values with your actual Firebase config
3. Save the file

## ✅ You're Done!

Your Firebase is now configured. Try signing up again!
