// Get the dark mode toggle
const themeToggle = document.getElementById('themeToggle');

// Check the saved theme
const savedTheme = localStorage.getItem('theme');

// Apply the saved theme
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
}

// Handle slider changes
themeToggle.addEventListener('change', function() {

    if (themeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }

});