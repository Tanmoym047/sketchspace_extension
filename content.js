console.log("SketchSpace Extension Bridge Active");

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  // Handle Text Requests
  if (event.data.type === "REQUEST_TEXT_FROM_EXTENSION") {
    chrome.runtime.sendMessage({ action: 'GET_CLIPPED_TEXT' }, (response) => {
      if (response && response.text) {
        window.postMessage({ type: "TEXT_RECEIVED", text: response.text }, "*");
      }
    });
  }

  // Handle Image URL Requests
  if (event.data.type === "REQUEST_IMAGE_URL_FROM_EXTENSION") {
    chrome.runtime.sendMessage({ action: 'GET_CLIPPED_IMAGE_URL' }, (response) => {
      if (response && response.url) {
        window.postMessage({ type: "IMAGE_URL_RECEIVED", url: response.url }, "*");
      }
    });
  }
});