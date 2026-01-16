# Google Cloud Natural Language API Setup

## Step 1: Create Google Cloud Project (if you don't have one)

1. Go to https://console.cloud.google.com/
2. Click the project dropdown at the top
3. Click **New Project**
4. Project name: `mindful-companion-nlp` (or any name)
5. Click **Create**

## Step 2: Enable Natural Language API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for **"Cloud Natural Language API"**
3. Click on it
4. Click **Enable**
5. Wait for it to enable (10-30 seconds)

## Step 3: Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** at the top
3. Select **API key**
4. Your API key will be created
5. **IMPORTANT**: Click **Restrict key** to secure it:
   - Under "API restrictions", select **Restrict key**
   - Check only **Cloud Natural Language API**
   - Click **Save**
6. **COPY THE API KEY** - You'll need this for config.js

## Step 4: Update config.js

1. Open `config.js`
2. Find the `nlp` section
3. Replace `YOUR_GOOGLE_CLOUD_API_KEY` with your actual API key
4. Save the file

## ✅ Done!

Natural Language API is now configured for sentiment analysis.
