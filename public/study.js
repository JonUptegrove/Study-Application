
// Retrieve saved flashcards from sessionStorage
const savedFlashcards = sessionStorage.getItem('flashcards');

// Convert the saved string back into a JavaScript array
const generatedFlashcards = savedFlashcards
    ? JSON.parse(savedFlashcards)
    : [];

// Get HTML elements
const currentFlashcard = document.getElementById('currentFlashcard');
const cardProgress = document.getElementById('cardProgress');
const revealButton = document.getElementById('revealButton');
const nextButton = document.getElementById('nextButton');
const previousButton = document.getElementById('previousButton');

// Study Mode variables
let currentCardIndex = 0;
let answerVisible = false;

function displayCurrentCard() {
    console.log('displayCurrentCard() is running');
    console.log('Flashcard count:', generatedFlashcards.length);
    // Check whether flashcards exist
    if (generatedFlashcards.length === 0) {
        currentFlashcard.textContent =
            'No flashcards found. Please generate flashcards first.';

        cardProgress.textContent = 'Card 0 of 0';

        revealButton.disabled = true;
        nextButton.disabled = true;

        return;
    }

    // Get the current flashcard
    const card = generatedFlashcards[currentCardIndex];

    // Clear the previous card
    currentFlashcard.innerHTML = '';

    // Create the question
    const question = document.createElement('h3');
    question.textContent = card.question;

    // Create the answer
    const answer = document.createElement('p');
    answer.textContent = card.answer;

    // Hide the answer initially
    answer.style.display = answerVisible ? 'block' : 'none';

    // Add question and answer to the page
    currentFlashcard.appendChild(question);
    currentFlashcard.appendChild(answer);

    // Update card progress
    cardProgress.textContent =
        `Card ${currentCardIndex + 1} of ${generatedFlashcards.length}`;

    // Update button text
    revealButton.textContent = answerVisible
        ? 'Hide Answer'
        : 'Flip Card';
}

// Reveal or hide the answer
revealButton.addEventListener('click', function() {

    answerVisible = !answerVisible;

    displayCurrentCard();

});
// Move to the next flashcard
nextButton.addEventListener('click', function() {

    // Check whether flashcards exist
    if (generatedFlashcards.length === 0) {
        return;
    }

    // Move to the next card
    currentCardIndex++;

    // Return to the first card after the last one
    if (currentCardIndex >= generatedFlashcards.length) {
        currentCardIndex = 0;
    }

    // Hide the answer for the new card
    answerVisible = false;

    // Display the next card
    displayCurrentCard();

});
// Move to the previous flashcard
previousButton.addEventListener('click', function() {
    if (generatedFlashcards.length === 0) {
        return;
    }

    currentCardIndex--;

    if (currentCardIndex < 0) {
        currentCardIndex = generatedFlashcards.length - 1;
    }

    answerVisible = false;
    displayCurrentCard();
});
// Display the first flashcard when the page loads
displayCurrentCard();