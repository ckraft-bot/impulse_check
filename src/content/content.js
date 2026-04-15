const COOLDOWN_MS = 24 * 60 * 60 * 1000;

const KEYWORDS = ["buy", "cart", "checkout", "place", "order"];

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
  // prevent duplicate injection
  if (document.getElementById("impulse-check-overlay")) return;

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/overlay/overlay.js");

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = chrome.runtime.getURL("src/overlay/overlay.css");

  document.body.appendChild(style);
  document.body.appendChild(script);
}

function isPurchaseIntent(el) {
  const text = (el.innerText || el.value || "").toLowerCase();
  return KEYWORDS.some((k) => text.includes(k));
}

function interceptClick(e) {
  const el = e.target.closest("button, input, a");
  if (!el) return;

  const url = window.location.href;
  const inCheckout = url.includes("/checkout") || url.includes("/gp/buy");
  const inCart = url.includes("/cart");

  const intent = isPurchaseIntent(el);

  if (!intent && !inCheckout && !inCart) return;

  isBlocked((blocked) => {
    // Always stop the action first
    e.preventDefault();
    e.stopPropagation();

    if (!blocked) {
      const item = getProductData();

      chrome.storage.local.set({
        pendingItem: {
          ...item,
          timestamp: Date.now()
        }
      });
    }

    showOverlay();
  });
}

function init() {
  // global interception layer (capture phase)
  document.addEventListener("click", interceptClick, true);

  // safety net: enforce cooldown on page load
  isBlocked((blocked) => {
    if (blocked) showOverlay();
  });
}

init();