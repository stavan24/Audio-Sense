// JS for profile.html: localStorage for username

document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username-input');
  const saveBtn = document.getElementById('save-btn');
  const displayName = document.getElementById('display-name');

  // Load saved username
  const savedUsername = localStorage.getItem('username') || 'Anonymous';
  usernameInput.value = savedUsername;
  displayName.textContent = savedUsername;

  // Save username
  saveBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
      localStorage.setItem('username', username);
      displayName.textContent = username;
      alert('Username saved!');
    } else {
      alert('Please enter a username.');
    }
  });
});
