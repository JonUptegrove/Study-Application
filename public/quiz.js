// Get HTML elements
const quizTitle = document.getElementById('quizTitle');
const quizContainer = document.getElementById('quizContainer');

// Get the selected study set's information
const notes = sessionStorage.getItem('quizNotes');
const title = sessionStorage.getItem('quizTitle');

// Display the study set name
quizTitle.textContent = title || 'Quiz Mode';

// Check that notes are available
if (!notes) {

    quizContainer.textContent =
        'No study set selected. Please select a study set first.';

} else {

    generateQuiz();

}

// Generate the quiz using the backend
async function generateQuiz() {

    quizContainer.textContent = 'Generating your quiz...';

    try {

        const response = await fetch('/generate-quiz', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                notes: notes
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        // Save the generated quiz
        sessionStorage.setItem('currentQuiz', JSON.stringify(data.quiz));

        // Display the quiz
        displayQuiz(data.quiz);

    } catch (error) {

        console.error('Quiz error:', error);

        quizContainer.textContent =
            'Could not generate quiz: ' + error.message;

    }
}
// Display quiz questions
function displayQuiz(quiz) {

    quizContainer.innerHTML = '';

    quiz.forEach(function(question, index) {

        // Create question container
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');

        // Create question heading
        const questionHeading = document.createElement('h3');
        questionHeading.textContent =
            (index + 1) + '. ' + question.question;

        questionDiv.appendChild(questionHeading);

        // Create answer choices
        question.choices.forEach(function(choice) {

            const label = document.createElement('label');

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'question' + index;
            radio.value = choice;

            label.appendChild(radio);
            label.appendChild(document.createTextNode(choice));

            questionDiv.appendChild(label);
            questionDiv.appendChild(document.createElement('br'));

        });


        quizContainer.appendChild(questionDiv);

    });
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Quiz';

    submitButton.addEventListener('click', function() {
        gradeQuiz(quiz);
    });

    quizContainer.appendChild(submitButton);
}


// Grade the quiz
function gradeQuiz(quiz) {

    let score = 0;

    // Store the results before removing the quiz questions
    const results = [];

    quiz.forEach(function(question, index) {

        // Find the selected answer
        const selectedAnswer = document.querySelector(
            'input[name="question' + index + '"]:checked'
        );

        // Check whether the answer is correct
        const isCorrect = selectedAnswer &&
            selectedAnswer.value === question.correctAnswer;

        if (isCorrect) {
            score++;
        }

        // Save the question results
        results.push({
            question: question.question,
            userAnswer: selectedAnswer
                ? selectedAnswer.value
                : 'Not answered',
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            isCorrect: isCorrect
        });

    });

    // Now clear the quiz questions
    quizContainer.innerHTML = '';

    // Display results heading
    const resultsHeading = document.createElement('h2');
    resultsHeading.textContent = 'Quiz Results';
    quizContainer.appendChild(resultsHeading);

    // Display each question's results
    results.forEach(function(result, index) {

        const resultDiv = document.createElement('div');
        resultDiv.classList.add('quiz-question');

        const questionHeading = document.createElement('h3');
        questionHeading.textContent =
            (index + 1) + '. ' + result.question;

        const userAnswer = document.createElement('p');
        userAnswer.textContent =
            'Your answer: ' + result.userAnswer;

        const resultText = document.createElement('p');
        resultText.textContent = result.isCorrect
            ? 'Correct!'
            : 'Incorrect';

        const correctAnswer = document.createElement('p');
        correctAnswer.textContent =
            'Correct answer: ' + result.correctAnswer;

        const explanation = document.createElement('p');
        explanation.textContent =
            'Explanation: ' + result.explanation;

        resultDiv.appendChild(questionHeading);
        resultDiv.appendChild(userAnswer);
        resultDiv.appendChild(resultText);
        resultDiv.appendChild(correctAnswer);
        resultDiv.appendChild(explanation);

        quizContainer.appendChild(resultDiv);

    });

    // Display final score
    const finalScore = document.createElement('h2');
    finalScore.textContent =
        'Final Score: ' + score + ' / ' + quiz.length;

    quizContainer.prepend(finalScore);
    // Create Retake Quiz button
    const retakeButton = document.createElement('button');
    retakeButton.textContent = 'Retake Quiz';

    retakeButton.addEventListener('click', function() {
        const savedQuiz = JSON.parse(
            sessionStorage.getItem('currentQuiz')
        );

        displayQuiz(savedQuiz);
    });

    quizContainer.appendChild(retakeButton);

}