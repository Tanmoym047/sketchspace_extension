let capturedImage = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 1. Capture the current tab and store in memory
  if (request.action === 'CAPTURE_SCREEN') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      capturedImage = dataUrl;
      
      const roomId = "clip-" + Date.now();
      // Opens your board with the specific 'extension' flag
      chrome.tabs.create({ 
        url: `https://sketchspace-46391.web.app/board/${roomId}?import=extension` 
      });
    });
  }

  // 2. Wait for the handshake from the website
  if (request.action === 'GET_CAPTURED_IMAGE') {
    sendResponse({ img: capturedImage });
    // Clean up memory after sending so we don't hog RAM
    capturedImage = null; 
  }
  return true; // Keeps the messaging channel open
});