// Configuration Checker
// This will help identify if Firebase is properly configured

function checkConfiguration() {
    const issues = [];
    const warnings = [];
    
    // Check Firebase config
    if (!CONFIG || !CONFIG.firebase) {
        issues.push('CONFIG object not found');
        return { isValid: false, issues, warnings };
    }
    
    const fb = CONFIG.firebase;
    
    if (!fb.apiKey || fb.apiKey === 'YOUR_FIREBASE_API_KEY' || fb.apiKey.includes('YOUR_')) {
        issues.push('Firebase API Key is not configured');
    }
    
    if (!fb.projectId || fb.projectId === 'YOUR_PROJECT_ID' || fb.projectId.includes('YOUR_')) {
        issues.push('Firebase Project ID is not configured');
    }
    
    if (!fb.authDomain || fb.authDomain.includes('YOUR_PROJECT_ID')) {
        issues.push('Firebase Auth Domain is not configured');
    }
    
    if (!fb.storageBucket || fb.storageBucket.includes('YOUR_PROJECT_ID')) {
        issues.push('Firebase Storage Bucket is not configured');
    }
    
    if (!fb.messagingSenderId || fb.messagingSenderId === 'YOUR_MESSAGING_SENDER_ID') {
        issues.push('Firebase Messaging Sender ID is not configured');
    }
    
    if (!fb.appId || fb.appId === 'YOUR_APP_ID') {
        issues.push('Firebase App ID is not configured');
    }
    
    // Check NLP API (optional but recommended)
    if (!CONFIG.nlp || !CONFIG.nlp.apiKey || CONFIG.nlp.apiKey === 'YOUR_GOOGLE_CLOUD_API_KEY') {
        warnings.push('Natural Language API key not configured (sentiment analysis will use fallback)');
    }
    
    // Check Dialogflow (optional)
    if (!CONFIG.dialogflow || !CONFIG.dialogflow.projectId || CONFIG.dialogflow.projectId === 'YOUR_DIALOGFLOW_PROJECT_ID') {
        warnings.push('Dialogflow not configured (chatbot will use fallback responses)');
    }
    
    return {
        isValid: issues.length === 0,
        issues,
        warnings
    };
}

// Show configuration status in console
if (typeof CONFIG !== 'undefined') {
    const configStatus = checkConfiguration();
    
    console.log('%c=== Configuration Status ===', 'color: #6366f1; font-weight: bold; font-size: 14px');
    
    if (configStatus.isValid) {
        console.log('%c✅ Firebase is properly configured!', 'color: #10b981; font-weight: bold');
    } else {
        console.error('%c❌ Firebase configuration issues found:', 'color: #ef4444; font-weight: bold');
        configStatus.issues.forEach(issue => {
            console.error('  • ' + issue);
        });
        console.log('%c📖 See QUICK-SETUP.md for setup instructions', 'color: #f59e0b; font-weight: bold');
    }
    
    if (configStatus.warnings.length > 0) {
        console.warn('%c⚠️ Optional configurations:', 'color: #f59e0b; font-weight: bold');
        configStatus.warnings.forEach(warning => {
            console.warn('  • ' + warning);
        });
    }
    
    console.log('%c============================', 'color: #6366f1; font-weight: bold');
    
    // Make checker available globally
    window.checkConfig = checkConfiguration;
}
