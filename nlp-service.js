// Google Cloud Natural Language API Service

/**
 * Analyze sentiment of text using Google Cloud Natural Language API
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} - Sentiment analysis result
 */
async function analyzeSentiment(text) {
    if (!CONFIG.features.enableNLP) {
        return null;
    }

    try {
        // Using the Natural Language API REST endpoint
        const apiKey = CONFIG.nlp.apiKey;
        if (!apiKey || apiKey === "YOUR_GOOGLE_CLOUD_API_KEY") {
            console.warn('NLP API key not configured, using fallback analysis');
            return performFallbackSentimentAnalysis(text);
        }

        const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                document: {
                    type: 'PLAIN_TEXT',
                    content: text
                },
                encodingType: 'UTF8'
            })
        });

        if (!response.ok) {
            throw new Error(`NLP API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        return {
            score: data.documentSentiment.score,
            magnitude: data.documentSentiment.magnitude,
            sentences: data.sentences?.map(s => ({
                text: s.text.content,
                score: s.sentiment.score,
                magnitude: s.sentiment.magnitude
            })) || []
        };
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        // Fallback to basic analysis
        return performFallbackSentimentAnalysis(text);
    }
}

/**
 * Fallback sentiment analysis using keyword matching
 * Used when NLP API is not available
 */
function performFallbackSentimentAnalysis(text) {
    const lowerText = text.toLowerCase();
    
    // Positive indicators
    const positiveWords = ['good', 'great', 'happy', 'excited', 'wonderful', 'amazing', 'love', 'like', 'enjoy', 'pleased', 'grateful', 'thankful', 'blessed', 'lucky'];
    // Negative indicators
    const negativeWords = ['bad', 'sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'depressed', 'lonely', 'scared', 'afraid', 'terrible', 'awful', 'hate', 'disappointed', 'hopeless'];
    // Intense indicators
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
    
    // Calculate score (-1 to 1)
    const total = positiveCount + negativeCount;
    let score = 0;
    if (total > 0) {
        score = (positiveCount - negativeCount) / total;
    }
    
    // Calculate magnitude (0 to 1+)
    const magnitude = Math.min((positiveCount + negativeCount + intenseCount * 0.5) / 10, 2);
    
    return {
        score: score,
        magnitude: magnitude,
        sentences: []
    };
}

/**
 * Detect if text indicates distress
 * @param {string} text - Text to analyze
 * @param {Object} sentiment - Sentiment analysis result
 * @returns {Object} - Distress detection result
 */
function detectDistress(text, sentiment) {
    if (!CONFIG.features.enableDistressDetection) {
        return { isDistressed: false, confidence: 0, reasons: [] };
    }

    const lowerText = text.toLowerCase();
    const reasons = [];
    let confidence = 0;

    // Check for distress keywords
    const distressKeywords = CONFIG.distressThresholds.distressKeywords;
    const foundKeywords = distressKeywords.filter(keyword => lowerText.includes(keyword));
    
    if (foundKeywords.length > 0) {
        reasons.push(`Detected concerning language: ${foundKeywords.join(', ')}`);
        confidence += 0.6;
    }

    // Check sentiment score
    if (sentiment) {
        if (sentiment.score < CONFIG.distressThresholds.negativeSentimentThreshold) {
            reasons.push('Very negative sentiment detected');
            confidence += 0.3;
        }

        if (sentiment.magnitude > CONFIG.distressThresholds.highMagnitudeThreshold) {
            reasons.push('High emotional intensity detected');
            confidence += 0.2;
        }
    }

    // Check for patterns indicating crisis
    const crisisPatterns = [
        /(don'?t|do not) (want|wanna) (to )?(live|be here|exist)/i,
        /(going to|gonna) (kill|hurt|harm) (myself|me)/i,
        /(no point|nothing left|give up|end it)/i
    ];

    const hasCrisisPattern = crisisPatterns.some(pattern => pattern.test(text));
    if (hasCrisisPattern) {
        reasons.push('Crisis-level language detected');
        confidence = 1.0; // Maximum confidence for crisis
    }

    return {
        isDistressed: confidence >= 0.5,
        confidence: Math.min(confidence, 1.0),
        reasons: reasons
    };
}

// Export functions
window.nlpService = {
    analyzeSentiment,
    detectDistress,
    performFallbackSentimentAnalysis
};
