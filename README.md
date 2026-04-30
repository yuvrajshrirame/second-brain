# 2ndBrain.exe // Cognitive Architecture

> **Architect the architecture of your mind.**
> Move beyond linear folders. A high-fidelity neural vault designed exclusively for those who deal in networks, not lists.

`2ndBrain.exe` is a premium, web-based "Second Brain" and Zettelkasten environment. It transforms scattered notes into a densely interconnected, living knowledge graph. Built with React and Firebase, it features real-time cloud syncing, bi-directional linking, a 2D physics-based network visualization, and built-in RPG gamification to reward knowledge synthesis.

---

## 🚀 What's New in v1.8 (Neural Vault Architecture)
The v1.8 update represents a massive architectural overhaul of the routing, folder management, and UI transition engine:
* **Dynamic Cloud Directories:** Fully functional inline folder creation, renaming, and deletion.
* **Safe Node Routing:** Deleting a directory no longer deletes your data; orphaned nodes safely migrate to an "Unassigned" universal pool.
* **Framer Motion Engine:** Buttery-smooth, cinematic page handoffs between the Landing Page, the encrypted Lock Screen, and the Vault interior.
* **Boot Sequence Validation:** A dedicated loading sequence intercepts unauthenticated screen flashing during Firebase initialization.
* **Cyber Modals:** Native browser alerts have been entirely replaced with custom, gold-and-crimson animated confirmation modals for destructive actions (deleting nodes, removing directories, signing out).

---

## ✦ Core Features

### 🕸️ Bi-Directional Linking & Knowledge Graph
* **Neural Tagging:** Use the custom `@` command inside the block editor to seamlessly search and link existing thoughts.
* **Interactive Physics Sandbox:** Watch your ideas cluster in real-time. The built-in 2D physics engine (`react-force-graph-2d`) applies gravitational forces to connected nodes, creating a living map of your brain.

### ⚡ Zero-Friction Capture & Sync
* **Professional Block Editor:** Powered by BlockNote, featuring a custom `/` slash menu for rapid formatting (headings, lists, code blocks) without leaving the keyboard.
* **Dynamic Cloud Syncing:** Real-time Firestore integration with a custom debounced save engine. Features a dynamic `Unsaved -> Syncing... -> Synced` UI indicator to prevent API rate-limiting while ensuring data safety.

### 🎮 Gamified Cognition
* **Cognitive Leveling (RPG System):** A persistent XP bar tracks your activity. Gain 10 XP for creating nodes and a massive 25 XP bonus for synthesizing connections (linking).
* **Synapse Burst:** Leveling up triggers a custom `canvas-confetti` physics burst (styled in Gold, White, and Obsidian) to reward deep work.

### 🔐 Cinematic Security & UX
* **End-to-End Authentication:** Secure Google login via Firebase Auth.
* **Pro Context Menus:** Sleek, floating ellipsis dropdowns keep the sidebar clean and prevent accidental clicks.
* **Cyber-Editorial UI:** A sleek, dark-mode cockpit featuring gold accents, subtle grid textures, monospace subtext, and fully responsive vertical scrolling panels.

---

## 🛠️ Technology Stack

* **Frontend:** React, Vite
* **Backend / Database:** Google Firebase (Authentication & Firestore)
* **Animation & Physics:** `framer-motion`, `react-force-graph-2d`, `canvas-confetti`
* **Rich Text Editor:** `@blocknote/react` & `@blocknote/mantine`
* **Styling:** Custom CSS (Dark Cyber-Aesthetic, Monospace typography)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yuvrajshrirame/brain-exe.git
cd brain-exe
```

### 2. Install Dependencies
Ensure you have Node.js installed, then run:
```
npm install
```

### 3. Firebase Configuration
- You will need to connect this to your own Firebase project.

- Create a project in the Firebase Console.

- Enable Authentication (Google Sign-In) and Firestore Database.

- Create a .env file in the root directory and add your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Initialize the System
```
npm run dev
```
Navigate to http://localhost:5173 to boot the application.