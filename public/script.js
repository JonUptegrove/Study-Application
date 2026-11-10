// Get HTML elements
const notesFile = document.getElementById('notesFile');
const uploadButton = document.getElementById('uploadButton');
const extractedText = document.getElementById('extractedText');

// Store selected file
let selectedFile = null;

// Study Mode elements
const studyMode = document.getElementById('studyMode');
const currentFlashcard = document.getElementById('currentFlashcard');
const cardProgress = document.getElementById('cardProgress');
const revealButton = document.getElementById('revealButton');
const nextButton = document.getElementById('nextButton');

// Study Mode variables
let generatedFlashcards = [];
let currentCardIndex = 0;
let answerVisible = false;

function displayCurrentCard() {

    // Make sure flashcards exist
    if (generatedFlashcards.length === 0) {
        currentFlashcard.textContent = 'No flashcards available.';
        cardProgress.textContent = 'Card 0 of 0';
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

    // Update reveal button
    revealButton.textContent = answerVisible
        ? 'Hide Answer'
        : 'Show Answer';
}

const generateButton = document.getElementById('generateButton');

// Study set elements
const studySetName = document.getElementById('studySetName');
const studySets = document.getElementById('studySets');

let uploadedNotes = '';

// Detect when a file is selected
notesFile.addEventListener('change', function() {

    selectedFile = notesFile.files[0];

    if (selectedFile) {

        const fileName = selectedFile.name.toLowerCase();

        // Check file extension
        if (!fileName.endsWith('.pdf') &&
            !fileName.endsWith('.txt')) {

            alert('Please select a PDF or TXT file.');

            notesFile.value = '';
            selectedFile = null;

            return;
        }

        alert('File selected: ' + selectedFile.name);
    }
});

// Handle upload button click
uploadButton.addEventListener('click', async function() {

    if (!selectedFile) {
        alert('Please select a file first.');
        return;
    }

    // Create FormData object
    const formData = new FormData();

    // Add file to FormData
    formData.append('notes', selectedFile);

    try {

        // Send file to backend
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        // Convert response into JavaScript data
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(result.message);

        // Display extracted text
        extractedText.textContent = result.text;
        uploadedNotes = result.text;

        // Print filename in console
        console.log('Uploaded file:', result.filename);

        // Clear selected file
        notesFile.value = '';
        selectedFile = null;

    } catch (error) {

        alert('Upload failed: ' + error.message);

    }

});
generateButton.addEventListener('click', async function() {

    if (!uploadedNotes) {
        alert('Please upload your notes first.');
        return;
    }

    try {

        const response = await fetch('/generate-flashcards', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                notes: uploadedNotes
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        generatedFlashcards = result.flashcards;
        // Get the study set name
        const name = studySetName.value.trim();

// Make sure the user entered a name
        if (!name) {
            alert('Please enter a name for your study set.');
            return;
        }

// Retrieve existing study sets
        const savedSets = JSON.parse(
            localStorage.getItem('studySets') || '[]'
        );

// Create the new study set
        const newStudySet = {
            id: Date.now(),
            name: name,
            notes: uploadedNotes,
            flashcards: generatedFlashcards
        };

// Add the new set to the saved sets
        savedSets.push(newStudySet);

// Save everything to localStorage
        localStorage.setItem(
            'studySets',
            JSON.stringify(savedSets)
        );

// Refresh the displayed study sets
        displaySavedStudySets();

// Clear the name field
        studySetName.value = '';

// Save flashcards so study.html can access them
        sessionStorage.setItem(
            'flashcards',
            JSON.stringify(generatedFlashcards)
        );
        console.log(
            'Saved flashcard count:',
            JSON.parse(sessionStorage.getItem('flashcards')).length
        );

        currentCardIndex = 0;
        answerVisible = false;
        displayCurrentCard();

        const studySets = document.getElementById('studySets');

        studySets.innerHTML = '';

        result.flashcards.forEach(function(card) {

            const flashcard = document.createElement('div');

            flashcard.classList.add('flashcard');

            const question = document.createElement('h3');
            question.textContent = card.question;

            const answer = document.createElement('p');
            answer.textContent = card.answer;

            flashcard.appendChild(question);
            flashcard.appendChild(answer);

            studySets.appendChild(flashcard);

            flashcard.addEventListener('click', function() {

                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                } else {
                    answer.style.display = 'block';
                }

            });
        });

        alert('Flashcards generated successfully!');

    } catch (error) {

        console.error('Flashcard generation error:', error);

        alert('Could not generate flashcards: ' + error.message);

    }

});
revealButton.addEventListener('click', function() {

    // Switch answer visibility
    answerVisible = !answerVisible;

    // Refresh the current flashcard
    displayCurrentCard();

});
nextButton.addEventListener('click', function() {

    // Check whether flashcards exist
    if (generatedFlashcards.length === 0) {
        return;
    }

    // Move to the next flashcard
    currentCardIndex++;

    // Return to the first card if we reach the end
    if (currentCardIndex >= generatedFlashcards.length) {
        currentCardIndex = 0;
    }

    // Hide the answer for the new card
    answerVisible = false;

    // Display the new flashcard
    displayCurrentCard();

});
// Display saved study sets
function displaySavedStudySets() {

    // Retrieve saved study sets from localStorage
    const savedSets = JSON.parse(
        localStorage.getItem('studySets') || '[]'
    );

    // Clear the current list
    studySets.innerHTML = '';

    // Display a message if there are no saved sets
    if (savedSets.length === 0) {
        studySets.textContent = 'No saved study sets yet.';
        return;
    }

    // Create an entry for each saved study set
    savedSets.forEach(function(set) {

        const setElement = document.createElement('div');

        setElement.classList.add('study-set');

        const title = document.createElement('h3');
        title.textContent = set.name;

        const openButton = document.createElement('button');
        openButton.textContent = 'Study Set';

        openButton.addEventListener('click', function() {

            sessionStorage.setItem(
                'flashcards',
                JSON.stringify(set.flashcards)
            );

            window.location.href = 'study.html';
        });

        setElement.appendChild(title);
        setElement.appendChild(openButton);

        studySets.appendChild(setElement);
    });
}
displaySavedStudySets();