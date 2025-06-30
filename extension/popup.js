document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    chrome.storage.local.set({ token: data.token }, () => {
      show("✅ Login successful!");
    });
  } else {
    show("❌ Login failed: " + data.error);
  }
});

document.getElementById("registerBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name = prompt("Enter your name:");

  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await res.json();
  if (res.ok) {
    chrome.storage.local.set({ token: data.token }, () => {
      show("✅ Registered and logged in!");
    });
  } else {
    show("❌ Register failed: " + data.error);
  }
});

document.getElementById("scrapeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    chrome.runtime.sendMessage({ type: "injectScript", tabId: tab.id }, (injectionResult) => {
      if (!injectionResult || !injectionResult.success) {
        show("❌ Script injection failed");
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: "getPageContent" }, async (response) => {
        if (chrome.runtime.lastError) {
          show("❌ Could not send message:\n" + chrome.runtime.lastError.message);
        } else if (!response || !response.success) {
          show("❌ Failed to extract content.");
        } else {
          const { title, text, url } = response;
          show("⏳ Sending to backend for summarization...");

          try {
            const { token } = await chrome.storage.local.get(["token"]);
            if (!token) {
              show("⚠️ Not logged in. Please log in to summarize.");
              return;
            }

            const res = await fetch("http://localhost:3000/api/summarize", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
              },
              body: JSON.stringify({ title, url, text }),
            });

            const data = await res.json();
            if (data.success) {
              show(`✅ Title: ${title}\n🔗 Link: ${url}\n\n🧠 Summary:\n${data.summary}`);
            } else {
              show("⚠️ Backend error: " + (data.error || "Unknown issue."));
            }
          } catch (err) {
            show("❌ Could not contact backend:\n" + err.message);
          }
        }
      });
    });
  });
});

function show(message) {
  document.getElementById("result").textContent = message;
}
