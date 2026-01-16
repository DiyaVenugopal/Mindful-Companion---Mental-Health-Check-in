// Main Application Logic

let conversationHistory = [];
let currentMood = null;
let distressDetected = false;

// DOM Elements
const authContainer = document.getElementById('authContainer');
const mainContainer = document.getElementById('mainContainer');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const moodSelector = document.getElementById('moodSelector');
const moodButtons = document.querySelectorAll('.mood-btn');
const avatarEmoji = document.getElementById('avatarEmoji');
const avatarCircle = document.getElementById('avatarCircle');
const typingIndicator = document.getElementById('typingIndicator');

// Modal elements
const journalModal = document.getElementById('journalModal');
const counselorModal = document.getElementById('counselorModal');
const resourcesModal = document.getElementById('resourcesModal');
const profileModal = document.getElementById('profileModal');
const calendarModal = document.getElementById('calendarModal');
const journalBtn = document.getElementById('journalBtn');
const moodBtn = document.getElementById('moodBtn');
const resourcesBtn = document.getElementById('resourcesBtn');
const profileBtn = document.getElementById('profileBtn');
const calendarBtn = document.getElementById('calendarBtn');

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Wait for Firebase to initialize
    if (typeof window.firebaseService !== 'undefined') {
        await window.firebaseService.initializeFirebase();
        
        // Set up auth state listener
        window.onAuthStateChange = (user) => {
            if (user) {
                showMainApp();
            } else {
                showAuthScreen();
            }
        };
    } else {
        // If Firebase not available, show auth screen anyway
        showAuthScreen();
    }
    
    setupAuthEventListeners();
    setupEventListeners();
    adjustTextareaHeight();
}

function showAuthScreen() {
    authContainer.style.display = 'flex';
    mainContainer.style.display = 'none';
}

function showMainApp() {
    authContainer.style.display = 'none';
    mainContainer.style.display = 'flex';
}

function setupAuthEventListeners() {
    // Switch between login and signup
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    });
    
    // Login form submission
    loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');
        
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        
        // Check if Firebase is configured
        if (!window.firebaseService || !window.firebaseReady) {
            errorDiv.style.display = 'block';
            errorDiv.innerHTML = '⚠️ Firebase is not configured. Please:<br>1. Open QUICK-SETUP.md<br>2. Set up Firebase project<br>3. Update config.js with your credentials';
            return;
        }
        
        try {
            await window.firebaseService.signInWithEmail(email, password);
            // Auth state change will handle showing main app
        } catch (error) {
            errorDiv.style.display = 'block';
            if (error.code === 'auth/api-key-not-valid') {
                errorDiv.innerHTML = '❌ Invalid Firebase API key. Please check your config.js file. See QUICK-SETUP.md for help.';
            } else if (error.code === 'auth/user-not-found') {
                errorDiv.textContent = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorDiv.textContent = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorDiv.textContent = 'Invalid email address.';
            } else if (error.code === 'auth/network-request-failed') {
                errorDiv.textContent = 'Network error. Please check your internet connection.';
            } else {
                errorDiv.textContent = error.message || 'Failed to sign in. Please try again.';
            }
        }
    });
    
    // Signup form submission
    signupFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
        const errorDiv = document.getElementById('signupError');
        
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        
        // Password validation
        if (password.length < 8) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Password must be at least 8 characters long.';
            return;
        }
        
        if (password !== passwordConfirm) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Passwords do not match.';
            return;
        }
        
        // Check if Firebase is configured
        if (!window.firebaseService || !window.firebaseReady) {
            errorDiv.style.display = 'block';
            errorDiv.innerHTML = '⚠️ Firebase is not configured. Please:<br>1. Open QUICK-SETUP.md<br>2. Set up Firebase project<br>3. Update config.js with your credentials';
            return;
        }
        
        try {
            await window.firebaseService.signUpWithEmail(email, password, name);
            // Auth state change will handle showing main app
        } catch (error) {
            errorDiv.style.display = 'block';
            if (error.code === 'auth/api-key-not-valid') {
                errorDiv.innerHTML = '❌ Invalid Firebase API key. Please check your config.js file. See QUICK-SETUP.md for help.';
            } else if (error.code === 'auth/email-already-in-use') {
                errorDiv.textContent = 'An account with this email already exists.';
            } else if (error.code === 'auth/invalid-email') {
                errorDiv.textContent = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorDiv.textContent = 'Password is too weak. Please use at least 8 characters.';
            } else if (error.code === 'auth/network-request-failed') {
                errorDiv.textContent = 'Network error. Please check your internet connection.';
            } else {
                errorDiv.textContent = error.message || 'Failed to create account. Please try again.';
            }
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', async () => {
        try {
            await window.firebaseService.signOutUser();
            // Auth state change will handle showing auth screen
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to logout. Please try again.');
        }
    });
}

function setupEventListeners() {
    // Send message
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', adjustTextareaHeight);
    
    // Mood buttons
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => handleMoodSelection(btn));
    });
    
    // Quick action buttons
    journalBtn.addEventListener('click', () => openModal(journalModal));
    moodBtn.addEventListener('click', () => toggleMoodSelector());
    resourcesBtn.addEventListener('click', () => openModal(resourcesModal));
    
    // Journal modal
    document.getElementById('closeJournal').addEventListener('click', () => closeModal(journalModal));
    document.getElementById('saveJournal').addEventListener('click', handleSaveJournal);
    document.getElementById('cancelJournal').addEventListener('click', () => closeModal(journalModal));
    
    // Counselor modal
    document.getElementById('closeCounselor').addEventListener('click', () => closeModal(counselorModal));
    document.getElementById('submitCounselor').addEventListener('click', handleSubmitCounselor);
    document.getElementById('declineCounselor').addEventListener('click', () => {
        closeModal(counselorModal);
        addBotMessage("That's completely okay. I'm still here whenever you need to talk. Remember, you can always reach out when you're ready.");
    });
    
    // Resources modal
    document.getElementById('closeResources').addEventListener('click', () => closeModal(resourcesModal));
    
    // Profile modal
    profileBtn.addEventListener('click', () => {
        openProfileModal();
    });
    document.getElementById('closeProfile').addEventListener('click', () => closeModal(profileModal));
    
    // Calendar modal
    calendarBtn.addEventListener('click', () => {
        openCalendarModal();
    });
    document.getElementById('closeCalendar').addEventListener('click', () => closeModal(calendarModal));
    
    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => navigateCalendar(-1));
    document.getElementById('nextMonth').addEventListener('click', () => navigateCalendar(1));
    
    // Close modals when clicking outside
    [journalModal, counselorModal, resourcesModal, profileModal, calendarModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

function adjustTextareaHeight() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
}

async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    userInput.value = '';
    adjustTextareaHeight();
    
    // Disable input while processing
    sendButton.disabled = true;
    userInput.disabled = true;
    showTypingIndicator();
    
    // Save conversation
    if (window.firebaseService) {
        await window.firebaseService.saveConversationMessage(message);
    }
    
    // Analyze sentiment using Gemini
    let sentiment = null;
    if (window.geminiService && CONFIG.features.enableGemini) {
        sentiment = await window.geminiService.analyzeSentimentWithGemini(message);
        
        // Save sentiment with conversation
        if (window.firebaseService) {
            await window.firebaseService.saveConversationMessage(message, sentiment);
        }
    }
    
    // Detect distress
    if (window.geminiService && CONFIG.features.enableDistressDetection) {
        const distressResult = window.geminiService.detectDistress(message, sentiment);
        
        if (distressResult.isDistressed && !distressDetected) {
            distressDetected = true;
            hideTypingIndicator();
            
            // Wait a bit before showing counselor modal
            setTimeout(() => {
                showCounselorModal(distressResult);
            }, 2000);
            
            sendButton.disabled = false;
            userInput.disabled = false;
            return;
        }
    }
    
    // Get bot response from Gemini AI
    let botResponse = '';
    if (window.geminiService && CONFIG.features.enableGemini) {
        // Convert conversation history to Gemini format (alternating user/model)
        const geminiHistory = [];
        conversationHistory.forEach(msg => {
            if (msg.user) {
                geminiHistory.push({
                    role: 'user',
                    text: msg.user
                });
            }
            if (msg.bot) {
                geminiHistory.push({
                    role: 'model',
                    text: msg.bot
                });
            }
        });
        
        botResponse = await window.geminiService.sendToGemini(message, geminiHistory);
    } else {
        botResponse = window.geminiService?.getFallbackResponse(message) || "I'm here to listen. Can you tell me more?";
    }
    
    // Add conversation to history
    conversationHistory.push({
        user: message,
        bot: botResponse,
        timestamp: new Date(),
        sentiment: sentiment
    });
    
    // Update character expression based on sentiment
    updateCharacterExpression(sentiment);
    
    // Show bot response with character animation
    hideTypingIndicator();
    setTimeout(() => {
        addBotMessage(botResponse);
        // Animate character speaking
        animateCharacterSpeaking();
        // Play voice sound (optional - can be added later)
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }, 500);
}

function handleMoodSelection(btn) {
    const mood = btn.dataset.mood;
    const emoji = btn.dataset.emoji;
    currentMood = mood;
    
    // Update UI
    moodButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Hide mood selector
    moodSelector.classList.remove('active');
    
    // Save mood entry to Firebase
    if (window.firebaseService) {
        window.firebaseService.saveMoodEntry(mood, emoji);
    }
    
    // Add user message
    addUserMessage(`I'm feeling ${mood} ${emoji}`);
    
    // Get contextual response from Gemini
    showTypingIndicator();
    setTimeout(async () => {
        hideTypingIndicator();
        let response = '';
        
        if (window.geminiService && CONFIG.features.enableGemini) {
            const geminiHistory = [];
            conversationHistory.forEach(msg => {
                if (msg.user) {
                    geminiHistory.push({
                        role: 'user',
                        text: msg.user
                    });
                }
                if (msg.bot) {
                    geminiHistory.push({
                        role: 'model',
                        text: msg.bot
                    });
                }
            });
            
            response = await window.geminiService.sendToGemini(
                `I'm feeling ${mood} today. ${emoji}`,
                geminiHistory
            );
        } else {
            switch(mood) {
                case 'great':
                    response = "That's wonderful to hear! 😊 What's been going well for you? I'd love to hear about the positive things in your life.";
                    break;
                case 'good':
                    response = "I'm glad you're doing well! 🙂 What's contributing to your good mood today?";
                    break;
                case 'okay':
                    response = "Thanks for sharing. Sometimes 'okay' is exactly where we need to be. Is there anything specific on your mind, or are you just checking in?";
                    break;
                case 'not-great':
                    response = "I'm sorry you're not feeling great. That's completely valid. Would you like to talk about what's been difficult? I'm here to listen.";
                    break;
                case 'struggling':
                    response = "Thank you for being honest about how you're feeling. It takes courage to acknowledge when we're struggling. Can you tell me more about what's been challenging?";
                    break;
            }
        }
        
        addBotMessage(response);
    }, 500);
}

function toggleMoodSelector() {
    moodSelector.classList.toggle('active');
    if (moodSelector.classList.contains('active')) {
        moodSelector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

async function handleSaveJournal() {
    const journalText = document.getElementById('journalText').value.trim();
    
    if (!journalText) {
        alert('Please write something before saving.');
        return;
    }
    
    // Save to Firebase
    if (window.firebaseService) {
        const saved = await window.firebaseService.saveJournalEntry(journalText, currentMood);
        if (saved) {
            addBotMessage("Your journal entry has been saved. 📝 Writing can be a powerful way to process your thoughts and feelings. How are you feeling after writing that?");
        } else {
            addBotMessage("I've noted your journal entry. 📝 Sometimes just writing things down can help us understand our feelings better.");
        }
    } else {
        addBotMessage("I've noted your journal entry. 📝 Sometimes just writing things down can help us understand our feelings better.");
    }
    
    document.getElementById('journalText').value = '';
    closeModal(journalModal);
}

function showCounselorModal(distressResult) {
    const modal = counselorModal;
    const message = modal.querySelector('p');
    
    if (distressResult.reasons.length > 0) {
        message.innerHTML = `We've noticed you might benefit from talking to someone. ${distressResult.reasons[0]}. Would you like to connect with a counselor?`;
    }
    
    openModal(modal);
}

async function handleSubmitCounselor() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    
    if (!email && !phone) {
        alert('Please provide at least an email or phone number so a counselor can reach out to you.');
        return;
    }
    
    const userData = { name, email, phone };
    
    // Save to Firebase
    if (window.firebaseService) {
        const saved = await window.firebaseService.saveCounselorRequest(userData);
        if (saved) {
            addBotMessage("Thank you for reaching out. 💚 Your request has been sent to our counseling team. Someone will reach out to you soon. In the meantime, I'm still here if you need to talk.");
            
            // In a real implementation, you would also send an email notification
            // to the counselor here
        } else {
            addBotMessage("Thank you for your information. A counselor will review your request and reach out to you. Remember, you're not alone in this.");
        }
    } else {
        addBotMessage("Thank you for your information. A counselor will review your request and reach out to you. Remember, you're not alone in this.");
    }
    
    // Clear form
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPhone').value = '';
    
    closeModal(counselorModal);
    distressDetected = false; // Reset flag
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${escapeHtml(text)}</p>`;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = getCurrentTime();
    
    messageDiv.appendChild(content);
    messageDiv.appendChild(time);
    chatMessages.appendChild(messageDiv);
    
    scrollToBottom();
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Split text by newlines and create paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    paragraphs.forEach(p => {
        const pElement = document.createElement('p');
        pElement.textContent = p.trim();
        content.appendChild(pElement);
    });
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = getCurrentTime();
    
    messageDiv.appendChild(content);
    messageDiv.appendChild(time);
    chatMessages.appendChild(messageDiv);
    
    scrollToBottom();
}

// Legacy function - kept for compatibility but now uses character
function updateAvatar(sentiment) {
    updateCharacterExpression(sentiment);
}

function showTypingIndicator() {
    typingIndicator.classList.add('active');
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Profile Analytics Functions
let moodLineChart = null;
let moodPieChart = null;
let currentCalendarDate = new Date();

async function openProfileModal() {
    openModal(profileModal);
    
    // Load user data
    const user = window.currentUser;
    if (user) {
        document.getElementById('userEmail').textContent = user.email || 'N/A';
        const memberSince = user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A';
        document.getElementById('memberSince').textContent = memberSince;
    }
    
    // Load analytics
    const analytics = await window.firebaseService?.getUserAnalytics();
    if (analytics) {
        updateAnalytics(analytics);
    } else {
        // Show empty state
        document.getElementById('totalConversations').textContent = '0';
        document.getElementById('totalJournalEntries').textContent = '0';
        document.getElementById('avgSentiment').textContent = '0';
        document.getElementById('mostCommonMood').textContent = '-';
    }
}

function updateAnalytics(analytics) {
    // Update statistics
    document.getElementById('totalConversations').textContent = analytics.conversations.length;
    document.getElementById('totalJournalEntries').textContent = analytics.journalEntries.length;
    
    // Calculate average sentiment
    const sentiments = analytics.conversations
        .filter(c => c.sentiment && c.sentiment.score !== undefined)
        .map(c => c.sentiment.score);
    const avgSentiment = sentiments.length > 0 
        ? (sentiments.reduce((a, b) => a + b, 0) / sentiments.length).toFixed(2)
        : '0';
    document.getElementById('avgSentiment').textContent = avgSentiment;
    
    // Find most common mood
    const moodCounts = {};
    analytics.moodEntries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    const mostCommonMood = Object.keys(moodCounts).length > 0
        ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
        : '-';
    document.getElementById('mostCommonMood').textContent = mostCommonMood || '-';
    
    // Create line chart for mood over time
    const moodData = analytics.moodEntries.slice(0, 30).reverse(); // Last 30 entries
    const moodValues = {
        'great': 5,
        'good': 4,
        'okay': 3,
        'not-great': 2,
        'struggling': 1
    };
    
    const ctxLine = document.getElementById('moodLineChart');
    if (moodLineChart) {
        moodLineChart.destroy();
    }
    
    if (moodData.length > 0) {
        moodLineChart = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: moodData.map((_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'Mood Score',
                    data: moodData.map(entry => moodValues[entry.mood] || 3),
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                const labels = {1: 'Struggling', 2: 'Not Great', 3: 'Okay', 4: 'Good', 5: 'Great'};
                                return labels[value] || '';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create pie chart for mood distribution
    const moodDistribution = {};
    analytics.moodEntries.forEach(entry => {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
    });
    
    const ctxPie = document.getElementById('moodPieChart');
    if (moodPieChart) {
        moodPieChart.destroy();
    }
    
    if (Object.keys(moodDistribution).length > 0) {
        const moodColors = {
            'great': '#10b981',
            'good': '#3b82f6',
            'okay': '#f59e0b',
            'not-great': '#f97316',
            'struggling': '#ef4444'
        };
        
        moodPieChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: Object.keys(moodDistribution),
                datasets: [{
                    data: Object.values(moodDistribution),
                    backgroundColor: Object.keys(moodDistribution).map(mood => moodColors[mood] || '#94a3b8')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Calendar Functions
async function openCalendarModal() {
    openModal(calendarModal);
    renderCalendar();
}

function navigateCalendar(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    renderCalendar();
}

async function renderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    document.getElementById('calendarMonthYear').textContent = 
        currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Get mood entries for this month
    const analytics = await window.firebaseService?.getUserAnalytics();
    const moodEntries = analytics?.moodEntries || [];
    
    // Filter entries for current month
    const monthMoods = {};
    moodEntries.forEach(entry => {
        const entryDate = entry.timestamp;
        if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
            const day = entryDate.getDate();
            monthMoods[day] = entry.mood;
        }
    });
    
    // Create calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        calendarGrid.appendChild(empty);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        const mood = monthMoods[day];
        if (mood) {
            dayCell.classList.add(`mood-${mood}`);
            dayCell.title = `Mood: ${mood}`;
        }
        
        calendarGrid.appendChild(dayCell);
    }
}

// Chibi Character Animation Functions
function animateCharacterSpeaking() {
    const mouth = document.getElementById('chibiMouth');
    const character = document.getElementById('chibiCharacter');
    
    // Add speaking animation
    character.classList.add('speaking');
    mouth.classList.add('talking');
    
    // Remove animation after a delay
    setTimeout(() => {
        character.classList.remove('speaking');
        mouth.classList.remove('talking');
    }, 2000);
}

function updateCharacterExpression(sentiment) {
    const character = document.getElementById('chibiCharacter');
    const eyes = character.querySelectorAll('.eye');
    
    // Remove previous expressions
    character.classList.remove('happy', 'sad', 'neutral', 'excited', 'worried');
    
    if (!sentiment) {
        character.classList.add('neutral');
        return;
    }
    
    const score = sentiment.score || 0;
    
    if (score > 0.3) {
        character.classList.add('happy');
    } else if (score > 0) {
        character.classList.add('neutral');
    } else if (score > -0.3) {
        character.classList.add('worried');
    } else {
        character.classList.add('sad');
    }
    
    // Blink animation
    eyes.forEach(eye => {
        eye.style.animation = 'none';
        setTimeout(() => {
            eye.style.animation = 'blink 0.3s';
        }, 10);
    });
}

// Initialize when config is ready
if (typeof CONFIG !== 'undefined') {
    // App will initialize on DOMContentLoaded
} else {
    console.warn('CONFIG not loaded yet');
}
