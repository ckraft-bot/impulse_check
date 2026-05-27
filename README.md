# Impulse Check

A Chrome extension that interrupts impulse buying at the point of action.

Instead of reacting after a purchase, it introduces a forced 24-hour cooldown
before checkout on supported e-commerce sites.

When triggered, users are shown a brief reflection prompt:

- Do I already own something similar?
- Am I bored or seeking novelty?
- Will this matter tomorrow?

The goal is not restriction, but interruption — breaking the dopamine-driven
loop before it completes.

---

## Installation (Development)

1. Clone the repo
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the repo folder
5. Visit Amazon and try adding something to your cart

---

## Features (V1)

- Intercepts "Buy Now" and "Place Your Order" on Amazon
- Blocks immediate purchase flow with a full-screen reflection overlay
- Global 24-hour cooldown (resets after 24h via `chrome.alarms`)
- Extension icon badge shows when a cooldown is active
- Local storage only — no backend, no tracking

---

## Roadmap

- Per-item cooldown (vs. global)
- Adjustable cooldown duration
- Multi-site support (Etsy, eBay, Shopify)
- Countdown timer + re-engagement flow
- Purchase history + spending insights

---

## Tech Stack

- Chrome Extension (Manifest V3)
- JavaScript (content script + service worker)
- Chrome Storage API (`chrome.storage.local`)
- Chrome Alarms API (`chrome.alarms`)

---