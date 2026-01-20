// Shared JS for navigation, hamburger menu, and dark mode toggle

document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Dark Mode Toggle
  const toggleButton = document.getElementById('dark-mode-toggle');
  const body = document.body;
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'light') {
    body.classList.add('light-mode');
    toggleButton.textContent = 'Dark Mode';
  } else {
    toggleButton.textContent = 'Light Mode';
  }

  toggleButton.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('darkMode', isLight ? 'light' : 'dark');
    toggleButton.textContent = isLight ? 'Dark Mode' : 'Light Mode';
  });
});