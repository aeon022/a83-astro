# ABTEILUNG83 // KERNEL V2.0

**"Less Noise. Nice Data. No Bloat."** 

This is the core repository for the ABTEILUNG83 system upgrade. We have replaced the monolithic WordPress stack with a native Astro architecture and integrated Keystatic CMS to maximize performance and data sovereignty.

---

## 🛠 Tech Stack (The Engine)

* **Framework:** Astro 5.x (Zero-JS by default, Islands Architecture)
* **CMS:** Keystatic (Git-based, No-Database Content Management)
* **Styling:** Tailwind CSS v4 (Design Tokens injected via `@theme`)
* **Runtime:** Node.js (Standalone mode via official adapter)
* 
**Type Safety:** TypeScript & Zod validation 



---

## 📂 Repository Structure

```text
/
├── docs/                     # Strategy & Master Concepts
[cite_start]└── frontend/                 # Primary Astro Application [cite: 69]
    ├── src/
    [cite_start]│   ├── content/          # DATA LAYER: .json/.mdoc files (Single Source of Truth) [cite: 25, 73, 83]
    [cite_start]│   │   ├── showcase/     # Project references [cite: 74, 84]
    [cite_start]│   │   ├── services/     # System modules [cite: 75, 85]
    [cite_start]│   │   └── pricing/      # Contract definitions [cite: 76, 86]
    [cite_start]│   ├── components/       # ATOMS & MOLECULES [cite: 78, 88, 93]
    [cite_start]│   │   ├── ui/           # Base elements (Pill, GlitchText, TerminalButton) [cite: 79, 80, 90, 91]
    [cite_start]│   │   ├── blocks/       # Complex UI blocks (Hero, Manifesto) [cite: 92, 94, 96]
    [cite_start]│   │   └── islands/      # Interactive components (Cmd+K Palette, ROI-Calc) [cite: 97, 99, 100]
    [cite_start]│   ├── layouts/          # Page & HUD structures [cite: 101, 102, 103]
    [cite_start]│   └── styles/           # Global CSS & Tailwind v4 theme [cite: 104, 107, 108]
    [cite_start]├── keystatic.config.ts    # CMS Schema definitions [cite: 30, 70, 81]
    [cite_start]└── astro.config.mjs       # Astro engine configuration [cite: 71, 82]

```

---

## 🚀 Getting Started (Local Dev)

1. **Initialize Environment:**
Navigate to the frontend directory.
2. **Install Dependencies:**
`npm install`
3. **Launch Kernel:**
`npm run dev`
* **System Core:** http://localhost:4321
* 
**CMS Admin:** http://localhost:4321/keystatic 





---

## ⚡ Core Features & "Holy Shit" Experiences

* 
**Command Palette (Cmd+K):** A high-speed HUD navigation menu built with native HTML5 dialog .


* 
**Speed-to-Cash ROI-Calculator:** Interactive Astro Island for real-time value visualization .


* 
**WebGL Neon Rain:** Ultra-sharp background shader (< 10KB) running directly on the GPU .


* 
**Tactical Sound Design:** Subliminal audio feedback for a high-end software feel .



---

## 🛡 Security & Performance

* 
**Metrics:** Lighthouse scores > 90 out-of-the-box.


* 
**No-DB Architecture:** Eliminated SQL injection surface by using a Git-based backend.


* **Hybrid Rendering:** SSR for dynamic CMS routes and Static Generation for informational pages.


