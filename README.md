<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
=======

# 💼 Smart Job Matching Platform 

> A data-driven platform that uses AI to match unemployed youth in Kenya with job opportunities tailored to their skills, education, and interests.

---

## 🌍 Problem Statement

Youth unemployment in Kenya remains a critical challenge, with many young people struggling to find jobs that match their qualifications. This project aims to build an intelligent job matching platform to bridge the gap between youth talent and job market demands using AI, inclusive UX, and real user insights.

---

## 🎯 Project Objectives

- Understand the root causes of youth unemployment
- Collect and analyze job market data
- Build a Minimum Viable Product (MVP) for smart job matching
- Design with empathy and inclusivity (e.g. accessible UI, sign language interpretation)
- Deliver a pitch-ready prototype and product roadmap

---

## 🧑🏽‍🤝‍🧑🏽 Our Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **Raymond Klanderman** | Project Manager / Developer | Technical setup, GitHub management, project structure, wireframing, prototype development |
| **Erick Wabwire** | Team Leader / Data Analyst | Meeting coordination, data collection, visualizations, AI logic, voiceover |
| **Grace Saidimu** | Product Manager | Product direction, MVP definition, script writing, presentation design |
| **Daniel Musyoka** | UX Researcher / Sign Language Interpreter | User interviews, UX testing, accessibility features, sign language content |

---

## 🛠️ Tech Stack

- **Frontend**: Figma (Prototype), HTML/CSS (for mock demos)
- **Backend (Optional)**: Firebase / Node.js (for simulated matching logic)
- **AI Logic**: Rule-based logic (Phase 1), expand with ML in future phases
- **Tools**: Canva, Datawrapper, Trello, ClickUp, Pictory.ai, Google Workspace

---

## 🗓️ Sprint Timeline

| Week | Focus |
|------|-------|
| Week 5 | Problem Analysis & User Research |
| Week 6 | Ideation & MVP Design |
| Week 7 | Prototyping & User Testing |
| Week 8 | Final Video Pitch & Presentation |

---

## 📈 Sample Data Visualizations

- 📊 Unemployment Rates by Age Group (Kenya vs Global)
- 📉 Youth Skill Mismatch vs Available Jobs
*(Available in `/assets/visuals` folder once uploaded)*

---

## 🚀 Getting Started

1. Clone the repo  
```bash
git clone https://github.com/rayklanderman/SmartJobMatchingPlatform.git
```

2. Navigate into the directory  
```bash
cd SmartJobMatchingPlatform
```

3. Open `figma-prototype/` or view demo links (coming soon)

---

## 📁 Folder Structure (Planned)

```
📦 SmartJobMatchingPlatform/
│
├── 📂 assets/               # Charts, personas, branding
├── 📂 figma-prototype/     # Screens and UI flows
├── 📂 pitch-materials/     # Scripts, slides, and video
├── 📂 research/            # Interview data, personas, empathy maps
├── README.md               # This file
```

---

## ⚖️ Why Our Team Setup Works

- **Raymond** keeps technical structure and flow running smoothly.
- **Erick** motivates the team, manages meetings, and ensures strong data insights.
- **Grace** leads product vision and presentation delivery.
- **Daniel** grounds everything in empathy and inclusion with real user input.

---

## 🗣️ Let's Collaborate!

Feel free to fork the project or contribute ideas via [Issues](https://github.com/rayklanderman/SmartJobMatchingPlatform/issues) or [Discussions](https://github.com/rayklanderman/SmartJobMatchingPlatform/discussions).

---

## 📹 Pitch Video (Coming Week 8)

Stay tuned for the final pitch presentation video.

---

## 📜 License

This project is for academic and nonprofit use only. MIT License will be added upon launch.

---

> Made with purpose by Team **Wagradani**  
```

>>>>>>> b1784d670c609cefccb45a4be670b31a0bbb591a
