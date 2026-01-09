document.getElementById('clipText').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  }, (results) => {
    const selectedText = results[0]?.result;
    if (selectedText && selectedText.trim().length > 0) {
      chrome.runtime.sendMessage({ action: 'CLIP_TEXT', text: selectedText });
    } else {
      alert("Please highlight some text first!");
    }
  });
});