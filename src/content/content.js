// src/content/content.js

import { getItem, setItem, removeItem } from "../utils/storage.js";

const KEYWORDS = ["buy now", "place your order", "place order"];

let blockedState = false;

function getProductData() {
  return {
    title: document.querySelector("#productTitle")?.innerText.trim() || "Unknown",
    price: document.querySelector(".a-price-whole")?.innerText || "",
    url: window.location.href,
  };
}

function getTimeRemaining(timestamp) {
  const COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - timestamp;
  const remaining = COOLDOWN_MS - elapsed;
  if (remaining <= 0) return null;
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

async function loadBlockedState(callback) {
  try {
    const pendingItem = await getItem("pendingItem");

    if (!pendingItem) {
      blockedState = false;
      if (callback) callback(false, null);
      return;
    }

    const timeRemaining = getTimeRemaining(pendingItem.timestamp);

    if (!timeRemaining) {
      await removeItem("pendingItem");
      blockedState = false;
      if (callback) callback(false, null);
      return;
    }

    blockedState = true;
    if (callback) callback(true, timeRemaining);
  } catch (err) {
    console.error("Failed to read storage:", err);
    blockedState = false;
    if (callback) callback(false, null);
  }
}

function injectOverlayCSS() {
  if (document.getElementById("impulse-check-style")) return;
  const link = document.createElement("link");
  link.id = "impulse-check-style";
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("src/overlay/overlay.css");
  document.head.appendChild(link);
}

function showOverlay(timeRemaining = "24h 0m") {
  if (document.getElementById("impulse-check-overlay")) return;

  injectOverlayCSS();

  const overlay = document.createElement("div");
  overlay.id = "impulse-check-overlay";
  overlay.innerHTML = `
    <div class="box">
      <h1>Impulse Check</h1>
      <p>This purchase is on hold for <strong>${timeRemaining}</strong>.</p>
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

async function interceptClick(e) {
  const el = e.target.closest("button, input, a");
  if (!el) return;

  const url = window.location.href;
  const intent = isPurchaseIntent(el);
  const inCheckout = url.includes("/checkout") || url.includes("/gp/buy");

  if (!intent && !inCheckout) return;

  e.preventDefault();
  e.stopPropagation();

  if (!blockedState) {
    try {
      await setItem("pendingItem", { ...getProductData(), timestamp: Date.now() });
      blockedState = true;
      showOverlay("24h 0m");
    } catch (err) {
      console.error("Failed to save pendingItem:", err);
    }
    return;
  }

  loadBlockedState((blocked, timeRemaining) => {
    showOverlay(timeRemaining || "soon");
  });
}

function init() {
  document.addEventListener("click", interceptClick, true);

  loadBlockedState((blocked, timeRemaining) => {
    if (blocked) showOverlay(timeRemaining);
  });
}

init();