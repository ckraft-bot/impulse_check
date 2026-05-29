// src/background/service_worker.js

import { removeItem } from "../utils/storage.js";

const COOLDOWN_MINUTES = 24 * 60; // prod
// const COOLDOWN_MINUTES = 1; // testing

chrome.runtime.onInstalled.addListener(() => {
  console.log("Impulse Check installed");
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.pendingItem) return;

  const { newValue } = changes.pendingItem;

  if (newValue) {
    chrome.alarms.clear("cooldownExpiry", () => {
      chrome.alarms.create("cooldownExpiry", { delayInMinutes: COOLDOWN_MINUTES });
    });
    chrome.action.setBadgeText({ text: "24h" });
    chrome.action.setBadgeBackgroundColor({ color: "#e67e22" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "cooldownExpiry") return;
  try {
    await removeItem("pendingItem");
  } catch (err) {
    console.error("Failed to clear pendingItem:", err);
  }
});