chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "injectScript") {
    chrome.scripting.executeScript({
      target: { tabId: message.tabId },
      files: ["content_script.js"]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError.message);
        sendResponse({ success: false });
      } else {
        console.log("✅ Content script injected");
        sendResponse({ success: true });
      }
    });
    return true;
  }
});
