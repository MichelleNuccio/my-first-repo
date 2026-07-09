// Central content file for the website.
// Edit this file when you want to change the CV text or the archive project cards.
window.PortfolioData = {
  // Lines typed on the old computer screen during the CV print animation.
  cvLines: [
    "CURRICULUM VITAE",
    "",
    "NOME: Il tuo nome",
    "RUOLO: Creative technologist / designer",
    "LOCATION: Italia",
    "",
    "SKILLS",
    "P5.js, interaction design, prototyping,",
    "motion graphics, data visualization,",
    "HTML, CSS, JavaScript.",
    "",
    "ESPERIENZE",
    "2025 - oggi  Progetti visuali interattivi",
    "2023 - 2025  Design e sviluppo creativo",
    "2021 - 2023  Comunicazione digitale",
    "",
    "FORMAZIONE",
    "Design / media / tecnologia",
    "",
    "CONTATTI",
    "email@example.com",
    "portfolio.example.com"
  ],

  // Portfolio projects shown inside the 3D archive and in the bottom timeline.
  // Each object controls one card: id, title, type, collaborators, year, visual label, description, and optional page link.
  projects: [
    {
      id: "#05",
      title: "Project Placeholder",
      type: "Future project",
      collaborators: "to be added",
      year: "TBA",
      imageLabel: "P05",
      description: "Placeholder for a future project. Replace this entry with title, year, collaborators, images and description."
    },
    {
      id: "#04",
      title: "Project Placeholder",
      type: "Future project",
      collaborators: "to be added",
      year: "TBA",
      imageLabel: "P04",
      description: "Placeholder for a future project. Replace this entry with title, year, collaborators, images and description."
    },
    {
      id: "#03",
      title: "Those Flowers are for you <3",
      type: "3D spatial canvas / interactive studies",
      collaborators: "",
      year: "2026",
      imageLabel: "FLOWERS",
      url: "spatial-canvas.html",
      description: "A collection of four canvas studies: a luminous 3D bouquet, an interactive petal-plucking flower, and two glowing 2D floral drawings."
    },
    {
      id: "#02",
      title: "Ec(h)oes in the Rings",
      type: "Site-specific installation / Bolzano Art Week",
      collaborators: "with Riccardo Molteni",
      year: "2025",
      imageLabel: "ECHO",
      image: "assets/GH_03-B.png",
      description: "Developed for the 5th edition of Bolzano Art Week, the project explores the Ginkgo biloba as both a living archive and a community landmark, revealing its hidden internal structure and reinterpreting it as a work of art."
    },
    {
      id: "#01",
      title: "Mare Debole",
      type: "Italian Pavilion / La Biennale di Venezia",
      collaborators: "with Riccardo Molteni, Maddalena Adriano, Gaia Lucchina",
      year: "2025",
      imageLabel: "MARE",
      image: "assets/mare-debole.jpg",
      imagePosition: "center 50%",
      description: "Created for the Italian Pavilion at the 19th International Architecture Exhibition, the project critically explores the relationship between humans and the sea, questioning the shift from fear to exploitation."
    },
    {
      id: "#00",
      title: "Left(L)overs",
      type: "Master's thesis",
      collaborators: "with Riccardo Molteni",
      year: "2025",
      imageLabel: "LEFT",
      image: "assets/left-lovers.jpg",
      imagePosition: "center 50%",
      description: "A master's thesis investigating waste as a contemporary mine, rethinking discarded materials as active agents in shaping new ecological and spatial futures."
    }
  ]
};
