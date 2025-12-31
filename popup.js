document.getElementById('captureBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'CAPTURE_SCREEN' });
});