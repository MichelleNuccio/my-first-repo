// CSS-based 3D archive.
// This module builds the portfolio space when the user clicks "Click to Enter".
window.Archive3D = (() => {
  // Shared state for the archive overlay: DOM elements, project data, and navigation position.
  let container;
  let scene;
  let timeline;
  let projects = [];
  let activeIndex = 0;
  let targetDepth = 0;
  let pointerOffset = 0;

  // Opens the archive overlay, creates its HTML, and attaches navigation events.
  function open(projectList) {
    projects = projectList;
    activeIndex = 0;
    targetDepth = 0;
    pointerOffset = 0;

    container = document.getElementById("archive-3d");
    container.classList.add("is-open");
    container.innerHTML = `
      <button class="archive-close" type="button" aria-label="Close archive">X</button>
      <div class="archive-hud">
        <strong>MICHELLE NUCCIO / ARCHIVE</strong>
        <span>wheel to scroll files - use timeline to jump - click close to return</span>
      </div>
      <div class="archive-perspective">
        <div class="archive-scene"></div>
      </div>
      <nav class="archive-timeline" aria-label="Portfolio timeline"></nav>
    `;

    scene = container.querySelector(".archive-scene");
    timeline = container.querySelector(".archive-timeline");
    container.querySelector(".archive-close").addEventListener("click", close);
    buildArchive();
    buildTimeline();
    updateArchive();

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
  }

  // Builds the 3D scene: a grid floor, a central index block, and one card for each project.
  function buildArchive() {
    scene.innerHTML = `
      <div class="archive-grid-floor"></div>
      <div class="archive-core">PORTFOLIO<br>INDEX</div>
    `;

    projects.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "archive-project-card";
      card.dataset.index = index;
      card.innerHTML = `
        <div class="archive-project-image"><span>${project.imageLabel || project.id}</span></div>
        <div class="archive-project-meta">
          <span>${project.id} ${project.title}</span>
          <small>${project.year}</small>
        </div>
        <h2>${project.id}${project.title}</h2>
        <h3>${project.type}</h3>
        <p class="archive-project-collaborators">${project.collaborators || ""}</p>
        <p>${project.description}</p>
      `;
      card.addEventListener("click", () => openProject(index));
      scene.appendChild(card);
    });
  }

  // Builds the bottom timeline so the user can jump directly to a specific project.
  function buildTimeline() {
    timeline.innerHTML = projects.map((project, index) => `
      <button type="button" data-index="${index}">
        <span>${project.id}</span>
        <strong>${project.title}</strong>
      </button>
    `).join("");

    timeline.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => setActiveIndex(Number(button.dataset.index)));
    });
  }

  // Updates which project is active while keeping the index inside the project list limits.
  function setActiveIndex(index) {
    activeIndex = Math.max(0, Math.min(projects.length - 1, index));
    updateArchive();
  }

  // Opens a linked project page when the active card is clicked.
  // If the card is not active yet, the first click brings it forward.
  function openProject(index) {
    if (index !== activeIndex) {
      setActiveIndex(index);
      return;
    }

    const project = projects[index];
    if (project && project.url) {
      window.location.href = project.url;
    }
  }

  // Repositions all cards in 3D space according to the active project.
  // The active card moves forward, while the other cards slide sideways and backward.
  function updateArchive() {
    const cards = Array.from(scene.querySelectorAll(".archive-project-card"));
    cards.forEach((card, index) => {
      const offset = index - activeIndex;
      const absOffset = Math.abs(offset);
      card.classList.toggle("is-active", index === activeIndex);
      card.style.opacity = String(Math.max(0.16, 1 - absOffset * 0.22));
      card.style.zIndex = String(100 - absOffset);
      card.style.transform = `
        translateX(${offset * 300}px)
        translateY(${absOffset * 18}px)
        translateZ(${260 - absOffset * 115 + targetDepth}px)
        rotateY(${offset * -22 + pointerOffset}deg)
      `;
    });

    timeline.querySelectorAll("button").forEach((button, index) => {
      button.classList.toggle("is-active", index === activeIndex);
    });
  }

  // Slightly tilts the archive based on the pointer position, giving the scene a responsive 3D feel.
  function onPointerMove(event) {
    pointerOffset = (event.clientX / window.innerWidth - 0.5) * 10;
    updateArchive();
  }

  // Uses the mouse wheel or trackpad to move through the project cards.
  function onWheel(event) {
    if (Math.abs(event.deltaY) < 8) return;
    setActiveIndex(activeIndex + (event.deltaY > 0 ? 1 : -1));
  }

  // Lets the keyboard arrows navigate the archive for faster browsing.
  function onKeyDown(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      setActiveIndex(activeIndex + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      setActiveIndex(activeIndex - 1);
    }
  }

  // Closes the archive and removes event listeners so the landing page stays clean.
  function close() {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKeyDown);
    container.classList.remove("is-open");
    container.innerHTML = "";
    scene = null;
    timeline = null;
  }

  // Exposes only the public actions needed by the rest of the website.
  return { open, close };
})();
