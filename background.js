chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'CLIP_TEXT') {
    chrome.storage.local.set({ clippedText: request.text }, () => {
      const roomId = "text-" + Date.now();
      chrome.tabs.create({ 
        url: `https://sketchspace-46391.web.app/board/${roomId}?import=text` 
      });
    });
  }

  if (request.action === 'GET_CLIPPED_TEXT') {
    chrome.storage.local.get(['clippedText'], (result) => {
      sendResponse({ text: result.clippedText || "" });
    });
    return true;
  }
});