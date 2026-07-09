// Handles the CV download.
// The animation finishes inside the P5 sketch, then calls this helper through window.App.
window.CurriculumPdf = {
  // Creates a temporary hidden link, clicks it, and removes it after the browser starts the download.
  download() {
    const link = document.createElement("a");
    link.href = "assets/michelle-nuccio-cv.pdf";
    link.download = "Michelle Nuccio CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
