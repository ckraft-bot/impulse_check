const COOLDOWN_MS = 24 * 60 * 60 * 1000;

function getProductData() {
  return {
    title: document.querySelector("#productTitle")?.innerText || "Unknown",
    price: document.querySelector(".a-price-whole")?.innerText || "",
    url: window.location.href
  };
}

function isBlocked(callback) {
  chrome.storage.local.get(["pendingItem"], (res) => {
    if (!res.pendingItem) return callback(false);

    const diff = Date.now() - res.pendingItem.timestamp;
    callback(diff < COOLDOWN_MS);
  });
}

function showOverlay() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("overlay/overlay.js");

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = chrome.runtime.getURL("overlay/overlay.css");

  document.body.appendChild(style);
  document.body.appendChild(script);
}

function intercept() {
  const buyNow = document.querySelector("#buy-now-button");
  const addToCart = document.querySelector("#add-to-cart-button");

  [buyNow, addToCart].forEach((btn) => {
    if (!btn) return;

    btn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        const item = getProductData();

        chrome.storage.local.set({
          pendingItem: {
            ...item,
            timestamp: Date.now()
          }
        });

        showOverlay();
      },
      true
    );
  });
}

function init() {
  intercept();

  isBlocked((blocked) => {
    if (blocked) showOverlay();
  });
}

init();