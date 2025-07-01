console.log("🟢 Content script injected");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    extractPageContent().then(sendResponse);
    return true;
  }
});

async function extractPageContent() {
  const url = window.location.href;
  let title = document.title;
  let text = "";

  try {
    if (url.includes("youtube.com/watch")) {
      // Wait for YouTube elements to load
      await waitForElement('#info-contents, #above-the-fold, ytd-watch-metadata', 5000);

      // Get video title with multiple fallbacks
      title = (
        document.querySelector('h1.title')?.innerText ||
        document.querySelector('h1.ytd-watch-metadata')?.innerText ||
        document.querySelector('#container h1')?.innerText ||
        document.querySelector('meta[name="title"]')?.content ||
        title
      ).trim();

      // Get channel name with multiple fallbacks
      const channel = (
        document.querySelector('#channel-name a')?.innerText ||
        document.querySelector('ytd-channel-name a')?.innerText ||
        document.querySelector('yt-formatted-string.ytd-channel-name')?.innerText ||
        document.querySelector('#upload-info a')?.innerText ||
        "Unknown Channel"
      ).trim();

      // Try to expand description
      const showMoreButton = document.querySelector('#expand');
      if (showMoreButton && !showMoreButton.hidden) {
        showMoreButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Get description with multiple fallbacks
      const description = (
        document.querySelector('#description-inline-expander')?.innerText ||
        document.querySelector('#description')?.innerText ||
        document.querySelector('yt-formatted-string.content')?.innerText ||
        ""
      ).trim();

      // Build the text content
      text = [
        `🎬 Title: ${title}`,
        `📺 Channel: ${channel}`,
        `\n📝 Description:\n${description}`
      ].join('\n');

      // Ensure we never return empty required fields
      if (!title) title = "Untitled YouTube Video";
      if (!text) text = "No description available";

      return {
        success: true,
        type: "youtube",
        url: url,
        title: title.slice(0, 200),  // Ensure title isn't too long
        text: text.slice(0, 4000)
      };
    }






    // ✅ ARTICLE handling
    const container = trySelectors([
      'article', 'main', '[role=main]', '.post-content',
      '.markdown-body', '.content', '#content', 'body'
    ]);

    if (container) {
      const clone = container.cloneNode(true);
      removeElements(clone, [
        'script', 'style', 'nav', 'footer', 'header', 'aside',
        'form', 'input', 'button', 'iframe', 'img', 'svg', 'canvas', 'noscript', 'video', 'audio'
      ]);

      const textChunks = Array.from(clone.querySelectorAll('p, h1, h2, h3, li, blockquote, pre'))
        .map(el => el.innerText?.trim())
        .filter(t => t && t.length > 30)
        .filter((v, i, a) => a.indexOf(v) === i); // Deduplicate

      if (textChunks.length > 0) {
        return {
          success: true,
          type: "article",
          url: window.location.href,
          title,
          text: textChunks.join('\n\n').slice(0, 4000)
        };
      }
    }

    // ✅ Fallback to whole page
    const fallback = document.body?.innerText?.trim() || '';
    return fallback.length > 100
      ? { success: true, type: "fallback", url, title, text: fallback.slice(0, 4000) }
      : { success: false, error: "Page has no readable content" };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ✅ Helper Functions

function trySelectors(selectors) {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.offsetHeight > 150) return el;
  }
  return null;
}

function removeElements(root, selectors) {
  selectors.forEach(sel => root.querySelectorAll(sel).forEach(el => el.remove()));
}

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let waited = 0;

    const check = () => {
      if (document.querySelector(selector)) return resolve();
      waited += interval;
      if (waited >= timeout) return reject(new Error("Timeout waiting for " + selector));
      setTimeout(check, interval);
    };
    check();
  });
}