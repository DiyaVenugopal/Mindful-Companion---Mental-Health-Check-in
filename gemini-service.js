// Google Gemini AI Service for Chatbot

/**
 * Send message to Gemini AI and get response
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous conversation context
 * @returns {Promise<string>} - AI response
 */
async function sendToGemini(message, conversationHistory = []) {
    if (!CONFIG.gemini || !CONFIG.gemini.apiKey || CONFIG.gemini.apiKey === "YOUR_GEMINI_API_KEY") {
        console.warn('Gemini API key not configured, using fallback response');
        return getFallbackResponse(message);
    }

    try {
        const apiKey = CONFIG.gemini.apiKey;
        const model = CONFIG.gemini.model || 'gemini-pro';
        
        // Build conversation context
        const conversationContext = [];
        
        // Add conversation history (last 10 messages for context)
        const recentHistory = conversationHistory.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role === 'user' || msg.text) {
                conversationContext.push({
                    role: msg.role || 'user',
                    parts: [{ text: msg.text || msg.user || '' }]
                });
            } else if (msg.role === 'model' || msg.bot) {
                conversationContext.push({
                    role: 'model',
                    parts: [{ text: msg.bot || msg.text || '' }]
                });
            }
        });

        // Add current message
        conversationContext.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: conversationContext,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Gemini API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.warn('Unexpected Gemini response format:', data);
            return getFallbackResponse(message);
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return getFallbackResponse(message);
    }
}

/**
 * Analyze sentiment using Gemini AI
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} - Sentiment analysis result
 */
async function analyzeSentimentWithGemini(text) {
    if (!CONFIG.gemini || !CONFIG.gemini.apiKey || CONFIG.gemini.apiKey === "YOUR_GEMINI_API_KEY") {
        return performFallbackSentimentAnalysis(text);
    }

    try {
        const apiKey = CONFIG.gemini.apiKey;
        const model = CONFIG.gemini.model || 'gemini-pro';
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const prompt = `Analyze the sentiment of the following text and respond with ONLY a JSON object in this exact format:
{
    "score": -1.0 to 1.0 (negative to positive),
    "magnitude": 0.0 to 2.0 (emotional intensity),
    "emotion": "one word emotion"
}

Text: "${text}"`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 100,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const resultText = data.candidates[0].content.parts[0].text;
            // Try to parse JSON from response
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const sentiment = JSON.parse(jsonMatch[0]);
                return {
                    score: sentiment.score || 0,
                    magnitude: sentiment.magnitude || 0,
                    emotion: sentiment.emotion || 'neutral'
                };
            }
        }
        
        return performFallbackSentimentAnalysis(text);
    } catch (error) {
        console.error('Error analyzing sentiment with Gemini:', error);
        return performFallbackSentimentAnalysis(text);
    }
}

/**
 * Fallback sentiment analysis using keyword matching
 */
function performFallbackSentimentAnalysis(text) {
    const lowerText = text.toLowerCase();
    
    const positiveWords = ['good', 'great', 'happy', 'excited', 'wonderful', 'amazing', 'love', 'like', 'enjoy', 'pleased', 'grateful', 'thankful', 'blessed', 'lucky'];
    const negativeWords = ['bad', 'sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'depressed', 'lonely', 'scared', 'afraid', 'terrible', 'awful', 'hate', 'disappointed', 'hopeless'];
    const intenseWords = ['very', 'extremely', 'really', 'so', 'too', 'incredibly', 'absolutely'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    let intenseCount = 0;
    
    positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeCount++;
    });
    
    intenseWords.forEach(word => {
        if (lowerText.includes(word)) intenseCount++;
    });
    
    const total = positiveCount + negativeCount;
    let score = 0;
    if (total > 0) {
        score = (positiveCount - negativeCount) / total;
    }
    
    const magnitude = Math.min((positiveCount + negativeCount + intenseCount * 0.5) / 10, 2);
    
    return {
        score: score,
        magnitude: magnitude,
        sentences: []
    };
}

/**
 * Detect if text indicates distress
 */
function detectDistress(text, sentiment) {
    if (!CONFIG.features || !CONFIG.features.enableDistressDetection) {
        return { isDistressed: false, confidence: 0, reasons: [] };
    }

    const lowerText = text.toLowerCase();
    const reasons = [];
    let confidence = 0;

    const distressKeywords = CONFIG.distressThresholds?.distressKeywords || [
        "suicide", "kill myself", "end it all", "want to die",
        "hopeless", "worthless", "no point", "give up",
        "self harm", "hurt myself", "can't go on"
    ];
    
    const foundKeywords = distressKeywords.filter(keyword => lowerText.includes(keyword));
    
    if (foundKeywords.length > 0) {
        reasons.push(`Detected concerning language: ${foundKeywords.join(', ')}`);
        confidence += 0.6;
    }

    if (sentiment) {
        const negativeThreshold = CONFIG.distressThresholds?.negativeSentimentThreshold || -0.3;
        const highMagnitudeThreshold = CONFIG.distressThresholds?.highMagnitudeThreshold || 0.5;
        
        if (sentiment.score < negativeThreshold) {
            reasons.push('Very negative sentiment detected');
            confidence += 0.3;
        }

        if (sentiment.magnitude > highMagnitudeThreshold) {
            reasons.push('High emotional intensity detected');
            confidence += 0.2;
        }
    }

    const crisisPatterns = [
        /(don'?t|do not) (want|wanna) (to )?(live|be here|exist)/i,
        /(going to|gonna) (kill|hurt|harm) (myself|me)/i,
        /(no point|nothing left|give up|end it)/i
    ];

    const hasCrisisPattern = crisisPatterns.some(pattern => pattern.test(text));
    if (hasCrisisPattern) {
        reasons.push('Crisis-level language detected');
        confidence = 1.0;
    }

    return {
        isDistressed: confidence >= 0.5,
        confidence: Math.min(confidence, 1.0),
        reasons: reasons
    };
}

/**
 * Fallback response system
 */
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
        return "Hello! I'm here to listen. How are you feeling today?";
    }
    
    if (lowerMessage.match(/(good|great|fine|okay|alright|well)/)) {
        return "I'm glad to hear that! 😊 What's been going well for you lately?";
    }
    
    if (lowerMessage.match(/(bad|sad|terrible|awful|horrible|worst|struggling|difficult|hard|tough)/)) {
        return "I'm sorry you're going through this. It takes courage to share how you're feeling. Can you tell me more about what's been difficult?";
    }
    
    if (lowerMessage.match(/(anxious|anxiety|stressed|stress|worried|worry|nervous|panic)/)) {
        return "Anxiety and stress can be really overwhelming. You're not alone in feeling this way. What situations or thoughts tend to trigger these feelings for you?";
    }
    
    if (lowerMessage.match(/(depressed|depression|down|hopeless|empty|numb|worthless)/)) {
        return "I hear you, and I want you to know that your feelings are valid. Depression can make everything feel heavy. Have you been able to talk to anyone about this?";
    }
    
    const empatheticResponses = [
        "I understand. Can you tell me more about that?",
        "That sounds really challenging. How long have you been feeling this way?",
        "Thank you for sharing that with me. It's not easy to open up. What do you think might help you feel better?",
        "I'm listening. Your feelings matter. What's been on your mind?",
        "That must be really difficult. You're showing strength by talking about it. What would feel supportive right now?",
        "I hear you. Sometimes just expressing what we're feeling can help. Is there anything specific that's been weighing on you?",
        "Thank you for trusting me with this. You don't have to go through this alone. What would be most helpful for you right now?"
    ];
    
    return empatheticResponses[Math.floor(Math.random() * empatheticResponses.length)];
}

// Export functions
window.geminiService = {
    sendToGemini,
    analyzeSentimentWithGemini,
    detectDistress,
    performFallbackSentimentAnalysis,
    getFallbackResponse
};
