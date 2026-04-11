# Impulse Check

Chrome extension that interrupts impulse buying at the point of action.

Instead of reacting after purchase, it introduces a forced 24-hour cooldown before checkout on supported e-commerce sites.

When triggered, users are shown a brief reflection prompt:

- Do I already own something similar?
- Am I bored or seeking novelty?
- Will this matter tomorrow?

The goal is not restriction, but interruption of impulsive dopamine-driven purchasing to reduce unnecessary spending.

---

## Features (V1)

- Intercepts "Buy Now" and "Add to Cart" on Amazon
- Blocks immediate purchase flow
- Full-screen reflection overlay
- 24-hour cooldown per item
- Local storage only (no backend)

---

## Roadmap

- Adjustable cooldown duration
- Multi-site support
- Countdown + re-engagement flow
- Purchase history + insights

---

## Tech Stack

- Chrome Extension (Manifest V3)
- JavaScript (content + background scripts)
- Chrome storage API