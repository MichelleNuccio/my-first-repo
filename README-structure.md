# Project Structure

```txt
print-your-data.html
styles.css
js/
  portfolio-data.js
  sketch-2d.js
  archive-3d.js
  pdf-utils.js
  app.js
```

## Files

`print-your-data.html`
Loads the page, P5.js, and all local scripts.

`styles.css`
Controls the base page style and the full-screen 3D archive overlay.

`js/portfolio-data.js`
Edit this file to change the CV text and portfolio project entries.
Each project can use an `id` like `#01`, a `title`, and an `imageLabel` placeholder.
Later you can replace the placeholder with real image paths.

`js/sketch-2d.js`
Draws the fuchsia wireframe desktop scene with P5.js.

`js/archive-3d.js`
Draws the navigable CSS 3D portfolio archive.
Mouse wheel and arrow keys move through projects; the bottom timeline jumps directly to a project.

`js/pdf-utils.js`
Downloads the real CV file from `assets/michelle-nuccio-cv.pdf`.

`js/app.js`
Coordinates actions between the 2D scene, PDF download, and 3D archive.
