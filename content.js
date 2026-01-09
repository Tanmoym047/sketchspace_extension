console.log("SketchSpace Extension Bridge Active");

// 1. Listen for Auth Data from the React Web Page
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data.type === "SKETCHSPACE_AUTH_DATA") {
    // Send to background.js to save it permanently
    chrome.runtime.sendMessage({
      action: 'SAVE_AUTH_STATE',
      user: { email: event.data.email, uid: event.data.uid }
    });
  }
});

// 2. Listen for "Ping" from Popup to refresh auth
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CHECK_PAGE_AUTH") {
    // Ask the React App to re-send its auth data
    window.postMessage({ type: "REQUEST_AUTH_REFRESH" }, "*");
  }
});

// 3. Handle Text Requests from React App (Existing Logic)
window.addEventListener("message", (event) => {
  if (event.data.type === "REQUEST_TEXT_FROM_EXTENSION") {
    chrome.runtime.sendMessage({ action: 'GET_CLIPPED_TEXT' }, (response) => {
      if (response && response.text) {
        window.postMessage({ type: "TEXT_RECEIVED", text: response.text }, "*");
      }
    });
  }
});