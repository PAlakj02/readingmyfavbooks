function isRelevantPage() {
  const url = window.location.href;
  const isYouTube = url.includes("youtube.com/watch");
  const isArticle = document.querySelector("article") || document.body.innerText.length > 500;
  return isYouTube || isArticle;
}

function getPageData() {
  return {
    title: document.title,
    url: window.location.href,
    text: document.body.innerText.slice(0, 3000),
    timestamp: new Date().toISOString()
  };
}

if (isRelevantPage()) {
  chrome.runtime.sendMessage({
    type: "CONTENT_DETECTED",
    data: getPageData()
  });
}
