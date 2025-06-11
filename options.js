// options.js

const githubUsernameInput = document.getElementById('githubUsername');
const githubRepoInput = document.getElementById('githubRepo');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

function loadSettings() {
  chrome.storage.sync.get(['githubUsername', 'githubRepo'], (items) => {
    githubUsernameInput.value = items.githubUsername || '';
    githubRepoInput.value = items.githubRepo || '';
  });
}

function saveSettings() {
  const username = githubUsernameInput.value.trim();
  const repo = githubRepoInput.value.trim();

  if (!username || !repo) {
    statusDiv.textContent = 'Error: Both GitHub Username/Organization and Repository Name are required!';
    statusDiv.style.color = 'red';
    return;
  }

  chrome.storage.sync.set({ githubUsername: username, githubRepo: repo }, () => {
    statusDiv.textContent = 'Settings saved!';
    statusDiv.style.color = 'green';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2000);
  });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', loadSettings);
saveButton.addEventListener('click', saveSettings);