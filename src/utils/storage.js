export function setItem(key, value) {
  chrome.storage.local.set({ [key]: value });
}

export function getItem(key, cb) {
  chrome.storage.local.get([key], (res) => cb(res[key]));
}

export function removeItem(key) {
  chrome.storage.local.remove([key]);
}