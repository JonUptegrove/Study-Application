# Study App

An AI-powered study application that transforms class notes into interactive flashcards and multiple-choice quizzes. Upload your notes and let Google Gemini help you create study materials to prepare for exams and improve your learning.

## Features

### Note Upload
- Upload class notes in PDF or TXT format.
- Automatically extract text from uploaded documents.
- Preview extracted notes before generating study materials.

### AI-Generated Flashcards
- Uses Google Gemini AI to generate flashcards from uploaded notes.
- Creates question-and-answer pairs based on the provided material.
- Saves generated study sets for future use.

### Study Mode
- Review flashcards one at a time.
- Reveal and hide answers.
- Navigate between flashcards using Previous and Next controls.

### Quiz Mode
- Generate 10 multiple-choice questions from a selected study set.
- Each question includes four answer choices.
- Automatically grades submitted answers.
- Displays the final score, correct answers, and explanations.
- Retake quizzes without generating a new set of questions.

### Study Set Management
- View saved study sets.
- Open study sets in Study Mode.
- Launch quizzes from individual study sets.
- Delete study sets when they are no longer needed.

### Dark Mode
- Toggle between light and dark themes.
- Saves the user's theme preference between visits.

## Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**AI Integration**
- Google Gemini API
- `@google/genai`

**Additional Libraries**
- Multer – Handles file uploads.
- pdf-parse – Extracts text from PDF documents.
- dotenv – Manages environment variables.

## Installation and Setup

### Prerequisites
- Node.js and npm installed.
- A Google Gemini API key.

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate into the project directory:

```bash
cd StudyApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root project directory.

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

**Important:** Never upload your `.env` file or expose your API key publicly.

### 4. Start the Application

Run the backend server:

```bash
node server.js
```

Open your browser and navigate to:

```text
http://localhost:3000
```

## Project Structure

```text
StudyApp/
│
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── study.html
│   ├── study.js
│   ├── my-study-sets.html
│   ├── my-study-sets.js
│   ├── quiz.html
│   ├── quiz.js
│   └── theme.js
│
├── uploads/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## How It Works

1. A user uploads a PDF or TXT file containing class notes.
2. The backend extracts the text from the uploaded document.
3. The extracted notes are sent to Google Gemini.
4. Gemini generates flashcards or multiple-choice quiz questions.
5. The frontend displays the generated study materials.
6. Study sets are saved in the browser using localStorage.
7. Users can return to their saved study sets and continue studying.

## Future Improvements

Potential future features include:
- User authentication and individual accounts.
- Database integration for persistent study set storage.
- More file format support.
- Additional quiz customization options.
- Progress tracking and study statistics.
- Improved mobile responsiveness.

## Security Notes

- Keep API keys in environment variables.
- Do not commit `.env` or uploaded files to GitHub.
- Validate uploaded files and user input.
- Apply appropriate upload limits and API usage restrictions before deploying publicly.

## Author

Developed as a personal software engineering project to explore full-stack web development, file processing, and AI integration.
