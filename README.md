# 2ndBrain.exe // Cognitive Architecture

> **Architect the architecture of your mind.**
> Move beyond linear folders. A high-fidelity neural vault designed exclusively for those who deal in networks, not lists.

`brain.exe` is a premium, web-based "Second Brain" and Zettelkasten environment. It transforms scattered notes into a densely interconnected, living knowledge graph. Built with React and Firebase, it features real-time cloud syncing, bi-directional linking, a 2D physics-based network visualization, and built-in RPG gamification to reward knowledge synthesis.

---

## ✦ Core Features (v1.7.0 The Synapse Release)

### 🕸️ Bi-Directional Linking & Knowledge Graph
* **Neural Tagging:** Use the custom `@` command inside the block editor to seamlessly search and link existing thoughts.
* **Interactive Physics Sandbox:** Watch your ideas cluster in real-time. The built-in 2D physics engine (`react-force-graph-2d`) applies gravitational forces to connected nodes, creating a living map of your brain.

### ⚡ Zero-Friction Capture
* **Professional Block Editor:** Powered by BlockNote, featuring a custom `/` slash menu for rapid formatting (headings, lists, code blocks) without leaving the keyboard.
* **Dynamic Cloud Syncing:** Real-time Firestore integration with a custom debounced save engine. Features a dynamic `Unsaved -> Syncing... -> Synced` UI indicator to prevent API rate-limiting while ensuring data safety.

### 🎮 Gamified Cognition
* **Cognitive Leveling (RPG System):** A persistent XP bar tracks your activity. Gain 10 XP for creating nodes and a massive 25 XP bonus for synthesizing connections (linking).
* **Synapse Burst:** Leveling up triggers a custom `canvas-confetti` physics burst (styled in Gold, White, and Obsidian) to reward deep work.
* **Boot Sequence:** A simulated racing progress bar on startup to transition the user into focus mode.

### 🔐 Secure & Aesthetic
* **Google Authentication:** End-to-End encrypted access via Firebase Auth.
* **Cyber-Editorial UI:** A sleek, dark-mode cockpit featuring gold accents, subtle grid textures, monospace subtext, and fully responsive vertical scrolling panels.

---

## 🛠️ Technology Stack

* **Frontend:** React (Vite)
* **Backend / Database:** Google Firebase (Authentication & Firestore)
* **Rich Text Editor:** `@blocknote/react` & `@blocknote/mantine`
* **Graph Visualization:** `react-force-graph-2d`
* **Gamification Physics:** `canvas-confetti`
* **Styling:** Custom CSS (Dark Cyber-Aesthetic)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/brain-exe.git](https://github.com/yourusername/brain-exe.git)
cd brain-exe