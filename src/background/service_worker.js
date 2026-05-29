const COOLDOWN_MS = 24 * 60 * 60 * 1000; // prod
// const COOLDOWN_MS = 1 * 60 * 1000; // testing

chrome.runtime.onInstalled.addListener(() => {
  console.log("Impulse Check installed");
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.pendingItem) return;

  const { newValue, oldValue } = changes.pendingItem;

  if (newValue && !oldValue) {
    // New cooldown started — set alarm and badge
    chrome.alarms.create("cooldownExpiry", { delayInMinutes: 24 * 60 }); // prod
    // chrome.alarms.create("cooldownExpiry", { delayInMinutes: 1 }); // testing
    chrome.action.setBadgeText({ text: "⏳" });
    chrome.action.setBadgeBackgroundColor({ color: "#e67e22" });
  }

  if (!newValue) {
    // Cooldown cleared — remove badge
    chrome.action.setBadgeText({ text: "" });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cooldownExpiry") {
    chrome.storage.local.remove("pendingItem");
  }
});