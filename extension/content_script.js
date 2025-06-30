console.log("🟢 Content script injected");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    extractPageContent().then(sendResponse);
    return true;
  }
});

async function extractPageContent() {
  const url = window.location.href;
  const title = document.title;

  try {
   if (url.includes("youtube.com/watch")) {
  // Try waiting for title or fallback after 3s
  await waitForElement('meta[name="title"], h1.title', 3000);

  const videoTitle = (
    document.querySelector('h1.title')?.innerText ||
    document.querySelector('meta[name="title"]')?.content ||
    document.title
  ).trim();

  const channel = (
    document.querySelector('#text-container yt-formatted-string')?.innerText ||
    document.querySelector('ytd-channel-name')?.innerText ||
    document.querySelector('link[itemprop="name"]')?.getAttribute('content') ||
    "Unknown Channel"
  ).trim();

  const description = (
    document.querySelector('#description')?.innerText ||
    document.querySelector('meta[name="description"]')?.content ||
    ""
  ).trim();

  return {
    success: true,
    type: "youtube",
    url:window.location.href,
    title: videoTitle,
    text: `🎬 Title: ${videoTitle}\n📺 Channel: ${channel}\n\n📝 Description:\n${description}`.slice(0, 4000)
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