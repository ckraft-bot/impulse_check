const COOLDOWN_MS = 24 * 60 * 60 * 1000;

chrome.runtime.onInstalled.addListener(() => {
  console.log("Impulse Check installed");
});

// When content.js sets a new pendingItem, schedule expiry and update badge
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.pendingItem) return;

  const { newValue, oldValue } = changes.pendingItem;

  if (newValue && !oldValue) {
    // New cooldown started — set alarm and badge
    chrome.alarms.create("cooldownExpiry", { delayInMinutes: 24 * 60 });
    chrome.action.setBadgeText({ text: "⏳" });
    chrome.action.setBadgeBackgroundColor({ color: "#e67e22" });
  }

  if (!newValue) {
    // Cooldown cleared — remove badge
    chrome.action.setBadgeText({ text: "" });
  }
});

// Alarm fires after 24h — clear the pending item
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cooldownExpiry") {
    chrome.storage.local.remove("pendingItem");
  }
});