chrome.omnibox.onInputEntered.addListener((text) => {
  const issueNumber = text.trim();

  if (!/^\d+$/.test(issueNumber)) {
    console.warn(`Invalid issue number entered: "${text}"`);
    chrome.storage.sync.get(['githubUsername', 'githubRepo'], (items) => {
      const username = items.githubUsername;
      const repo = items.githubRepo;
      if (username && repo) {
        chrome.tabs.create({ url: `https://github.com/${username}/${repo}/issues` });
      } else {
        alert('Enter your GitHub organization and repository in the extension options');
        chrome.runtime.openOptionsPage();
      }
    });
    return;
  }

  chrome.storage.sync.get(['githubUsername', 'githubRepo'], (items) => {
    const username = items.githubUsername;
    const repo = items.githubRepo;

    if (username && repo) {
      const githubUrl = `https://github.com/${username}/${repo}/issues/${issueNumber}`;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          const currentTabId = tabs[0].id;
          chrome.tabs.update(currentTabId, { url: githubUrl });
        } else {
          console.error("Could not find the current active tab.");
          chrome.tabs.create({ url: githubUrl });
        }
      });
    } else {
      alert('Enter your GitHub username/organization and repository in the extension options!');
      chrome.runtime.openOptionsPage();
    }
  });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  if (text.trim() === "") {
    suggest([
      { content: "Enter an issue number (e.g., 123)", description: "Type a GitHub issue number" }
    ]);
  } else if (!/^\d+$/.test(text.trim())) {
    suggest([
      { content: text, description: "Invalid input: Please enter a number." }
    ]);
  } else {
    chrome.storage.sync.get(['githubUsername', 'githubRepo'], (items) => {
      const username = items.githubUsername;
      const repo = items.githubRepo;
      if (username && repo) {
        suggest([
          { content: text, description: `Go to ${username}/${repo} issue #${text}` }
        ]);
      } else {
        suggest([
          { content: text, description: "Configure GitHub repo in extension options to use this." }
        ]);
      }
    });
  }
});