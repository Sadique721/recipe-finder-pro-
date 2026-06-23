# 🌌 OmniQuery Pro - Unified Discovery Engine & AI Agent Workspace

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![APIs Supported](https://img.shields.io/badge/APIs-16%20Channels-blueviolet)

OmniQuery Pro is a premium, glassmorphic search dashboard that merges **16 distinct discovery channels** into a single frontend hub. It features live queries to public APIs (Recipes, Cocktails, Movies, Music, News, Sports, Anime, Books, Crypto, Dictionary, Universities, Jokes, Quotes, and Developers), a retro arcade mini-game sandbox, and an interactive AI Agent console with live terminal command streaming.

---

## ✨ Features

- 🎨 **Glassmorphism Design**: High-fidelity dark mode utilizing backdrop filters, glowing HSL colors, smooth transitions, and animated loaders.
- 🔗 **API ID Badges**: Each search result displays its unique ID tag prominently, reflecting system record tracking.
- 🎵 **Floating Audio Player**: Integrates iTunes track previews with real-time audio playback controls and a scrubbing progress bar.
- 🎮 **Retro Arcade Sandbox**: Canvas-based Snake Game embedded directly within the Online Gaming channel.
- 🤖 **AI Agent Workspace**: Interactive terminal shell where users can issue tasks to simulated AI Agents (Antigravity, AutoGPT, Claude Engineer, Devika) and view streaming execution logs.
- 📱 **Fully Responsive Layout**: Intuitive sidebar navigation collapses to an horizontal scrollbar on tablet/mobile screens.

---

## 🛠️ Architecture

```
                                  [ OmniQuery Pro Dashboard ]
                                               │
        ┌──────────────────────────────────────┼──────────────────────────────────────┐
        ▼                                      ▼                                      ▼
[ Public APIs Feed ]                 [ Retro Game Arcade ]                 [ AI Agent Workspace ]
  ├── Recipes (MealDB)                 └── Snake Classic                     ├── Terminal Terminal Emulator
  ├── Cocktails (CocktailDB)                                                 ├── Log Feed stream
  ├── Movies & TV (TVMaze)                                                   └── Agent Profile cards
  ├── Music (iTunes)
  ├── News (Spaceflight)
  ├── Sports (SportsDB)
  ├── Anime (Jikan)
  ├── Books (OpenLibrary)
  ├── Crypto (CoinGecko)
  ├── Dictionary (DictionaryAPI)
  ├── Universities (HipoLabs)
  ├── Jokes (Official Joke)
  ├── Quotes (DummyJSON)
  └── Developers (DummyJSON)
```

---

## 📂 Project Structure

- [index.htm](file:///d:/Githube/New%20folder/recipe-finder-pro-/index.htm): Modern structural markup for the sidebar layout, main search dashboard panels, custom audio players, game canvas, and terminal output screens.
- [style.css](file:///d:/Githube/New%20folder/recipe-finder-pro-/style.css): Custom stylesheet implementing HSL variables, dark glassmorphic styling, neon glows, scrollbars, and keyframe animations.
- [script.js](file:///d:/Githube/New%20folder/recipe-finder-pro-/script.js): Main core engine managing API routers, player controls, canvas game graphics, and AI agent terminal logging streams.
- [note.txt](file:///d:/Githube/New%20folder/recipe-finder-pro-/note.txt): Fast reference file detailing developer notes, endpoints, and highlighted elements.

---

## 🚀 Getting Started

1. Clone or download the repository files.
2. Double-click [index.htm](file:///d:/Githube/New%20folder/recipe-finder-pro-/index.htm) to open the application directly in any web browser.
3. Select any search channel from the sidebar, input queries, and explore live metadata records.
