# Impulse Check

Impulse Check is a Chrome extension designed to interrupt impulse buying at the moment it happens.

Instead of trying to control behavior after the fact, Impulse Check inserts a forced pause between intention and action. When a user attempts to purchase an item on supported e-commerce sites, the extension blocks the action and places it on a 24-hour cooldown.

During this pause, users are prompted to reflect:

- Do I already own something similar?
- Am I bored or seeking novelty?
- Will this matter tomorrow?

The goal is not to eliminate spending, but to disrupt impulsive decision-making driven by dopamine and give users space to make more intentional choices. Let's reduce the ADHD tax.

## Features (V1)

- Intercepts "Buy Now" and "Add to Cart" actions on Amazon
- Blocks immediate purchases
- Displays a full-screen reflection overlay
- Enforces a 24-hour cooldown period
- Stores pending items locally in the browser


## Roadmap

- Adjustable cooldown durations
- Multi-site support (beyond Amazon)
- Countdown timer and re-engagement flow
- Behavioral insights and summaries
- Optional backend integration (Python + LLM for adaptive prompts)

## Tech Stack

- Chrome Extension (Manifest V3)
- JavaScript (content scripts, background service worker)
- Local storage (chrome.storage)

## Status

V1: Core interception + cooldown logic in progress