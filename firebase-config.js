// Firebase Configuration and Initialization

let db = null;
let auth = null;

async function initializeFirebase() {
    try {
        const { initializeApp } = window.firebaseModules;
        const { getFirestore } = window.firebaseModules;
        const { getAuth } = window.firebaseModules;
        const { onAuthStateChanged } = window.firebaseModules;

        // Initialize Firebase
        const app = initializeApp(CONFIG.firebase);
        db = getFirestore(app);
        auth = getAuth(app);

        // Monitor auth state changes
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User authenticated:', user.email || 'Anonymous');
                window.currentUser = user;
                if (window.onAuthStateChange) {
                    window.onAuthStateChange(user);
                }
            } else {
                console.log('User signed out');
                window.currentUser = null;
                if (window.onAuthStateChange) {
                    window.onAuthStateChange(null);
                }
            }
        });

        window.firebaseReady = true;
        return { db, auth };
    } catch (error) {
        console.error('Firebase initialization error:', error);
        window.firebaseReady = false;
        return null;
    }
}

// Sign up with email and password
async function signUpWithEmail(email, password, name) {
    if (!window.firebaseReady || !auth) {
        throw new Error('Firebase not initialized');
    }

    try {
        const { createUserWithEmailAndPassword } = window.firebaseModules;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Optionally save user name to Firestore
        if (name && db) {
            const { collection, addDoc } = window.firebaseModules;
            await addDoc(collection(db, 'users'), {
                uid: userCredential.user.uid,
                name: name,
                email: email,
                createdAt: new Date()
            });
        }
        
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

// Sign in with email and password
async function signInWithEmail(email, password) {
    if (!window.firebaseReady || !auth) {
        throw new Error('Firebase not initialized');
    }

    try {
        const { signInWithEmailAndPassword } = window.firebaseModules;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

// Sign out
async function signOutUser() {
    if (!window.firebaseReady || !auth) {
        throw new Error('Firebase not initialized');
    }

    try {
        const { signOut } = window.firebaseModules;
        await signOut(auth);
    } catch (error) {
        throw error;
    }
}

// Save journal entry to Firestore
async function saveJournalEntry(entryText, mood = null) {
    if (!window.firebaseReady || !db) {
        console.warn('Firebase not initialized, journal entry not saved');
        return false;
    }

    try {
        const { collection, addDoc, serverTimestamp } = window.firebaseModules;
        
        await addDoc(collection(db, 'journalEntries'), {
            text: entryText,
            mood: mood,
            timestamp: serverTimestamp(),
            userId: auth?.currentUser?.uid || 'anonymous'
        });
        
        return true;
    } catch (error) {
        console.error('Error saving journal entry:', error);
        return false;
    }
}

// Save counselor contact request
async function saveCounselorRequest(userData) {
    if (!window.firebaseReady || !db) {
        console.warn('Firebase not initialized, request not saved');
        return false;
    }

    try {
        const { collection, addDoc, serverTimestamp } = window.firebaseModules;
        
        await addDoc(collection(db, 'counselorRequests'), {
            name: userData.name || 'Anonymous',
            email: userData.email || '',
            phone: userData.phone || '',
            timestamp: serverTimestamp(),
            userId: auth?.currentUser?.uid || 'anonymous',
            status: 'pending'
        });
        
        return true;
    } catch (error) {
        console.error('Error saving counselor request:', error);
        return false;
    }
}

// Save conversation message for analysis
async function saveConversationMessage(message, sentiment = null) {
    if (!window.firebaseReady || !db) {
        return false;
    }

    try {
        const { collection, addDoc, serverTimestamp } = window.firebaseModules;
        
        await addDoc(collection(db, 'conversations'), {
            message: message,
            sentiment: sentiment,
            timestamp: serverTimestamp(),
            userId: auth?.currentUser?.uid || 'anonymous'
        });
        
        return true;
    } catch (error) {
        console.error('Error saving conversation:', error);
        return false;
    }
}

// Save mood entry
async function saveMoodEntry(mood, emoji) {
    if (!window.firebaseReady || !db) {
        return false;
    }

    try {
        const { collection, addDoc, serverTimestamp } = window.firebaseModules;
        
        await addDoc(collection(db, 'moodEntries'), {
            mood: mood,
            emoji: emoji,
            timestamp: serverTimestamp(),
            userId: auth?.currentUser?.uid || 'anonymous',
            date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        });
        
        return true;
    } catch (error) {
        console.error('Error saving mood entry:', error);
        return false;
    }
}

// Get user analytics data
async function getUserAnalytics() {
    if (!window.firebaseReady || !db || !auth?.currentUser) {
        return null;
    }

    try {
        const { collection, query, where, getDocs, orderBy, limit } = window.firebaseModules;
        const userId = auth.currentUser.uid;
        
        // Get conversations (without orderBy if not indexed)
        let conversationsSnapshot;
        try {
            const conversationsQuery = query(
                collection(db, 'conversations'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc')
            );
            conversationsSnapshot = await getDocs(conversationsQuery);
        } catch (error) {
            // Fallback if index not created
            const conversationsQuery = query(
                collection(db, 'conversations'),
                where('userId', '==', userId)
            );
            conversationsSnapshot = await getDocs(conversationsQuery);
        }
        
        // Get journal entries
        let journalSnapshot;
        try {
            const journalQuery = query(
                collection(db, 'journalEntries'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc')
            );
            journalSnapshot = await getDocs(journalQuery);
        } catch (error) {
            const journalQuery = query(
                collection(db, 'journalEntries'),
                where('userId', '==', userId)
            );
            journalSnapshot = await getDocs(journalQuery);
        }
        
        // Get mood entries
        let moodSnapshot;
        try {
            const moodQuery = query(
                collection(db, 'moodEntries'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc'),
                limit(100)
            );
            moodSnapshot = await getDocs(moodQuery);
        } catch (error) {
            const moodQuery = query(
                collection(db, 'moodEntries'),
                where('userId', '==', userId),
                limit(100)
            );
            moodSnapshot = await getDocs(moodQuery);
        }
        
        const conversations = [];
        const journalEntries = [];
        const moodEntries = [];
        
        conversationsSnapshot.forEach(doc => {
            const data = doc.data();
            conversations.push({
                ...data,
                timestamp: data.timestamp?.toDate() || new Date()
            });
        });
        
        journalSnapshot.forEach(doc => {
            const data = doc.data();
            journalEntries.push({
                ...data,
                timestamp: data.timestamp?.toDate() || new Date()
            });
        });
        
        moodSnapshot.forEach(doc => {
            const data = doc.data();
            moodEntries.push({
                ...data,
                timestamp: data.timestamp?.toDate() || new Date()
            });
        });
        
        // Sort by timestamp descending
        conversations.sort((a, b) => b.timestamp - a.timestamp);
        journalEntries.sort((a, b) => b.timestamp - a.timestamp);
        moodEntries.sort((a, b) => b.timestamp - a.timestamp);
        
        return {
            conversations,
            journalEntries,
            moodEntries
        };
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
}

// Initialize Firebase when config is loaded
if (typeof CONFIG !== 'undefined') {
    initializeFirebase();
}

// Export functions
window.firebaseService = {
    saveJournalEntry,
    saveCounselorRequest,
    saveConversationMessage,
    saveMoodEntry,
    getUserAnalytics,
    initializeFirebase,
    signUpWithEmail,
    signInWithEmail,
    signOutUser
};
