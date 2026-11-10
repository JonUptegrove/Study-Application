// Get the study sets container
const studySets = document.getElementById('studySets');

// Retrieve saved study sets from localStorage
const savedSets = JSON.parse(
    localStorage.getItem('studySets') || '[]'
);

// Display a message if no study sets exist
if (savedSets.length === 0) {

    studySets.textContent = 'No saved study sets yet.';

} else {

    // Display each saved study set
    savedSets.forEach(function(set) {

        const setElement = document.createElement('div');
        setElement.classList.add('study-set');

        // Display study set name
        const title = document.createElement('h3');
        title.textContent = set.name;

        // Create study button
        const openButton = document.createElement('button');
        openButton.textContent = 'Study Set';

        const quizButton = document.createElement('button');
        quizButton.textContent = 'Take Quiz';

        quizButton.addEventListener('click', function() {
            sessionStorage.setItem('quizNotes', set.notes);
            sessionStorage.setItem('quizTitle', set.name);

            window.location.href = 'quiz.html';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';

        openButton.addEventListener('click', function() {

            sessionStorage.setItem(
                'flashcards',
                JSON.stringify(set.flashcards)
            );

            window.location.href = 'study.html';
        });

        deleteButton.addEventListener('click', function() {

            // Ask the user to confirm deletion
            const confirmDelete = confirm(
                'Are you sure you want to delete this study set?'
            );

            if (!confirmDelete) {
                return;
            }

            // Remove the selected study set
            const updatedSets = savedSets.filter(function(savedSet) {
                return savedSet.id !== set.id;
            });

            // Update localStorage
            localStorage.setItem(
                'studySets',
                JSON.stringify(updatedSets)
            );

            // Refresh the page
            location.reload();
        });

        setElement.appendChild(title);
        setElement.appendChild(openButton);
        setElement.appendChild(quizButton);
        setElement.appendChild(deleteButton);
        studySets.appendChild(setElement);
    });
}