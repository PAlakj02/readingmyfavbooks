document.getElementById("scrapeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    // Inject script (if needed)
    chrome.runtime.sendMessage({ type: "injectScript", tabId: tab.id }, (injectionResult) => {
      if (!injectionResult || !injectionResult.success) {
        show("❌ Script injection failed");
        return;
      }

      // Send message to content script to extract content
      chrome.tabs.sendMessage(tab.id, { action: "getPageContent" }, (response) => {
        if (chrome.runtime.lastError) {
          show("❌ Could not send message:\n" + chrome.runtime.lastError.message);
        } else if (!response || !response.success) {
          show("❌ Failed to extract content.");
        } else {
          const { title, text, url } = response;

          // Show loading status
          show("⏳ Sending to backend for summarization...");

          // POST to local backend
          fetch("http://127.0.0.1:8080/scrape", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, url, text })
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                show(`✅ Title: ${title}\n🔗 Link: ${url}\n\n🧠 Summary:\n${data.summary}`);
              } else {
                show("⚠️ Backend error: " + (data.error || "Unknown issue."));
              }
            })
            .catch(err => {
              show("❌ Could not contact backend:\n" + err.message);
            });
        }
      });
    });
  });
});

function show(message) {
  document.getElementById("result").textContent = message;
}
