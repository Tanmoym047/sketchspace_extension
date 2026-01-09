document.addEventListener('DOMContentLoaded', () => {
  const activeTools = document.getElementById('active-tools');
  const loginMsg = document.getElementById('login-msg');
  const userStatus = document.getElementById('user-status');
  const boardSelect = document.getElementById('board-select');
  const clipButton = document.getElementById('clipText');

  function updateUI(user) {
    if (user && user.email) {
      userStatus.innerText = `Logged in: ${user.email}`;
      activeTools.style.display = 'block';
      loginMsg.style.display = 'none';
      fetchUserBoards(user.email);
    } else {
      userStatus.innerText = "Not logged in";
      activeTools.style.display = 'none';
      loginMsg.style.display = 'block';
    }
  }

  // 1. Initial check: Does background storage have the user?
  chrome.storage.local.get(['currentUser'], (result) => {
    if (result.currentUser) {
      updateUI(result.currentUser);
    } else {
      // 2. If not, ping the active tab to see if it's the app and logged in
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url?.includes("localhost:5173") || tabs[0]?.url?.includes("sketchspace")) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "CHECK_PAGE_AUTH" });
          // Check storage again after a short delay
          setTimeout(() => {
            chrome.storage.local.get(['currentUser'], (res) => updateUI(res.currentUser));
          }, 500);
        } else {
          updateUI(null);
        }
      });
    }
  });

  async function fetchUserBoards(email) {
    try {
      // REPLACE THIS with your actual backend URL
      const response = await fetch(`https://sketchspace-server.onrender.com/allBoards/${email}`);
      const boards = await response.json();

      boardSelect.innerHTML = '<option value="new">-- Create New Board --</option>';
      boards.forEach(board => {
        const option = document.createElement('option');
        option.value = board.roomId;
        option.text = board.name || 'Untitled Board';
        boardSelect.appendChild(option);
      });
    } catch (err) {
      console.log("Backend not reachable for boards yet.");
    }
  }

  clipButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    }, (results) => {
      const text = results[0]?.result;
      if (text?.trim()) {
        chrome.runtime.sendMessage({
          action: 'CLIP_TEXT',
          text: text,
          roomId: boardSelect.value
        });
      } else {
        alert("Please highlight text first!");
      }
    });
  });
});