// OmniQuery Pro - Unified Discovery Engine JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const sidebarNav = document.querySelector(".sidebar-nav");
  const navItems = document.querySelectorAll(".nav-item");
  const activeCategoryTitle = document.getElementById("active-category-title");
  const activeCategoryDesc = document.getElementById("active-category-desc");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const apiStatusBadge = document.getElementById("api-status-badge");
  const apiEndpointUrl = document.getElementById("api-endpoint-url");
  const recordsCountBadge = document.getElementById("records-count-badge");
  const resultsGrid = document.getElementById("results-grid");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const sidebar = document.querySelector(".sidebar");

  // Sandbox Panels
  const gamingSandbox = document.getElementById("gaming-sandbox");
  const aiAgentSandbox = document.getElementById("ai-agent-sandbox");

  // Modal Elements
  const detailModal = document.getElementById("detail-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalBodyContent = document.getElementById("modal-body-content");

  // Floating Player Elements
  const globalPlayer = document.getElementById("global-player");
  const playerArt = document.getElementById("player-art");
  const playerTitle = document.getElementById("player-title");
  const playerArtist = document.getElementById("player-artist");
  const playerPlayBtn = document.getElementById("player-play");
  const playerPrevBtn = document.getElementById("player-prev");
  const playerNextBtn = document.getElementById("player-next");
  const progressBg = document.getElementById("progress-bar-bg");
  const progressFill = document.getElementById("progress-bar-fill");
  const globalAudio = document.getElementById("global-audio-element");

  // Application State
  let currentCategory = "recipes";
  let activeResults = [];
  let currentTrackIndex = -1;
  let isPlaying = false;
  let searchDebounceTimer;

  // AI Agent Mock Database & Simulator State
  const aiAgentsData = [
    {
      id: "agent-001",
      name: "Antigravity",
      developer: "Google DeepMind",
      version: "v4.2.1-prod",
      status: "idle",
      icon: "fa-rocket",
      capabilities: "Advanced Agentic Coding, Multi-file Refactoring, Code verification, Architectural planning",
      description: "A highly intelligent agent designed for pair programming, full codebase refactoring, and strict lint compliance. Equipped with sandboxed CLI tools.",
      updates: [
        "Added verification loop validation integration.",
        "Improved HSL-theme CSS auto-generation.",
        "Optimized deep file search performance."
      ]
    },
    {
      id: "agent-002",
      name: "AutoGPT",
      developer: "Significant Gravitas",
      version: "v0.5.4",
      status: "idle",
      icon: "fa-brain",
      capabilities: "Autonomous web research, task orchestration, file-writing, execution planning",
      description: "An open-source autonomous agent builder that breaks down high-level prompt goals into smaller tasks and self-executes them in a loop.",
      updates: [
        "Implemented memory management via vector databases.",
        "Enhanced browse-agent research resilience.",
        "Fixed file writing path permission bugs."
      ]
    },
    {
      id: "agent-003",
      name: "Claude Engineer",
      developer: "Doriandelnorte",
      version: "v2.1.0",
      status: "idle",
      icon: "fa-terminal",
      capabilities: "Terminal-based editing, workspace indexation, git operations, local testing",
      description: "A robust developer tool that interacts directly with your workspace via CLI, allowing direct code generation and debugging sessions.",
      updates: [
        "Added interactive project mapping capabilities.",
        "Added automatic prompt history compression.",
        "Optimized diff editing precision."
      ]
    },
    {
      id: "agent-004",
      name: "Devika",
      developer: "Mufeed VH",
      version: "v1.0.8",
      status: "idle",
      icon: "fa-laptop-code",
      capabilities: "Full-stack software engineering, planning, self-debugging, UI generation",
      description: "An open-source AI Software Engineer that acts as an autonomous collaborator, creating codebases from scratch based on user demands.",
      updates: [
        "Integrated custom browser subagents for web testing.",
        "Added support for advanced local LLMs.",
        "Reconstructed UI layout using glassmorphic cards."
      ]
    }
  ];

  let selectedAgentId = "agent-001";

  // Online Games Local Database
  const onlineGamesData = [
    {
      id: "game-001",
      title: "Cyber Strike",
      genre: "Shooter / Sci-Fi",
      platform: "PC / Web Browser",
      developer: "Futurism Labs",
      rating: "4.8/5",
      link: "#",
      desc: "Engage in fast-paced competitive battle inside a digital arena. Fully rendered inside WebGL.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500"
    },
    {
      id: "game-002",
      title: "Rogue Dungeon Pro",
      genre: "RPG / Roguelike",
      platform: "HTML5 Desktop & Mobile",
      developer: "RetroCode Studio",
      rating: "4.6/5",
      link: "#",
      desc: "Explore procedurally generated dungeon chambers, fight monsters, and collect ancient gold relics.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500"
    },
    {
      id: "game-003",
      title: "Space Tactics",
      genre: "Strategy",
      platform: "Cross-Platform Browser",
      developer: "NeoSpherical",
      rating: "4.5/5",
      link: "#",
      desc: "Coordinate star fleets, build resource stations, and expand cosmic territories in real-time.",
      image: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=500"
    },
    {
      id: "game-004",
      title: "Snake Retro Classic",
      genre: "Arcade / Puzzle",
      platform: "Embedded Sandbox",
      developer: "VanillaJS Inc.",
      rating: "4.9/5",
      link: "arcade",
      desc: "Play the original snake game inline. Test your reflexes and achieve the highest scores!",
      image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500"
    }
  ];

  // Category Configuration
  const categoryConfigs = {
    recipes: {
      title: "Recipes Finder",
      desc: "Explore food recipes from across the globe using TheMealDB API",
      endpoint: "https://www.themealdb.com/api/json/v1/1/search.php?s=",
      placeholder: "Search recipes (e.g. chicken, soup)...",
      fetchUrl: (query) => `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
      parseData: (data) => data.meals || [],
      renderCard: (meal) => `
        <div class="card-item" data-id="${meal.idMeal}">
          <div class="card-header-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <span class="card-tag">${meal.strCategory}</span>
            <span class="card-id-badge">ID: ${meal.idMeal}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${meal.strMeal}</h3>
            <p class="card-subtitle"><i class="fas fa-globe-asia"></i> Area: ${meal.strArea}</p>
            <p class="card-desc">${meal.strInstructions || ''}</p>
            <div class="card-actions">
              <button class="btn btn-primary view-details-btn"><i class="fas fa-eye"></i> View Recipe</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (meal) => `
        <div class="modal-header-section">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="modal-poster">
          <div class="modal-header-info">
            <h2 class="modal-title">${meal.strMeal}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">Recipe ID: ${meal.idMeal}</span>
              <span class="modal-badge">${meal.strCategory}</span>
              <span class="modal-badge">${meal.strArea} Dish</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Ingredients & Measures</span>
            <span class="detail-field-val">
              <ul style="padding-left: 20px;">
                ${getIngredientsList(meal)}
              </ul>
            </span>
          </div>
        </div>
        <div class="modal-desc-section">
          <h4>Cooking Instructions:</h4>
          <p>${meal.strInstructions.replace(/\r\n|\r|\n/g, "<br>")}</p>
        </div>
      `
    },
    cocktails: {
      title: "Cocktail Bar",
      desc: "Search drink recipes and instructions from TheCocktailDB API",
      endpoint: "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=",
      placeholder: "Search cocktails (e.g. margarita, mojito)...",
      fetchUrl: (query) => `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`,
      parseData: (data) => data.drinks || [],
      renderCard: (drink) => `
        <div class="card-item" data-id="${drink.idDrink}">
          <div class="card-header-img">
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <span class="card-tag">${drink.strAlcoholic}</span>
            <span class="card-id-badge">ID: ${drink.idDrink}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${drink.strDrink}</h3>
            <p class="card-subtitle"><i class="fas fa-glass-martini"></i> Glass: ${drink.strGlass}</p>
            <p class="card-desc">${drink.strInstructions || ''}</p>
            <div class="card-actions">
              <button class="btn btn-primary view-details-btn"><i class="fas fa-eye"></i> View Recipe</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (drink) => `
        <div class="modal-header-section">
          <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="modal-poster">
          <div class="modal-header-info">
            <h2 class="modal-title">${drink.strDrink}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">Drink ID: ${drink.idDrink}</span>
              <span class="modal-badge">${drink.strCategory}</span>
              <span class="modal-badge">${drink.strAlcoholic}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Glass Choice</span>
            <span class="detail-field-val">${drink.strGlass}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Ingredients</span>
            <span class="detail-field-val">
              <ul style="padding-left: 20px;">
                ${getIngredientsList(drink)}
              </ul>
            </span>
          </div>
        </div>
        <div class="modal-desc-section">
          <h4>Instructions:</h4>
          <p>${drink.strInstructions}</p>
        </div>
      `
    },
    movies: {
      title: "Hollywood & Bollywood Shows",
      desc: "Query cinematic profiles, rankings, and details from TVMaze API",
      endpoint: "https://api.tvmaze.com/search/shows?q=",
      placeholder: "Search shows (e.g. friends, game of thrones)...",
      fetchUrl: (query) => `https://api.tvmaze.com/search/shows?q=${query}`,
      parseData: (data) => data.map(item => item.show) || [],
      renderCard: (show) => {
        const imageSrc = show.image ? show.image.medium : 'https://picsum.photos/300/400?blur=10';
        const rating = show.rating && show.rating.average ? `<i class="fas fa-star text-neon-green"></i> ${show.rating.average}/10` : 'No rating';
        return `
          <div class="card-item anime-card" data-id="${show.id}">
            <div class="card-header-img">
              <img src="${imageSrc}" alt="${show.name}">
              <span class="card-tag">${show.type || 'Show'}</span>
              <span class="card-id-badge">ID: ${show.id}</span>
            </div>
            <div class="card-body">
              <h3 class="card-title">${show.name}</h3>
              <p class="card-subtitle">${rating} | <i class="fas fa-language"></i> ${show.language || 'English'}</p>
              <p class="card-desc">${show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No summary details.'}</p>
              <div class="card-actions">
                <button class="btn btn-primary view-details-btn"><i class="fas fa-info-circle"></i> Info Profile</button>
              </div>
            </div>
          </div>
        `;
      },
      renderDetails: (show) => {
        const imageSrc = show.image ? show.image.original : 'https://picsum.photos/400/600';
        return `
          <div class="modal-header-section">
            <img src="${imageSrc}" alt="${show.name}" class="modal-poster">
            <div class="modal-header-info">
              <h2 class="modal-title">${show.name}</h2>
              <div class="modal-badges">
                <span class="modal-badge id">TVMaze ID: ${show.id}</span>
                <span class="modal-badge">${show.status || 'Active'}</span>
                <span class="modal-badge">${show.language}</span>
              </div>
            </div>
          </div>
          <div class="modal-details-grid">
            <div class="detail-field">
              <span class="detail-field-label">Genres</span>
              <span class="detail-field-val">${show.genres ? show.genres.join(", ") : "None"}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field-label">Premiered</span>
              <span class="detail-field-val">${show.premiered || 'N/A'}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field-label">Runtime</span>
              <span class="detail-field-val">${show.averageRuntime || show.runtime || 'N/A'} mins</span>
            </div>
            <div class="detail-field">
              <span class="detail-field-label">Rating</span>
              <span class="detail-field-val">${show.rating && show.rating.average ? show.rating.average + "/10" : 'N/A'}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field-label">Official Page</span>
              <span class="detail-field-val"><a href="${show.officialSite || show.url}" target="_blank">Visit Site <i class="fas fa-external-link-alt"></i></a></span>
            </div>
          </div>
          <div class="modal-desc-section">
            <h4>Summary:</h4>
            <p>${show.summary || 'No summary available.'}</p>
          </div>
        `;
      }
    },
    music: {
      title: "Music & Audio Tracks",
      desc: "Fetch albums, artist singles, and play preview tracks from iTunes",
      endpoint: "https://itunes.apple.com/search?entity=song&term=",
      placeholder: "Search songs, artists (e.g. Taylor Swift, Linkin Park)...",
      fetchUrl: (query) => `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=24`,
      parseData: (data) => data.results || [],
      renderCard: (track, index) => `
        <div class="card-item music-card" data-id="${track.trackId}">
          <div class="card-header-img">
            <img src="${track.artworkUrl100.replace('100x100bb', '300x300bb')}" alt="${track.trackName}">
            <span class="card-tag">Music</span>
            <span class="card-id-badge">ID: ${track.trackId}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${track.trackName}</h3>
            <p class="card-subtitle"><i class="fas fa-microphone"></i> ${track.artistName}</p>
            <p class="card-desc">Album: ${track.collectionName}<br>Genre: ${track.primaryGenreName}<br>Released: ${track.releaseDate ? track.releaseDate.substring(0, 4) : 'N/A'}</p>
            <div class="card-actions">
              <button class="btn btn-music-play play-track-btn" data-index="${index}"><i class="fas fa-play"></i> Play Preview</button>
              <button class="btn btn-secondary view-details-btn"><i class="fas fa-search"></i> Details</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (track) => `
        <div class="modal-header-section">
          <img src="${track.artworkUrl100.replace('100x100bb', '300x300bb')}" alt="${track.trackName}" class="modal-poster">
          <div class="modal-header-info">
            <h2 class="modal-title">${track.trackName}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">Track ID: ${track.trackId}</span>
              <span class="modal-badge">${track.primaryGenreName}</span>
              <span class="modal-badge">${track.country}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Artist</span>
            <span class="detail-field-val">${track.artistName}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Album Collection</span>
            <span class="detail-field-val">${track.collectionName}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Track Cost</span>
            <span class="detail-field-val">${track.trackPrice} ${track.currency}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Release Time</span>
            <span class="detail-field-val">${new Date(track.releaseDate).toLocaleDateString()}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Full Record Link</span>
            <span class="detail-field-val"><a href="${track.trackViewUrl}" target="_blank">Apple Music <i class="fas fa-external-link-alt"></i></a></span>
          </div>
        </div>
      `
    },
    news: {
      title: "Latest Space & Tech News",
      desc: "Live news, publisher updates, and space flight blogs from Spaceflight News API",
      endpoint: "https://api.spaceflightnewsapi.net/v4/articles/?search=",
      placeholder: "Search news (e.g. NASA, Mars, SpaceX)...",
      fetchUrl: (query) => `https://api.spaceflightnewsapi.net/v4/articles/?search=${query}&limit=24`,
      parseData: (data) => data.results || [],
      renderCard: (article) => `
        <div class="card-item" data-id="${article.id}">
          <div class="card-header-img">
            <img src="${article.image_url}" alt="${article.title}">
            <span class="card-tag">${article.news_site || 'News'}</span>
            <span class="card-id-badge">ID: ${article.id}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${article.title}</h3>
            <p class="card-subtitle"><i class="fas fa-calendar-alt"></i> ${new Date(article.published_at).toLocaleDateString()}</p>
            <p class="card-desc">${article.summary}</p>
            <div class="card-actions">
              <a href="${article.url}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Read Source</a>
              <button class="btn btn-secondary view-details-btn"><i class="fas fa-plus"></i> Summary</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (article) => `
        <div class="modal-header-section">
          <img src="${article.image_url}" alt="${article.title}" class="modal-poster">
          <div class="modal-header-info">
            <h2 class="modal-title">${article.title}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">Article ID: ${article.id}</span>
              <span class="modal-badge">${article.news_site}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Published At</span>
            <span class="detail-field-val">${new Date(article.published_at).toLocaleString()}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">External Resource</span>
            <span class="detail-field-val"><a href="${article.url}" target="_blank">Original Publisher <i class="fas fa-external-link-alt"></i></a></span>
          </div>
        </div>
        <div class="modal-desc-section">
          <h4>Full Summary:</h4>
          <p>${article.summary || 'No detailed summary provided.'}</p>
        </div>
      `
    },
    sports: {
      title: "Sports & Teams Directory",
      desc: "Lookup sports clubs, countries, and team descriptions from TheSportsDB",
      endpoint: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=",
      placeholder: "Search team (e.g. Arsenal, Real Madrid, Lakers)...",
      fetchUrl: (query) => `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${query}`,
      parseData: (data) => data.teams || [],
      renderCard: (team) => `
        <div class="card-item sports-card" data-id="${team.idTeam}">
          <div class="card-header-img" style="background-color: #0b0e14; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <img src="${team.strTeamBadge}" alt="${team.strTeam}" style="width: auto; height: 160px; object-fit: contain;">
            <span class="card-tag">${team.strSport}</span>
            <span class="card-id-badge">ID: ${team.idTeam}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${team.strTeam}</h3>
            <p class="card-subtitle"><i class="fas fa-trophy text-neon-blue"></i> League: ${team.strLeague}</p>
            <p class="card-desc">${team.strDescriptionEN || 'No English description registered.'}</p>
            <div class="card-actions">
              <button class="btn btn-primary view-details-btn"><i class="fas fa-info-circle"></i> Team Info</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (team) => `
        <div class="modal-header-section">
          <img src="${team.strTeamBadge}" alt="${team.strTeam}" class="modal-poster" style="object-fit: contain; background: #000; padding: 10px;">
          <div class="modal-header-info">
            <h2 class="modal-title">${team.strTeam} (${team.strAlternate || team.strShortCode || ''})</h2>
            <div class="modal-badges">
              <span class="modal-badge id">Team ID: ${team.idTeam}</span>
              <span class="modal-badge">${team.strSport}</span>
              <span class="modal-badge">${team.strCountry}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Primary League</span>
            <span class="detail-field-val">${team.strLeague}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Stadium Venue</span>
            <span class="detail-field-val">${team.strStadium || 'N/A'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Founded Year</span>
            <span class="detail-field-val">${team.intFormedYear || 'N/A'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Official Website</span>
            <span class="detail-field-val">${team.strWebsite ? `<a href="https://${team.strWebsite}" target="_blank">Website <i class="fas fa-external-link-alt"></i></a>` : 'N/A'}</span>
          </div>
        </div>
        <div class="modal-desc-section">
          <h4>History & Details:</h4>
          <p>${team.strDescriptionEN || 'No detailed background available.'}</p>
        </div>
      `
    },
    games: {
      title: "Online Gaming Catalog & Arcade",
      desc: "Explore multiplayer, RPG, and browser games, or launch our retro Snake mini-game",
      endpoint: "Local Sandbox Database",
      placeholder: "Search games (e.g. Cyber, Rogue, Snake)...",
      fetchUrl: async (query) => {
        // Return local high-fidelity gaming items based on search query
        return new Promise((resolve) => {
          const lower = query.toLowerCase();
          const filtered = onlineGamesData.filter(g => 
            g.title.toLowerCase().includes(lower) || 
            g.genre.toLowerCase().includes(lower)
          );
          resolve(filtered);
        });
      },
      parseData: (data) => data,
      renderCard: (game) => `
        <div class="card-item" data-id="${game.id}">
          <div class="card-header-img">
            <img src="${game.image}" alt="${game.title}">
            <span class="card-tag">${game.genre}</span>
            <span class="card-id-badge">ID: ${game.id}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${game.title}</h3>
            <p class="card-subtitle"><i class="fas fa-gamepad"></i> Developer: ${game.developer} | Rating: ${game.rating}</p>
            <p class="card-desc">${game.desc}</p>
            <div class="card-actions">
              ${game.link === 'arcade' 
                ? `<button class="btn btn-primary start-arcade-btn"><i class="fas fa-play-circle"></i> Play Game Inline</button>` 
                : `<a href="${game.link}" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Launch Page</a>`}
              <button class="btn btn-secondary view-details-btn"><i class="fas fa-question-circle"></i> Specs</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (game) => `
        <div class="modal-header-section">
          <img src="${game.image}" alt="${game.title}" class="modal-poster">
          <div class="modal-header-info">
            <h2 class="modal-title">${game.title}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">Game ID: ${game.id}</span>
              <span class="modal-badge">${game.genre}</span>
              <span class="modal-badge">Rating: ${game.rating}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Platforms Supported</span>
            <span class="detail-field-val">${game.platform}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Studio Developer</span>
            <span class="detail-field-val">${game.developer}</span>
          </div>
        </div>
        <div class="modal-desc-section">
          <h4>Gameplay Overview:</h4>
          <p>${game.desc}</p>
        </div>
      `
    },
    anime: {
      title: "Anime Pop Culture Library",
      desc: "Find anime series, ratings, character summaries, and episodes via Jikan API v4",
      endpoint: "https://api.jikan.moe/v4/anime?q=",
      placeholder: "Search anime (e.g. naruto, death note, one piece)...",
      fetchUrl: (query) => `https://api.jikan.moe/v4/anime?q=${query}`,
      parseData: (data) => data.data || [],
      renderCard: (anime) => `
        <div class="card-item anime-card" data-id="${anime.mal_id}">
          <div class="card-header-img">
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <span class="card-tag">${anime.type || 'TV'}</span>
            <span class="card-id-badge">ID: ${anime.mal_id}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${anime.title}</h3>
            <p class="card-subtitle"><i class="fas fa-star text-neon-blue"></i> Score: ${anime.score || 'N/A'} | Episodes: ${anime.episodes || 'N/A'}</p>
            <p class="card-desc">${anime.synopsis || 'No synopsis info provided.'}</p>
            <div class="card-actions">
              <button class="btn btn-primary view-details-btn"><i class="fas fa-info"></i> Synopsis</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (anime) => `
        <div class="modal-header-section">
          <img src="${anime.images.jpg.large_image_url || anime.images.jpg.image_url}" alt="${anime.title}" class="modal-poster">
          <div class="modal-header-info">
            <h2 class="modal-title">${anime.title}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">MAL ID: ${anime.mal_id}</span>
              <span class="modal-badge">Rating: ${anime.rating || 'N/A'}</span>
              <span class="modal-badge">Ranked: #${anime.rank || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Status</span>
            <span class="detail-field-val">${anime.status || 'N/A'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Aired Interval</span>
            <span class="detail-field-val">${anime.aired && anime.aired.string ? anime.aired.string : 'N/A'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Studio Producers</span>
            <span class="detail-field-val">${anime.studios ? anime.studios.map(s => s.name).join(", ") : 'N/A'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Source Material</span>
            <span class="detail-field-val">${anime.source || 'N/A'}</span>
          </div>
        </div>
        <div class="modal-desc-section">
          <h4>Background & Synopsis:</h4>
          <p>${anime.synopsis || 'No background description provided.'}</p>
        </div>
      `
    },
    books: {
      title: "Books & Literature Finder",
      desc: "Search public catalog titles, authors, and cover prints from Open Library",
      endpoint: "https://openlibrary.org/search.json?q=",
      placeholder: "Search books (e.g. lord of the rings, harry potter)...",
      fetchUrl: (query) => `https://openlibrary.org/search.json?q=${query}&limit=20`,
      parseData: (data) => data.docs || [],
      renderCard: (book) => {
        const coverUrl = book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
          : 'https://picsum.photos/300/450?blur=5';
        const formattedId = book.key ? book.key.replace("/works/", "") : "N/A";
        return `
          <div class="card-item" data-id="${formattedId}">
            <div class="card-header-img">
              <img src="${coverUrl}" alt="${book.title}">
              <span class="card-tag">Literature</span>
              <span class="card-id-badge">ID: ${formattedId}</span>
            </div>
            <div class="card-body">
              <h3 class="card-title">${book.title}</h3>
              <p class="card-subtitle"><i class="fas fa-pen-fancy"></i> Author: ${book.author_name ? book.author_name[0] : 'Unknown'}</p>
              <p class="card-desc">Publish Year: ${book.first_publish_year || 'N/A'}<br>Edition Count: ${book.edition_count || 1}<br>Publisher: ${book.publisher ? book.publisher[0] : 'N/A'}</p>
              <div class="card-actions">
                <button class="btn btn-primary view-details-btn"><i class="fas fa-book-open"></i> Full Details</button>
              </div>
            </div>
          </div>
        `;
      },
      renderDetails: (book) => {
        const coverUrl = book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` 
          : 'https://picsum.photos/400/600';
        const formattedId = book.key ? book.key.replace("/works/", "") : "N/A";
        return `
          <div class="modal-header-section">
            <img src="${coverUrl}" alt="${book.title}" class="modal-poster">
            <div class="modal-header-info">
              <h2 class="modal-title">${book.title}</h2>
              <div class="modal-badges">
                <span class="modal-badge id">Work ID: ${formattedId}</span>
                <span class="modal-badge">Publish Year: ${book.first_publish_year || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div class="modal-details-grid">
            <div class="detail-field">
              <span class="detail-field-label">Authors</span>
              <span class="detail-field-val">${book.author_name ? book.author_name.join(", ") : 'Unknown'}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field-label">Language Codes</span>
              <span class="detail-field-val">${book.language ? book.language.join(", ").toUpperCase() : 'N/A'}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field-label">Publishers</span>
              <span class="detail-field-val">${book.publisher ? book.publisher.slice(0, 5).join(", ") : 'N/A'}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field-label">OpenLibrary Link</span>
              <span class="detail-field-val"><a href="https://openlibrary.org${book.key}" target="_blank">Book Web Link <i class="fas fa-external-link-alt"></i></a></span>
            </div>
          </div>
        `;
      }
    },
    "ai-agents": {
      title: "AI Agents System Hub",
      desc: "Inspect model capabilities, update logs, or run interactive task simulations in the agent workspace console",
      endpoint: "Internal AI Agents Workspace Database & Simulator Logs",
      placeholder: "Search agents (e.g. Antigravity, AutoGPT, Claude)...",
      fetchUrl: async (query) => {
        return new Promise((resolve) => {
          const lower = query.toLowerCase();
          const filtered = aiAgentsData.filter(agent => 
            agent.name.toLowerCase().includes(lower) || 
            agent.capabilities.toLowerCase().includes(lower)
          );
          resolve(filtered);
        });
      },
      parseData: (data) => data,
      renderCard: (agent) => `
        <div class="card-item ai-card" data-id="${agent.id}">
          <div class="card-body">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff;">
                <i class="fas ${agent.icon}"></i>
              </div>
              <div>
                <h3 style="font-size: 18px; font-weight: 700;">${agent.name}</h3>
                <p style="font-size: 12px; color: var(--text-secondary);">${agent.developer}</p>
              </div>
              <span class="card-id-badge" style="position: static; margin-left: auto;">${agent.version}</span>
            </div>
            <p class="card-subtitle">
              <span class="status-indicator ${agent.status}"></span>
              Status: <span style="text-transform: capitalize;">${agent.status}</span>
            </p>
            <p class="card-desc" style="margin-bottom: 12px;">${agent.description}</p>
            <div class="card-meta-tags">
              ${agent.capabilities.split(", ").slice(0, 3).map(cap => `<span class="meta-tag">${cap}</span>`).join("")}
            </div>
            <div class="card-actions">
              <button class="btn btn-primary run-sim-btn" data-agent-id="${agent.id}"><i class="fas fa-terminal"></i> Load Console</button>
              <button class="btn btn-secondary view-details-btn"><i class="fas fa-history"></i> Log History</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (agent) => `
        <div class="modal-header-section">
          <div style="width: 80px; height: 80px; border-radius: 16px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); display: flex; align-items: center; justify-content: center; font-size: 36px; color: #fff; margin-right: 12px;">
            <i class="fas ${agent.icon}"></i>
          </div>
          <div class="modal-header-info">
            <h2 class="modal-title">${agent.name}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">UUID: ${agent.id}</span>
              <span class="modal-badge">${agent.developer}</span>
              <span class="modal-badge">${agent.version}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Capabilities</span>
            <span class="detail-field-val">${agent.capabilities}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Operational Status</span>
            <span class="detail-field-val" style="text-transform: capitalize;">${agent.status}</span>
          </div>
        </div>
        <div class="modal-desc-section" style="margin-bottom: 20px;">
          <h4>Agent Description:</h4>
          <p>${agent.description}</p>
        </div>
        <div class="modal-list-section">
          <h4>Recent Update Records & Logs:</h4>
          <ul>
            ${agent.updates.map(update => `<li>${update}</li>`).join("")}
          </ul>
        </div>
      `
    },
    crypto: {
      title: "Cryptocurrencies Search",
      desc: "Check real-time digital currencies, ratings, rankings, and ID trackers via CoinGecko API",
      endpoint: "https://api.coingecko.com/api/v3/search?query=",
      placeholder: "Search crypto (e.g. bitcoin, ethereum, solana)...",
      fetchUrl: (query) => `https://api.coingecko.com/api/v3/search?query=${query}`,
      parseData: (data) => data.coins || [],
      renderCard: (coin) => `
        <div class="card-item" data-id="${coin.id}">
          <div class="card-header-img" style="background-color: #0b0e14; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <img src="${coin.large}" alt="${coin.name}" style="width: auto; height: 120px; object-fit: contain;">
            <span class="card-tag">Market Rank: #${coin.market_cap_rank || 'N/A'}</span>
            <span class="card-id-badge">ID: ${coin.id}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${coin.name}</h3>
            <p class="card-subtitle"><i class="fas fa-dollar-sign"></i> Symbol: ${coin.symbol.toUpperCase()}</p>
            <div class="card-actions">
              <button class="btn btn-primary view-details-btn"><i class="fas fa-search-dollar"></i> Inspect Rank</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (coin) => `
        <div class="modal-header-section">
          <img src="${coin.large}" alt="${coin.name}" class="modal-poster" style="object-fit: contain; padding: 10px; background: #000;">
          <div class="modal-header-info">
            <h2 class="modal-title">${coin.name}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">Coingecko API ID: ${coin.id}</span>
              <span class="modal-badge">Symbol: ${coin.symbol.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Market Capitalization Rank</span>
            <span class="detail-field-val">#${coin.market_cap_rank || 'Unranked'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">API Reference Token</span>
            <span class="detail-field-val">${coin.api_symbol || coin.id}</span>
          </div>
        </div>
      `
    },
    dictionary: {
      title: "English Dictionary Lookup",
      desc: "Get definitions, phonetics, parts of speech, and sample sentences from the Free Dictionary API",
      endpoint: "https://api.dictionaryapi.dev/api/v2/entries/en/",
      placeholder: "Enter English word (e.g. computer, coding, science)...",
      fetchUrl: (query) => `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`,
      parseData: (data) => Array.isArray(data) ? data : [],
      renderCard: (entry, index) => `
        <div class="card-item" data-id="${entry.word}-${index}">
          <div class="card-body">
            <div class="card-id-badge" style="position: static; width: fit-content; margin-bottom: 12px;">Word Definition</div>
            <h3 class="card-title" style="font-size: 24px; text-transform: capitalize;">${entry.word}</h3>
            <p class="card-subtitle"><i class="fas fa-volume-up text-neon-blue"></i> Phonetic: ${entry.phonetic || entry.phonetics?.find(p => p.text)?.text || 'N/A'}</p>
            <p class="card-desc">${entry.meanings[0]?.definitions[0]?.definition || 'Definition details not found.'}</p>
            <div class="card-actions">
              <button class="btn btn-primary view-details-btn"><i class="fas fa-atlas"></i> Learn More</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (entry) => `
        <div class="modal-header-section">
          <div style="width: 80px; height: 80px; border-radius: 16px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); display: flex; align-items: center; justify-content: center; font-size: 36px; color: #fff; margin-right: 12px;">
            <i class="fas fa-spell-check"></i>
          </div>
          <div class="modal-header-info">
            <h2 class="modal-title" style="text-transform: capitalize;">${entry.word}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">Lexicon Entry</span>
              <span class="modal-badge">${entry.phonetic || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div class="modal-desc-section">
          ${entry.meanings.map(meaning => `
            <div style="margin-bottom: 20px;">
              <h4 style="text-transform: capitalize; color: var(--accent-blue); font-size: 15px; margin-bottom: 8px;">Part of Speech: ${meaning.partOfSpeech}</h4>
              <ul style="padding-left: 20px; color: var(--text-secondary);">
                ${meaning.definitions.slice(0, 3).map(def => `
                  <li style="margin-bottom: 8px;">
                    <div><b>Definition:</b> ${def.definition}</div>
                    ${def.example ? `<div style="font-style: italic; color: var(--text-muted); margin-top: 2px;">"Example: ${def.example}"</div>` : ''}
                  </li>
                `).join("")}
              </ul>
            </div>
          `).join("")}
        </div>
      `
    },
    universities: {
      title: "Global Universities Finder",
      desc: "Locate universities worldwide, domains, and register URLs via HipoLabs API",
      endpoint: "http://universities.hipolabs.com/search?name=",
      placeholder: "Search university name (e.g. Stanford, Oxford, Delhi)...",
      fetchUrl: (query) => `http://universities.hipolabs.com/search?name=${query}`,
      parseData: (data) => Array.isArray(data) ? data.slice(0, 30) : [],
      renderCard: (uni, index) => `
        <div class="card-item" data-id="uni-${index}">
          <div class="card-body">
            <div class="card-id-badge" style="position: static; width: fit-content; margin-bottom: 12px;">${uni.alpha_two_code || 'UNI'}</div>
            <h3 class="card-title">${uni.name}</h3>
            <p class="card-subtitle"><i class="fas fa-map-marker-alt"></i> Country: ${uni.country}</p>
            <p class="card-desc">Domain: ${uni.domains ? uni.domains[0] : 'N/A'}</p>
            <div class="card-actions">
              <a href="${uni.web_pages ? uni.web_pages[0] : '#'}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Visit Website</a>
            </div>
          </div>
        </div>
      `,
      renderDetails: () => `` // Handled directly via external redirect links
    },
    jokes: {
      title: "Jokes Finder & Humor",
      desc: "Get hilarious setups and punchlines from Official Joke API",
      endpoint: "https://official-joke-api.appspot.com/jokes/search?term=",
      placeholder: "Search jokes (e.g. programmer, chicken, why)...",
      fetchUrl: (query) => `https://official-joke-api.appspot.com/jokes/search?term=${query}`,
      parseData: (data) => Array.isArray(data) ? data : [],
      renderCard: (joke) => `
        <div class="card-item" data-id="${joke.id}">
          <div class="card-body">
            <div class="card-id-badge" style="position: static; width: fit-content; margin-bottom: 12px;">ID: ${joke.id}</div>
            <h3 class="card-title" style="font-size: 16px; font-weight: 500; line-height: 1.5; color: var(--text-secondary);">${joke.setup}</h3>
            <div class="card-actions" style="margin-top: 20px;">
              <button class="btn btn-primary view-details-btn"><i class="fas fa-laugh-beam"></i> Reveal Punchline</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (joke) => `
        <div class="modal-header-section">
          <div style="width: 80px; height: 80px; border-radius: 16px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); display: flex; align-items: center; justify-content: center; font-size: 36px; color: #fff; margin-right: 12px;">
            <i class="fas fa-laugh-squint"></i>
          </div>
          <div class="modal-header-info">
            <h2 class="modal-title">Joke ID: ${joke.id}</h2>
            <span class="modal-badge">${joke.type} Category</span>
          </div>
        </div>
        <div class="modal-desc-section" style="text-align: center; padding: 20px 0;">
          <p style="font-size: 18px; color: var(--text-primary); font-weight: 500; margin-bottom: 20px;">${joke.setup}</p>
          <div style="display: inline-block; padding: 15px 30px; background-color: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-green); border-radius: 12px; color: var(--accent-green); font-size: 20px; font-weight: 700;">
            ${joke.punchline}
          </div>
        </div>
      `
    },
    quotes: {
      title: "Famous Quotes Finder",
      desc: "Browse quotes, proverbs, and philosophical citations via DummyJSON",
      endpoint: "https://dummyjson.com/quotes/search?q=",
      placeholder: "Search quotes (e.g. life, wisdom, love)...",
      fetchUrl: (query) => `https://dummyjson.com/quotes/search?q=${query}`,
      parseData: (data) => data.quotes || [],
      renderCard: (quote) => `
        <div class="card-item" data-id="${quote.id}">
          <div class="card-body">
            <div class="card-id-badge" style="position: static; width: fit-content; margin-bottom: 12px;">Quote ID: ${quote.id}</div>
            <p class="card-desc" style="font-size: 15px; font-style: italic; color: var(--text-primary); line-height: 1.6; margin-bottom: 16px;">"${quote.quote}"</p>
            <p class="card-subtitle" style="margin-top: auto;"><i class="fas fa-user-edit"></i> — ${quote.author}</p>
          </div>
        </div>
      `,
      renderDetails: () => ``
    },
    developers: {
      title: "Developer & Team Finder",
      desc: "Locate developer cards, contacts, and job status using DummyJSON users search",
      endpoint: "https://dummyjson.com/users/search?q=",
      placeholder: "Search profiles (e.g. John, Smith, engineer)...",
      fetchUrl: (query) => `https://dummyjson.com/users/search?q=${query}`,
      parseData: (data) => data.users || [],
      renderCard: (user) => `
        <div class="card-item" data-id="${user.id}">
          <div class="card-header-img">
            <img src="${user.image}" alt="${user.firstName}" style="object-fit: contain; padding: 10px; background: rgba(0,0,0,0.2);">
            <span class="card-tag">${user.company?.title || 'Developer'}</span>
            <span class="card-id-badge">ID: ${user.id}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${user.firstName} ${user.lastName}</h3>
            <p class="card-subtitle"><i class="fas fa-building"></i> ${user.company?.name || 'Independent'}</p>
            <p class="card-desc">Age: ${user.age}<br>Email: ${user.email}<br>Phone: ${user.phone}</p>
            <div class="card-actions">
              <button class="btn btn-primary view-details-btn"><i class="fas fa-address-card"></i> Contact Card</button>
            </div>
          </div>
        </div>
      `,
      renderDetails: (user) => `
        <div class="modal-header-section">
          <img src="${user.image}" alt="${user.firstName}" class="modal-poster" style="object-fit: contain; background: #000; padding: 10px;">
          <div class="modal-header-info">
            <h2 class="modal-title">${user.firstName} ${user.lastName}</h2>
            <div class="modal-badges">
              <span class="modal-badge id">User ID: ${user.id}</span>
              <span class="modal-badge">Age: ${user.age}</span>
              <span class="modal-badge">${user.gender}</span>
            </div>
          </div>
        </div>
        <div class="modal-details-grid">
          <div class="detail-field">
            <span class="detail-field-label">Job Title</span>
            <span class="detail-field-val">${user.company?.title || 'N/A'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Department</span>
            <span class="detail-field-val">${user.company?.department || 'N/A'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Company Name</span>
            <span class="detail-field-val">${user.company?.name || 'N/A'}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Email Connection</span>
            <span class="detail-field-val"><a href="mailto:${user.email}">${user.email}</a></span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Phone</span>
            <span class="detail-field-val">${user.phone}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">IP Address</span>
            <span class="detail-field-val">${user.ip || 'N/A'}</span>
          </div>
        </div>
      `
    }
  };

  // Helper function to extract ingredients from a meal or cocktail object
  function getIngredientsList(obj) {
    let list = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = obj[`strIngredient${i}`];
      if (ingredient && ingredient.trim() !== "") {
        const measure = obj[`strMeasure${i}`] ? obj[`strMeasure${i}`] : "";
        list += `<li>${measure} ${ingredient}</li>`;
      } else {
        break;
      }
    }
    return list || "<li>No specific ingredients detailed.</li>";
  }

  // Load active Category Channel
  function loadCategory(categoryKey) {
    currentCategory = categoryKey;
    const config = categoryConfigs[categoryKey];

    // Update headings
    activeCategoryTitle.textContent = config.title;
    activeCategoryDesc.textContent = config.desc;
    searchInput.placeholder = config.placeholder;
    apiEndpointUrl.textContent = config.endpoint;

    // Reset layout panel states
    resultsGrid.classList.remove("hidden");
    gamingSandbox.classList.add("hidden");
    aiAgentSandbox.classList.add("hidden");

    // Clear grid
    resultsGrid.innerHTML = `
      <div class="info-prompt-state">
        <i class="fas fa-search-plus"></i>
        <h2>Search ${config.title}</h2>
        <p>Type in the query box above to discover elements using our Unified Search interface.</p>
      </div>
    `;

    // Clear search box
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    recordsCountBadge.textContent = "0";

    // Set active class in navigation
    navItems.forEach(item => {
      if (item.getAttribute("data-category") === categoryKey) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Close any playing audio on page change
    stopAudioTrack();

    // Specific category default triggers
    if (categoryKey === "ai-agents") {
      displayAIAgents(aiAgentsData);
    } else if (categoryKey === "games") {
      displayGames(onlineGamesData);
    }
  }

  // Set up navigation listeners
  sidebarNav.addEventListener("click", (e) => {
    const item = e.target.closest(".nav-item");
    if (!item) return;
    const category = item.getAttribute("data-category");
    loadCategory(category);
    
    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
      sidebar.classList.remove("active");
    }
  });

  // Mobile menu toggle
  mobileToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Clear search controls
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim().length > 0) {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
    }
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    searchInput.focus();
  });

  // Render Skeletons Loader
  function renderSkeletons() {
    resultsGrid.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      resultsGrid.innerHTML += `
        <div class="skeleton-card">
          <div class="skeleton-box skeleton-header"></div>
          <div class="skeleton-box skeleton-title"></div>
          <div class="skeleton-box skeleton-line"></div>
          <div class="skeleton-box skeleton-line-short"></div>
          <div class="skeleton-box skeleton-footer"></div>
        </div>
      `;
    }
  }

  // Query Execution Hub
  async function performSearch(query) {
    if (!query) {
      recordsCountBadge.textContent = "0";
      resultsGrid.innerHTML = `
        <div class="info-prompt-state">
          <i class="fas fa-info-circle"></i>
          <h2>Input Search Term</h2>
          <p>Please enter a keyword in the box above to fetch record updates.</p>
        </div>
      `;
      return;
    }

    const config = categoryConfigs[currentCategory];
    renderSkeletons();
    
    // Update Meta status
    apiStatusBadge.textContent = "Searching...";
    apiStatusBadge.className = "status-badge searching";

    try {
      let data;
      if (typeof config.fetchUrl === "function") {
        // Fetch from network API
        const url = config.fetchUrl(query);
        apiEndpointUrl.textContent = url;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        data = await res.json();
      } else {
        // Mock DB custom resolve
        data = await config.fetchUrl(query);
      }

      const parsedResults = config.parseData(data);
      activeResults = parsedResults;
      recordsCountBadge.textContent = parsedResults.length;

      // Reset Meta status
      apiStatusBadge.textContent = "Connected";
      apiStatusBadge.className = "status-badge connected";

      if (parsedResults.length === 0) {
        resultsGrid.innerHTML = `
          <div class="info-prompt-state">
            <i class="fas fa-exclamation-triangle" style="color: var(--accent-orange);"></i>
            <h2>No Records Discovered</h2>
            <p>Could not locate any matching items for "${query}". Try alternative queries.</p>
          </div>
        `;
        return;
      }

      // Render Cards
      resultsGrid.innerHTML = "";
      parsedResults.forEach((item, index) => {
        resultsGrid.innerHTML += config.renderCard(item, index);
      });

      // Bind events to rendered buttons
      bindCardEvents();

    } catch (error) {
      console.error("Search Engine Fetch Error:", error);
      apiStatusBadge.textContent = "Error";
      apiStatusBadge.className = "status-badge";
      recordsCountBadge.textContent = "0";
      resultsGrid.innerHTML = `
        <div class="info-prompt-state">
          <i class="fas fa-times-circle" style="color: var(--accent-red);"></i>
          <h2>Network Query Failed</h2>
          <p>Could not retrieve data from the public endpoint. Ensure CORS permissions allow queries or check connection.<br><small>${error.message}</small></p>
        </div>
      `;
    }
  }

  // Handle Search Submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    performSearch(query);
  });

  // Bind actions inside grid cards
  function bindCardEvents() {
    // Info details button
    const viewButtons = resultsGrid.querySelectorAll(".view-details-btn");
    viewButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const item = activeResults[index];
        openDetailsPopup(item);
      });
    });

    // Play music track previews
    const playTrackBtns = resultsGrid.querySelectorAll(".play-track-btn");
    playTrackBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(btn.getAttribute("data-index"));
        playAudioTrack(index);
      });
    });

    // Inline Play retro game button
    const startArcadeBtn = resultsGrid.querySelector(".start-arcade-btn");
    if (startArcadeBtn) {
      startArcadeBtn.addEventListener("click", () => {
        launchRetroArcade();
      });
    }

    // Load AI Agent Terminal button
    const runSimBtns = resultsGrid.querySelectorAll(".run-sim-btn");
    runSimBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const agentId = btn.getAttribute("data-agent-id");
        selectedAgentId = agentId;
        launchAITerminal(agentId);
      });
    });
  }

  // Open Details Modal
  function openDetailsPopup(item) {
    const config = categoryConfigs[currentCategory];
    const html = config.renderDetails(item);
    if (!html) return; // Simple items don't have popups
    
    modalBodyContent.innerHTML = html;
    detailModal.classList.add("active");
  }

  modalCloseBtn.addEventListener("click", () => {
    detailModal.classList.remove("active");
  });

  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove("active");
    }
  });

  // Category Initial Displays (For offline catalogs like games and agents)
  function displayGames(games) {
    resultsGrid.innerHTML = "";
    activeResults = games;
    recordsCountBadge.textContent = games.length;
    games.forEach((game, index) => {
      resultsGrid.innerHTML += categoryConfigs.games.renderCard(game, index);
    });
    bindCardEvents();
  }

  function displayAIAgents(agents) {
    resultsGrid.innerHTML = "";
    activeResults = agents;
    recordsCountBadge.textContent = agents.length;
    agents.forEach((agent, index) => {
      resultsGrid.innerHTML += categoryConfigs["ai-agents"].renderCard(agent, index);
    });
    bindCardEvents();
  }

  // ==========================================
  // FLOATING ITUNES AUDIO PLAYER CONTROLS
  // ==========================================
  function playAudioTrack(index) {
    if (currentCategory !== "music" || !activeResults[index]) return;
    
    const track = activeResults[index];
    currentTrackIndex = index;

    // Load track sources
    globalAudio.src = track.previewUrl;
    playerArt.src = track.artworkUrl100;
    playerTitle.textContent = track.trackName;
    playerArtist.textContent = track.artistName;

    // Show floating player
    globalPlayer.classList.remove("hidden");

    // Audio Play
    globalAudio.play();
    isPlaying = true;
    updateAudioUIState();
  }

  function stopAudioTrack() {
    globalAudio.pause();
    globalAudio.src = "";
    isPlaying = false;
    globalPlayer.classList.add("hidden");
  }

  playerPlayBtn.addEventListener("click", () => {
    if (isPlaying) {
      globalAudio.pause();
      isPlaying = false;
    } else {
      globalAudio.play();
      isPlaying = true;
    }
    updateAudioUIState();
  });

  playerPrevBtn.addEventListener("click", () => {
    if (currentTrackIndex > 0) {
      playAudioTrack(currentTrackIndex - 1);
    }
  });

  playerNextBtn.addEventListener("click", () => {
    if (currentTrackIndex < activeResults.length - 1) {
      playAudioTrack(currentTrackIndex + 1);
    }
  });

  globalAudio.addEventListener("timeupdate", () => {
    if (!globalAudio.duration) return;
    const progress = (globalAudio.currentTime / globalAudio.duration) * 100;
    progressFill.style.width = `${progress}%`;
  });

  globalAudio.addEventListener("ended", () => {
    // Auto-advance track
    if (currentTrackIndex < activeResults.length - 1) {
      playAudioTrack(currentTrackIndex + 1);
    } else {
      stopAudioTrack();
    }
  });

  progressBg.addEventListener("click", (e) => {
    if (!globalAudio.duration) return;
    const rect = progressBg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = globalAudio.duration;
    globalAudio.currentTime = (clickX / width) * duration;
  });

  function updateAudioUIState() {
    if (isPlaying) {
      playerPlayBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    } else {
      playerPlayBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }
  }


  // ==========================================
  // RETRO SNAKE ARCADE GAME SANDBOX
  // ==========================================
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const startBtn = document.getElementById("start-game-btn");
  const scoreDisplay = document.getElementById("game-score");
  const highScoreDisplay = document.getElementById("game-high-score");

  let snake = [];
  let food = {};
  let dx = 20;
  let dy = 0;
  let score = 0;
  let highScore = localStorage.getItem("snakeHighScore") || 0;
  let gameInterval;
  let isGameRunning = false;
  const gridScale = 20;

  if (highScoreDisplay) highScoreDisplay.textContent = highScore;

  function launchRetroArcade() {
    resultsGrid.classList.add("hidden");
    gamingSandbox.classList.remove("hidden");
    resetSnakeGame();
  }

  function resetSnakeGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    snake = [
      { x: 160, y: 200 },
      { x: 140, y: 200 },
      { x: 120, y: 200 }
    ];
    dx = 20;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    generateFood();
    drawGame();
  }

  function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    gameInterval = setInterval(updateSnake, 100);
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      resetSnakeGame();
      startGame();
    });
  }

  function generateFood() {
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridScale)) * gridScale,
      y: Math.floor(Math.random() * (canvas.height / gridScale)) * gridScale
    };
    // Ensure food doesn't spawn on snake body
    snake.forEach(part => {
      const hasEaten = part.x === food.x && part.y === food.y;
      if (hasEaten) generateFood();
    });
  }

  function updateSnake() {
    if (checkCollision()) {
      endSnakeGame();
      return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const hasEaten = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEaten) {
      score += 10;
      scoreDisplay.textContent = score;
      if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem("snakeHighScore", highScore);
      }
      generateFood();
    } else {
      snake.pop();
    }

    drawGame();
  }

  function checkCollision() {
    const head = snake[0];
    // Wall collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      return true;
    }
    // Body collisions
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }

  function drawGame() {
    if (!ctx) return;
    // Clear canvas
    ctx.fillStyle = "#05070a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid overlay lines (subtle)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    for (let i = 0; i < canvas.width; i += gridScale) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? "#a78bfa" : "#8b5cf6";
      ctx.strokeStyle = "#05070a";
      ctx.lineWidth = 2;
      ctx.fillRect(part.x, part.y, gridScale, gridScale);
      ctx.strokeRect(part.x, part.y, gridScale, gridScale);
    });

    // Draw food
    ctx.fillStyle = "#10b981";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#10b981";
    ctx.fillRect(food.x, food.y, gridScale, gridScale);
    ctx.shadowBlur = 0; // reset shadow
  }

  function endSnakeGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#f43f5e";
    ctx.font = "24px 'Outfit'";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = "#fff";
    ctx.font = "16px 'Outfit'";
    ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText("Click 'Start Game' to play again!", canvas.width / 2, canvas.height / 2 + 40);
  }

  // Keyboard navigation for Snake
  document.addEventListener("keydown", (e) => {
    if (!isGameRunning) return;
    const keyPressed = e.key.toLowerCase();
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if ((keyPressed === "arrowleft" || keyPressed === "a") && !goingRight) {
      dx = -20;
      dy = 0;
    }
    if ((keyPressed === "arrowright" || keyPressed === "d") && !goingLeft) {
      dx = 20;
      dy = 0;
    }
    if ((keyPressed === "arrowup" || keyPressed === "w") && !goingDown) {
      dx = 0;
      dy = -20;
    }
    if ((keyPressed === "arrowdown" || keyPressed === "s") && !goingUp) {
      dx = 0;
      dy = 20;
    }
  });


  // ==========================================
  // AI AGENTS CONSOLE WORKSPACE SIMULATOR
  // ==========================================
  const terminalOutput = document.getElementById("terminal-output");
  const terminalInput = document.getElementById("terminal-input");
  const sendTerminalBtn = document.getElementById("send-terminal-btn");

  function launchAITerminal(agentId) {
    resultsGrid.classList.add("hidden");
    aiAgentSandbox.classList.remove("hidden");

    const agent = aiAgentsData.find(a => a.id === agentId);
    if (!agent) return;

    // Reset status indicators on agents data
    aiAgentsData.forEach(a => {
      a.status = a.id === agentId ? "running" : "idle";
    });

    terminalOutput.innerHTML = `
      <div class="term-line system">Successfully established connection stream to Agent: [${agent.name}].</div>
      <div class="term-line system">Version: ${agent.version} | Developer: ${agent.developer}</div>
      <div class="term-line system">System capabilities loaded: ${agent.capabilities}.</div>
      <div class="term-line prompt">${agent.name} is ready. Type in terminal command prompts...</div>
    `;

    // Redraw AI agent cards behind in grid (if active query results are present)
    displayAIAgents(aiAgentsData);
  }

  function handleTerminalSubmit() {
    const input = terminalInput.value.trim();
    if (!input) return;

    const agent = aiAgentsData.find(a => a.id === selectedAgentId) || aiAgentsData[0];

    // Log user input
    terminalOutput.innerHTML += `
      <div class="term-line user">&gt; ${input}</div>
    `;

    terminalInput.value = "";
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    // Trigger streaming mock command responses
    simulateAgentTasks(agent, input);
  }

  if (sendTerminalBtn) {
    sendTerminalBtn.addEventListener("click", handleTerminalSubmit);
  }
  if (terminalInput) {
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleTerminalSubmit();
    });
  }

  function simulateAgentTasks(agent, query) {
    const commandLines = [
      `[${agent.name}] Parsing prompt objectives...`,
      `[${agent.name}] Initializing workspace indexing tree.`,
      `[${agent.name}] Scanning project directory: files found: [index.htm, style.css, script.js]`,
      `[${agent.name}] Analyzing task parameters for: "${query}"`,
      `[${agent.name}] Proposing sandboxed action steps to run validation tests.`,
      `[${agent.name}] Applying dynamic execution plans. System resources: OK.`,
      `[${agent.name}] Executing dry run compilation... Compiled.`,
      `[${agent.name}] Successfully completed command objectives. Returning output summary:`
    ];

    let stepIndex = 0;
    agent.status = "thinking";
    displayAIAgents(aiAgentsData);

    const interval = setInterval(() => {
      if (stepIndex < commandLines.length) {
        // Stream logging step
        let prefix = "system";
        if (stepIndex === 3) prefix = "prompt";
        if (stepIndex === 6) prefix = "";
        
        terminalOutput.innerHTML += `
          <div class="term-line ${prefix}">${commandLines[stepIndex]}</div>
        `;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        stepIndex++;
      } else {
        // Complete logs stream
        clearInterval(interval);
        agent.status = "idle";
        displayAIAgents(aiAgentsData);

        // Generate response based on prompt
        const randomAnswers = [
          `Simulation complete. Verification plan completed with 0 errors. App components are stable.`,
          `Task executed. Successfully fetched metadata structures. Found matching key fields in workspace.`,
          `Process finished with exit code 0. No lint vulnerabilities discovered during repository scanning.`,
          `Completed system checks. All third-party endpoints responded with code 200 (Success).`
        ];
        const ans = randomAnswers[Math.floor(Math.random() * randomAnswers.length)];
        
        terminalOutput.innerHTML += `
          <div class="term-line prompt" style="color: var(--accent-green); font-weight: bold;">[Agent Response] &gt;&gt; ${ans}</div>
          <div class="term-line system">Waiting for next command inputs...</div>
        `;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    }, 900);
  }

  // Load the initial category
  loadCategory("recipes");
});
