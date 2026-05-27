// const COOLDOWN_MS = 24 * 60 * 60 * 1000; // for prod it'll be 24 hours
const COOLDOWN_MS = 1 * 60 * 1000; // for testing let's shorten to 1 min

const KEYWORDS = ["buy now", "place your order", "place order"];

// In-memory cache so interceptClick can act synchronously
let blockedState = false;

function getProductData() {
  return {
    title: document.querySelector("#productTitle")?.innerText.trim() || "Unknown",
    price: document.querySelector(".a-price-whole")?.innerText || "",
    url: window.location.href,
  };
}

function loadBlockedState(callback) {
  chrome.storage.local.get(["pendingItem"], (res) => {
    if (!res.pendingItem) {
      blockedState = false;
    } else {
      const diff = Date.now() - res.pendingItem.timestamp;
      blockedState = diff < COOLDOWN_MS;
    }
    if (callback) callback(blockedState);
  });
}

function injectOverlayCSS() {
  if (document.getElementById("impulse-check-style")) return;
  const style = document.createElement("link");
  style.id = "impulse-check-style";
  style.rel = "stylesheet";
  style.href = chrome.runtime.getURL("src/overlay/overlay.css");
  document.head.appendChild(style);
}

function showOverlay() {
  if (document.getElementById("impulse-check-overlay")) return;

  injectOverlayCSS();

  const overlay = document.createElement("div");
  overlay.id = "impulse-check-overlay";
  overlay.innerHTML = `
    <div class="box">
      <h1>Impulse Check</h1>
      <p>This purchase is on a 24-hour hold.</p>
      <div class="questions">
        <p>Do you already own something similar?</p>
        <p>Are you bored right now?</p>
        <p>Will this matter tomorrow?</p>
      </div>
      <button id="impulse-close">Close</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById("impulse-close").onclick = () => overlay.remove();
}

function isPurchaseIntent(el) {
  const text = (el.innerText || el.value || "").toLowerCase();
  return KEYWORDS.some((k) => text.includes(k));
}

function interceptClick(e) {
  const el = e.target.closest("button, input, a");
  if (!el) return;

  const url = window.location.href;
  const intent = isPurchaseIntent(el);
  const inCheckout = url.includes("/checkout") || url.includes("/gp/buy");

  if (!intent && !inCheckout) return;
  // Synchronous — must happen before any async work
  e.preventDefault();
  e.stopPropagation();

  if (!blockedState) {
    const item = { ...getProductData(), timestamp: Date.now() };
    chrome.storage.local.set({ pendingItem: item });
    blockedState = true;
  }

  showOverlay();
}

function init() {
  document.addEventListener("click", interceptClick, true);

  // Warm the cache, show overlay immediately if already blocked
  loadBlockedState((blocked) => {
    if (blocked) showOverlay();
  });
}

init();