<div align="center">
  <h1>🧠 2ndBrain.exe</h1>
  <p><b>Architect the architecture of your mind.</b></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](#)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](#)
  
  <br />
</div>

> Move beyond linear folders. **2ndBrain.exe** is a high-fidelity neural vault designed exclusively for those who deal in networks, not lists.

It transforms scattered notes into a densely interconnected, living knowledge graph. Built with React and Firebase, it features real-time cloud syncing, bi-directional linking, a fully custom 2D physics-based network visualization, and built-in RPG gamification to reward knowledge synthesis.

---

## 🚀 What's New in v1.9 (The Physics & Persistence Update)

The v1.9 update rips out third-party graphing libraries in favor of a proprietary, highly-tuned physics engine, alongside rock-solid session persistence:

* **Custom HTML5 Physics Engine:** Replaced external libraries with a native Canvas API implementation, utilizing custom Hooke's Law (springs) and Coulomb's Law (repulsion) mathematics.
* **Organic Orbital Floating:** Nodes now utilize continuous sine-wave time functions to breathe and drift asynchronously, making the network feel alive even when idle.
* **Persistent Session Routing:** The state machine now intercepts browser reloads. If a Firebase session is detected, it smoothly routes returning users through the Boot Sequence directly back to the Vault.
* **Pythagorean Click Detection:** Built a custom event listener that calculates geometric distances from the mouse to canvas elements.

---

## ✦ Core Features

### 🕸️ Bi-Directional Linking & Knowledge Graph
* **Neural Tagging:** Use the custom `@` command inside the block editor to seamlessly search and link existing thoughts.
* **Interactive Physics Sandbox:** Watch your ideas cluster in real-time. The custom HTML5 canvas engine applies gravitational forces and velocity damping to connected nodes.

### ⚡ Zero-Friction Capture & Sync
* **Professional Block Editor:** Powered by BlockNote, featuring a custom `/` slash menu for rapid formatting without leaving the keyboard.
* **Dynamic Cloud Syncing:** Real-time Firestore integration with a custom debounced save engine. Features a dynamic `Unsaved -> Syncing... -> Synced` UI indicator to prevent API rate-limiting.
* **Safe Node Routing:** Deleting a directory no longer deletes your data; orphaned nodes safely migrate to an "Unassigned" universal pool.

### 🎮 Gamified Cognition
* **Cognitive Leveling (RPG System):** A persistent XP bar tracks your activity. Gain `10 XP` for creating nodes and a massive `25 XP` bonus for synthesizing connections.
* **Synapse Burst:** Leveling up triggers a custom physics burst (styled in Gold, White, and Obsidian) to reward deep work.

### 🔐 Cinematic Security & UX
* **Framer Motion Engine:** Buttery-smooth, cinematic page handoffs between the Landing Page, the Boot Sequence, and the Vault interior.
* **Cyber Modals & Menus:** Native browser alerts are replaced with custom animated confirmation modals. Sleek, floating ellipsis dropdowns keep the sidebar clean.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React (v18), Vite |
| **Backend** | Google Firebase (Auth & Firestore) |
| **Animation/Physics**| Native HTML5 Canvas, Framer Motion, Canvas-Confetti |
| **Rich Text Editor** | BlockNote (`@blocknote/react`) |
| **Styling** | Custom CSS (Dark Cyber-Aesthetic, Monospace typography) |

---

## ⚙️ Local Installation & Setup

Follow these steps to deploy your own local instance of the Cognitive Architecture.

### 1. Clone the Repository
Pull the code to your local machine:
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
You must connect this application to your own Firebase project for authentication and database management.

1. Go to the Firebase Console.

2. Create a new project.

3. Enable Authentication (Select the Google Sign-In provider).

4. Enable Firestore Database (Start in Test Mode or configure your security rules).

5. Register a Web App in your project settings to get your API keys.

6. Create a .env file in the root directory of your project and populate it with your specific keys:

```json
# .env
VITE_FIREBASE_API_KEY="your_api_key_here"
VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

### 4. Initialize the System

Boot up the Vite development server:

```
npm run dev
```
Navigate to http://localhost:5173 in your browser to initialize the neural link.