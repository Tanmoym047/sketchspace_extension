chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Save Auth State from Content Script
  if (request.action === 'SAVE_AUTH_STATE') {
    chrome.storage.local.set({ currentUser: request.user });
  }

  // Handle Clipping
  if (request.action === 'CLIP_TEXT') {
    chrome.storage.local.set({ clippedText: request.text }, () => {
      // Use chosen roomId if provided, otherwise generate a new one
      const roomId = (request.roomId && request.roomId !== 'new') 
        ? request.roomId 
        : "text-" + Date.now();
      
      chrome.tabs.create({ 
        url: `http://localhost:5173/board/${roomId}?import=text` 
      });
    });
  }

  // Retrieve Clipped Text for the Board
  if (request.action === 'GET_CLIPPED_TEXT') {
    chrome.storage.local.get(['clippedText'], (result) => {
      sendResponse({ text: result.clippedText || "" });
    });
    return true; // Keep channel open for async response
  }
});