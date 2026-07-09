// Small bridge object used by the P5 sketch.
// Keeping these actions here makes the sketch call simple commands instead of knowing every detail.
window.App = {
  // Opens the navigable archive overlay and passes it the project list.
  enterArchive() {
    window.Archive3D.open(window.PortfolioData.projects);
  },

  // Starts the real CV PDF download.
  downloadCv() {
    window.CurriculumPdf.download();
  }
};

// Marks the page as loaded, useful if you ever want CSS or tests to detect app readiness.
document.documentElement.dataset.appLoaded = "true";
