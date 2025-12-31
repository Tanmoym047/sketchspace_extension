// content.js
console.log("SketchSpace Extension Bridge Active");

window.addEventListener("message", (event) => {
  // We only care about messages coming from our own React app
  if (event.source !== window) return;

  if (event.data.type === "REQUEST_IMAGE_FROM_EXTENSION") {
    chrome.runtime.sendMessage({ action: "GET_CAPTURED_IMAGE" }, (response) => {
      if (response && response.img) {
        // Hand the pixels back to the Board.jsx
        window.postMessage({ type: "IMAGE_RECEIVED", img: response.img }, "*");
      }
    });
  }
});