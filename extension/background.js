chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "CONTENT_DETECTED") {
    chrome.storage.local.get(["logs"], (res) => {
      const logs = res.logs || [];
      logs.push(msg.data);
      chrome.storage.local.set({ logs });
    });
  }
});
