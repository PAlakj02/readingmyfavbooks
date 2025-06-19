chrome.storage.local.get(["logs"], (res) => {
  const list = document.getElementById("list");
  (res.logs || []).forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.title}</strong><br><a href="${item.url}" target="_blank">${item.url}</a>`;
    list.appendChild(li);
  });
});
