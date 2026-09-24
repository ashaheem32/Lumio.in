# LUMIO AD — Portfolio Website

A fast, elegant, single-page portfolio site for **LUMIO AD** — DOOH (Digital
Out-of-Home) advertising on highways, urban roads and high-traffic junctions.

Built with pure HTML + CSS + JavaScript. No frameworks, no build step —
ready for **Netlify Drop** as-is.

---

## 🚀 Deploy on Netlify Drop (30 seconds)

1. Open **https://app.netlify.com/drop** in your browser.
2. Drag the entire **`LUMIO-AD-Website`** folder from your Desktop onto the page.
3. Done — Netlify gives you a live link instantly (e.g. `https://something.netlify.app`).
4. Optional: create a free Netlify account to keep the site permanently and
   rename the link (Site settings → Change site name), or connect your own
   domain like `lumioad.com`.

---

## 📁 Folder structure

```
LUMIO-AD-Website/
├── index.html          ← the whole site (all sections)
├── css/style.css       ← design & animations
├── js/main.js          ← menu, scroll reveals, counters
├── assets/
│   ├── gemini_generated_video_A6B32F22.mov ← supplied ten-second source video
│   ├── hero-frames/         ← 240 images used for scroll animation
│   ├── hero-lumio-scroll.mp4 ← browser-friendly video with audio
│   ├── hero-lumio-scroll-poster.jpg ← first frame while images load
│   ├── lumio-logo.png       ← full logo (from your PDF, transparent)
│   ├── lumio-mark.png       ← the "L + sparkle" mark
│   ├── favicon.png          ← browser-tab icon
│   ├── apple-touch-icon.png ← iPhone home-screen icon
│   └── og-image.png         ← preview image when the link is shared
└── README.md
```

## ✏️ Things you'll want to customise

| What | Where |
|---|---|
| **Stats** (5,00,000+ impressions, 24/7 presence) | `index.html` → search for `data-target` and change the numbers |
| **WhatsApp number** | Currently `918129241487` (+91 assumed). Search `wa.me/918129241487` in `index.html` to change |
| **Pre-filled WhatsApp message** | The `?text=...` part of each `wa.me` link (text must be URL-encoded) |
| **Location cards** in "Our network" | Replace the CSS mock screens with real photos: put a photo in `assets/` and swap the `<div class="mini ...">` for `<img src="assets/your-photo.jpg" alt="...">` |
| **Copy / wording** | All text lives in `index.html` — edit freely |
| **Share preview URL** | After deploying, change `og:image` in `<head>` to your full live URL, e.g. `https://yoursite.netlify.app/assets/og-image.png` |

## 📝 Notes

- The supplied ten-second hero film advances through 240 frames as visitors scroll, and reverses when scrolling up. The video fills the first screen below the navigation on desktop. On mobile, a short introduction and campaign button accompany the uncropped video. Scrolling moves through all 240 frames in both layouts.
- Frames load around the current scroll position with a bounded image cache. Reduced-motion visitors see the final frame. The complete MP4 with audio remains available in assets.
- Keep the original MOV as the source. To change the film, regenerate the frame sequence, poster and MP4, and update the canvas frame count in `index.html`.
- The WhatsApp links use the international format **+91** 81292 41487.
  If the number is not Indian, update the country code in every `wa.me/...` link.
- The stat figures and the "reply within the hour" line are placeholders —
  set them to your real numbers before going live.
- Fonts (Fraunces & Jost) load from Google Fonts, so the first view needs
  internet — which is always true on Netlify anyway.
