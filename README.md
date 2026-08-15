# Prompt Studio

Prompt Studio is a full-stack AI-powered prompt generation platform that helps users transform simple ideas, descriptions, images, files, voice inputs, and video references into detailed and ready-to-use AI prompts.

The platform is designed to make prompt creation easier for users who may not know how to write effective AI prompts.

---

## 🚀 Features

### 🤖 AI Prompt Generation
- Convert simple ideas into detailed AI prompts.
- Improve prompt clarity, structure, and specificity.
- Generate prompts using Google's Gemini API.
- Supports multiple output languages and formats.

### 📝 Text Prompt
- Enter a simple idea or description.
- Generate a professionally structured prompt.
- Copy the generated prompt with one click.

### 🖼️ Image Prompt
- Upload an image as a reference.
- Describe the desired result.
- Generate a detailed image-generation prompt.

### 🎙️ Voice Prompt
- Provide voice/audio input.
- Convert the input into a structured AI prompt.

### 📄 File Prompt
- Upload supported files.
- Use file content as context for prompt generation.

### 🎬 Video Prompt
- Upload a reference video.
- Describe the desired changes or output.
- Generate a detailed video-generation prompt.

### 🌐 Language Support
Prompt Studio supports multiple output languages, including:

- English
- Hindi
- Marathi
- Gujarati
- Bengali
- Tamil
- Telugu
- Kannada
- Malayalam
- Punjabi
- Urdu
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Japanese
- Korean
- Chinese
- Arabic

### 👤 User Authentication
- User signup and login.
- Protected tool pages.
- User profile information.
- Profile dropdown.
- Logout functionality.
- Redirect users to the login page when authentication is required.

### 📱 Responsive Interface
- Desktop-friendly interface.
- Mobile navigation.
- Responsive layouts for different screen sizes.

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive Web Design

### Backend

- Node.js
- Express.js
- CORS
- dotenv
- Multer

### AI

- Google Gemini API
- `@google/genai`

### Development & Deployment

- Git
- GitHub
- Node.js
- npm

---

## 🏗️ Project Architecture

```text
Prompt Studio
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   │
│   ├── prompt generator pages
│   ├── CSS files
│   ├── JavaScript files
│   └── assets
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── other backend files
│
├── .gitignore
└── README.md

The general workflow of Prompt Studio is:
User
  │
  ▼
Frontend Interface
  │
  ▼
User Input / File / Image / Video / Voice
  │
  ▼
Backend API
  │
  ▼
Google Gemini API
  │
  ▼
Generated Prompt
  │
  ▼
Frontend Output
