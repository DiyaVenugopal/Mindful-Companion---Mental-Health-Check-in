# Dialogflow Setup Guide (Optional)

## Step 1: Create Dialogflow Agent

1. Go to https://dialogflow.cloud.google.com/
2. Click **Create Agent** (or use existing project)
3. Agent name: `Mindful Companion`
4. Default language: **English**
5. Default time zone: Choose your timezone
6. Google Project: Select your Firebase project (or create new)
7. Click **Create**

## Step 2: Get Project ID

1. In Dialogflow, click the **Settings icon** (⚙️) next to your agent name
2. Go to **General** tab
3. Find **Project ID** - it looks like: `your-project-id-12345`
4. **COPY THIS PROJECT ID**

## Step 3: Update config.js

1. Open `config.js`
2. Find the `dialogflow` section
3. Replace `YOUR_DIALOGFLOW_PROJECT_ID` with your actual Project ID
4. Save the file

## Step 4: Create Intents (Optional - for better responses)

You can create custom intents in Dialogflow for:
- Greetings
- Mood expressions
- Help-seeking
- Crisis situations

The chatbot will work with fallback responses even without Dialogflow configured.

## ✅ Done!

Dialogflow is now configured (optional - fallback responses work without it).
