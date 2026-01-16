// Dialogflow Integration

let sessionClient = null;
let sessionPath = null;

/**
 * Initialize Dialogflow session
 */
function initializeDialogflow() {
    if (!CONFIG.features.enableDialogflow) {
        console.log('Dialogflow is disabled in config');
        return;
    }

    // Note: For web implementation, we'll use Dialogflow REST API
    // In production, you should use the Dialogflow ES or CX REST API
    // or implement a backend proxy for security
    
    const projectId = CONFIG.dialogflow.projectId;
    const sessionId = CONFIG.dialogflow.sessionId;
    
    if (!projectId || projectId === "YOUR_DIALOGFLOW_PROJECT_ID") {
        console.warn('Dialogflow not configured, using fallback responses');
        return;
    }

    // Session path for REST API
    sessionPath = `projects/${projectId}/agent/sessions/${sessionId}`;
    
    console.log('Dialogflow initialized');
}

/**
 * Send message to Dialogflow and get response
 * @param {string} message - User message
 * @returns {Promise<string>} - Bot response
 */
async function sendToDialogflow(message) {
    if (!CONFIG.features.enableDialogflow || !sessionPath) {
        return getFallbackResponse(message);
    }

    try {
        // Note: This is a simplified implementation
        // In production, you should:
        // 1. Use a backend proxy to keep your Dialogflow credentials secure
        // 2. Or use Dialogflow ES REST API with proper authentication
        
        // For now, we'll use a fallback that simulates Dialogflow behavior
        return getFallbackResponse(message);
        
        /* Production implementation would look like:
        const response = await fetch(`https://dialogflow.googleapis.com/v2/${sessionPath}:detectIntent`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queryInput: {
                    text: {
                        text: message,
                        languageCode: CONFIG.dialogflow.languageCode
                    }
                }
            })
        });
        
        const data = await response.json();
        return data.queryResult.fulfillmentText;
        */
    } catch (error) {
        console.error('Dialogflow error:', error);
        return getFallbackResponse(message);
    }
}

/**
 * Fallback response system when Dialogflow is not available
 * Provides empathetic, supportive responses
 */
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
        return "Hello! I'm here to listen. How are you feeling today?";
    }
    
    // Positive responses
    if (lowerMessage.match(/(good|great|fine|okay|alright|well)/)) {
        return "I'm glad to hear that! 😊 What's been going well for you lately?";
    }
    
    // Negative responses
    if (lowerMessage.match(/(bad|sad|terrible|awful|horrible|worst|struggling|difficult|hard|tough)/)) {
        return "I'm sorry you're going through this. It takes courage to share how you're feeling. Can you tell me more about what's been difficult?";
    }
    
    // Anxiety/stress responses
    if (lowerMessage.match(/(anxious|anxiety|stressed|stress|worried|worry|nervous|panic)/)) {
        return "Anxiety and stress can be really overwhelming. You're not alone in feeling this way. What situations or thoughts tend to trigger these feelings for you?";
    }
    
    // Depression responses
    if (lowerMessage.match(/(depressed|depression|down|hopeless|empty|numb|worthless)/)) {
        return "I hear you, and I want you to know that your feelings are valid. Depression can make everything feel heavy. Have you been able to talk to anyone about this?";
    }
    
    // Sleep-related
    if (lowerMessage.match(/(sleep|tired|exhausted|insomnia|restless)/)) {
        return "Sleep issues can really impact how we feel. Are you having trouble falling asleep, staying asleep, or both?";
    }
    
    // Help-seeking
    if (lowerMessage.match(/(help|support|need|want|should|can you)/)) {
        return "I'm here to support you. Sometimes talking to a professional counselor can be really helpful. Would you like me to share some resources or help you connect with someone?";
    }
    
    // Thank you responses
    if (lowerMessage.match(/(thank|thanks|appreciate|grateful)/)) {
        return "You're very welcome! I'm glad I could help. Remember, it's okay to reach out whenever you need to talk. 💚";
    }
    
    // Questions about the service
    if (lowerMessage.match(/(who are you|what are you|what is this|how does this work)/)) {
        return "I'm your Mindful Companion - an anonymous chatbot here to provide a safe space for you to express your feelings. Everything you share is confidential, and I'm here to listen without judgment.";
    }
    
    // Default empathetic responses
    const empatheticResponses = [
        "I understand. Can you tell me more about that?",
        "That sounds really challenging. How long have you been feeling this way?",
        "Thank you for sharing that with me. It's not easy to open up. What do you think might help you feel better?",
        "I'm listening. Your feelings matter. What's been on your mind?",
        "That must be really difficult. You're showing strength by talking about it. What would feel supportive right now?",
        "I hear you. Sometimes just expressing what we're feeling can help. Is there anything specific that's been weighing on you?",
        "Thank you for trusting me with this. You don't have to go through this alone. What would be most helpful for you right now?"
    ];
    
    // Return a random empathetic response
    return empatheticResponses[Math.floor(Math.random() * empatheticResponses.length)];
}

// Initialize Dialogflow when config is loaded
if (typeof CONFIG !== 'undefined') {
    initializeDialogflow();
}

// Export functions
window.dialogflowService = {
    sendToDialogflow,
    initializeDialogflow,
    getFallbackResponse
};
