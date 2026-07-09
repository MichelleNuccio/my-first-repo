// CV source text imported from the shared data file.
const cvLines = window.PortfolioData.cvLines;                                                       // 'const' means this value should not be replaced; here it gets the CV text lines.

// Variables that store the animation state: typed text progress, screen effects, glitch variation, and printer movement.
let typedText = "";                                                                                 // 'let' means this can change; this stores the letters already typed on screen.
let fullText = "";                                                                                  // This will store the full CV text before the typing animation starts.
let currentChar = 0;                                                                                // This counts which letter the typing animation has reached.
let scanOffset = 0;                                                                                 // This moves the scan lines so the screen feels alive.
let noiseSeedValue = 0;                                                                             // This helps the glitch effect look random but controlled.
let printPulse = 0;                                                                                 // This moves the printer animation from 0 to 1.
let animationStarted = false;                                                                       // This remembers if the user clicked to start printing.
let pdfDownloaded = false;                                                                          // This remembers if the PDF was already downloaded.
let copyButtonBounds = null;                                                                        // This remembers where the PRINT button is, so clicks can be detected.
let archiveWindowBounds = null;                                                                     // This remembers where the archive window is, so clicks can be detected.
let profileImage;                                                                                   // This will hold Michelle's profile picture after it loads.

// Main color palette for the neon wireframe interface.
// The names still say "Blue" from an earlier version, but the RGB values now create the fuchsia look.
const neonBlue = [255, 0, 190];                                                                     // This saves the main neon pink color as RGB numbers.
const deepBlue = [92, 0, 78];                                                                       // This saves a darker color used for shadows.
const softBlue = [255, 110, 230];                                                                   // This saves a softer pink color used for readable text.

// Introduction text drawn inside the ABOUT_ME.txt window on the landing page.
const introText = [                                                                                 // 'introText' is the list of sentences shown in the ABOUT ME window.
  "I'm Michelle, an architect, researcher and computational designer with a curiosity for everything that happens between architecture, code and philosophy.", // This is one sentence of text shown on the page.
  "",                                                                                               // This is one sentence of text shown on the page.
  "I love experimenting with generative design, creative coding and interactive media, turning data, algorithms and abstract concepts into visual experiences. My research is inspired by post-humanist thinking, ecological systems and the invisible relationships that shape the spaces we live in.", // This is one sentence of text shown on the page.
  "",                                                                                               // This is one sentence of text shown on the page.
  "This website is my collection of experiments, prototypes and ongoing explorations. Some work, some fail, all teach me something. Have a look around!" // This is one sentence of text shown on the page.
];                                                                                                  // Close this list of things.

// Loads external visual assets before the sketch starts.
function preload() {                                                                                // This runs first, before drawing, so images are ready.
  profileImage = loadImage("assets/michelle-profile.jpeg");                                         // Load the image file so it can be drawn later.
}                                                                                                   // Close this little group of instructions.

// Initializes the P5 canvas, font, and source text before animation starts.
function setup() {                                                                                  // This runs one time at the start to prepare the canvas.
  createCanvas(windowWidth, windowHeight);                                                          // Create the drawing area; 'windowWidth' and 'windowHeight' mean full browser size.
  pixelDensity(1);                                                                                  // Choose sharpness; bigger is clearer but can make animation slower.
  textFont("Courier New");                                                                          // Choose the style of letters used by p5 text.
  fullText = cvLines.join("\n");                                                                    // Glue text pieces together into one text.
  noiseSeedValue = random(1000);                                                                    // Pick a random number.
}                                                                                                   // Close this little group of instructions.

// Main P5 loop: clears the frame, updates animation, and draws the full wireframe scene.
function draw() {                                                                                   // This runs again and again, many times per second, to animate everything.
  background(12, 2, 18);                                                                            // Paint the whole canvas with one color before drawing new things.
  drawBlueprintBackground();                                                                        // Call the helper that draws the big moving background grid.

  const stage = getStage();                                                                         // 'const' makes a named value that the code will use later.
  drawHeaderTitle(stage.computer.x);                                                                // Call the helper that draws the name title at the top.
  drawIntroWindow(stage.introWindow);                                                               // Call the helper that draws the ABOUT ME window.
  drawComputer(stage.computer);                                                                     // Call the helper that draws the computer.
  drawPrinter(stage.printer);                                                                       // Call the helper that draws the printer.
  drawArchiveWindow(stage.archiveWindow);                                                           // Call the helper that draws the archive button window.
  updateText();                                                                                     // Call the helper that advances the typing animation.
  drawScreenContent(stage.screen);                                                                  // Call the helper that draws inside the computer screen.
  drawCable(stage.computer, stage.printer);                                                         // Call the helper that draws the cable.
  drawForegroundParticles();                                                                        // Call the helper that draws tiny glowing dots.
}                                                                                                   // Close this little group of instructions.

// Calculates responsive layout values for the computer, screen, and printer.
function getStage() {                                                                               // This calculates the layout: where each object should be.
  const scaleFactor = min(width / 1010, height / 760)*0.75;                                         // This is the magic size number that makes the drawing fit different screens.
  const computerW = 520 * scaleFactor;                                                              // This is the computer width after it is scaled.
  const computerH = 430 * scaleFactor;                                                              // This is the computer height after it is scaled.
  const printerW = 335 * scaleFactor;                                                               // This is the printer width after it is scaled.
  const baseY = height * 0.86;                                                                      // This is the bottom height where the machines sit.
  const gap = 54 * scaleFactor;                                                                     // This is the empty space between the computer and printer.
  const totalW = computerW + printerW + gap;                                                        // This is the full width of computer plus gap plus printer.
  const startX = (width - totalW) / 2;                                                              // This is where the whole scene starts from the left.

  const computer = {                                                                                // This object remembers the computer position and size.
    x: startX,                                                                                      // 'x' is the left-right position.
    y: baseY - computerH,                                                                           // 'y' is the up-down position.
    w: computerW,                                                                                   // 'w' means width.
    h: computerH,                                                                                   // 'h' means height.
    s: scaleFactor                                                                                  // 's' is the scale number, used to make sizes grow or shrink together.
  };                                                                                                // Close this object or list and finish the sentence.

  const printer = {                                                                                 // This object remembers the printer position and size.
    x: startX + computerW + gap,                                                                    // 'x' is the left-right position.
    y: baseY - 230 * scaleFactor,                                                                   // 'y' is the up-down position.
    w: printerW,                                                                                    // 'w' means width.
    h: 230 * scaleFactor,                                                                           // 'h' means height.
    s: scaleFactor                                                                                  // 's' is the scale number, used to make sizes grow or shrink together.
  };                                                                                                // Close this object or list and finish the sentence.

  const screen = {                                                                                  // This object remembers the monitor screen position and size.
    x: computer.x + 88 * scaleFactor,                                                               // 'x' is the left-right position.
    y: computer.y + 72 * scaleFactor,                                                               // 'y' is the up-down position.
    w: 344 * scaleFactor,                                                                           // 'w' means width.
    h: 206 * scaleFactor,                                                                           // 'h' means height.
    s: scaleFactor                                                                                  // 's' is the scale number, used to make sizes grow or shrink together.
  };                                                                                                // Close this object or list and finish the sentence.

  const archiveWindowW = min(340 * scaleFactor, width - printer.x - 34 * scaleFactor);              // 'const' makes a named value that the code will use later.
  const archiveWindow = {                                                                           // This object remembers the clickable archive window position and size.
    x: printer.x + (printer.w - archiveWindowW) / 2,                                                // 'x' is the left-right position.
    y: max(90 * scaleFactor, printer.y - 128 * scaleFactor),                                        // 'y' is the up-down position.
    w: archiveWindowW,                                                                              // 'w' means width.
    h: 104 * scaleFactor,                                                                           // 'h' means height.
    s: scaleFactor                                                                                  // 's' is the scale number, used to make sizes grow or shrink together.
  };                                                                                                // Close this object or list and finish the sentence.

  const headerBottom = min(width, height) * 0.045 + 58;                                             // 'const' makes a named value that the code will use later.
  const availableIntroTop = headerBottom + 22 * scaleFactor;                                        // 'const' makes a named value that the code will use later.
  const availableIntroBottom = computer.y - 34 * scaleFactor;                                       // 'const' makes a named value that the code will use later.
  const introH = min(250 * scaleFactor, max(178 * scaleFactor, availableIntroBottom - availableIntroTop)); // 'const' makes a named value that the code will use later.
  const introWindow = {                                                                             // This object remembers the ABOUT ME window position and size.
    x: computer.x,                                                                                  // 'x' is the left-right position.
    y: availableIntroTop + max(0, (availableIntroBottom - availableIntroTop - introH) * 0.5),       // 'y' is the up-down position.
    w: min(820 * scaleFactor, width - computer.x - 34 * scaleFactor),                               // 'width' means the current canvas width.
    h: introH,                                                                                      // 'h' means height.
    s: scaleFactor                                                                                  // 's' is the scale number, used to make sizes grow or shrink together.
  };                                                                                                // Close this object or list and finish the sentence.

  return { computer, printer, screen, archiveWindow, introWindow };                                 // 'return' sends this answer back to the place that asked for it.
}                                                                                                   // Close this little group of instructions.

// Advances the typed CV text, scanline motion, and printer completion state.
function updateText() {                                                                             // This updates the typing and printing animation.
  scanOffset = (scanOffset + 0.8) % 8;                                                              // Put this value into a named box so the code can use it.

  if (!animationStarted) {                                                                          // 'if' asks a yes/no question before doing something.
    return;                                                                                         // 'return' stops this function right now.
  }                                                                                                 // Close this little group of instructions.

  if (currentChar < fullText.length) {                                                              // 'if' asks a yes/no question before doing something.
    currentChar += random() < 0.12 ? 4 : 2;                                                         // Pick a random number.
    typedText = fullText.slice(0, currentChar);                                                     // Take only a selected part of the text.
  }                                                                                                 // Close this little group of instructions.

  printPulse = lerp(printPulse, currentChar >= fullText.length ? 1 : 0, 0.025);                     // Move smoothly from one value toward another.

  if (!pdfDownloaded && currentChar >= fullText.length && printPulse > 0.96) {                      // 'if' asks a yes/no question before doing something.
    pdfDownloaded = true;                                                                           // Put this value into a named box so the code can use it.
    downloadCurriculumPdf();                                                                        // Do this step to build the animated page.
  }                                                                                                 // Close this little group of instructions.
}                                                                                                   // Close this little group of instructions.

// Draws the dark technical background with a fuchsia perspective grid.
function drawBlueprintBackground() {                                                                // This draws the moving technical grid in the background.
  noFill();                                                                                         // Make the next shapes hollow inside.
  strokeCap(SQUARE);                                                                                // Choose how the ends of lines look.

  const grid = 44;                                                                                  // 'const' makes a named value that the code will use later.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 18);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1);                                                                                  // Choose how thick the outline line is.
  for (let x = (frameCount * 0.18) % grid; x < width; x += grid) {                                  // 'for' repeats the same drawing action many times.
    line(x, 0, x, height);                                                                          // 'height' means the current canvas height.
  }                                                                                                 // Close this little group of instructions.
  for (let y = (frameCount * 0.12) % grid; y < height; y += grid) {                                 // 'for' repeats the same drawing action many times.
    line(0, y, width, y);                                                                           // 'width' means the current canvas width.
  }                                                                                                 // Close this little group of instructions.

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 70);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  line(0, height * 0.7, width, height * 0.7);                                                       // 'width' means the current canvas width.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 22);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  for (let i = 0; i < 12; i++) {                                                                    // 'for' repeats the same drawing action many times.
    const y = height * 0.7 + i * 22;                                                                // 'const' makes a named value that the code will use later.
    line(width * 0.22 - i * 32, y, width * 0.78 + i * 32, y);                                       // 'width' means the current canvas width.
  }                                                                                                 // Close this little group of instructions.

  drawBlueGlow(width * 0.43, height * 0.44, min(width, height) * 0.56, 12);                         // 'width' means the current canvas width.
}                                                                                                   // Close this little group of instructions.

// Draws a soft fuchsia glow made from translucent ellipses.
function drawBlueGlow(x, y, size, maxAlpha) {                                                       // This draws a soft glowing oval behind the scene.
  noStroke();                                                                                       // Remove the outline from the next shapes.
  const t = frameCount * 0.006;                                                                     // 'const' makes a named value that the code will use later.
  const driftX = sin(t * 0.72) * size * 0.035;                                                      // 'const' makes a named value that the code will use later.
  const driftY = cos(t * 0.58) * size * 0.025;                                                      // 'const' makes a named value that the code will use later.
  const stretchX = 1.22 + sin(t * 0.9) * 0.12;                                                      // 'const' makes a named value that the code will use later.
  const stretchY = 0.72 + cos(t * 0.74) * 0.07;                                                     // 'const' makes a named value that the code will use later.
  const tilt = sin(t * 0.52) * 0.08;                                                                // 'const' makes a named value that the code will use later.

  push();                                                                                           // Save the current drawing settings, like position, color, and rotation.
  translate(x + driftX, y + driftY);                                                                // Move the zero point, like moving the paper under your pencil.
  rotate(tilt);                                                                                     // Turn the drawing direction.
  for (let r = size; r > 0; r -= 34) {                                                              // 'for' repeats the same drawing action many times.
    const a = map(r, 0, size, 0, maxAlpha);                                                         // 'const' makes a named value that the code will use later.
    fill(neonBlue[0], neonBlue[1], neonBlue[2], a);                                                 // Choose the inside color; the last number is transparency.
    ellipse(0, 0, r * stretchX, r * stretchY);                                                      // Draw an oval.
  }                                                                                                 // Close this little group of instructions.
  pop();                                                                                            // Restore the saved drawing settings so the next drawing is not affected.
}                                                                                                   // Close this little group of instructions.

// Draws the portfolio name as a fixed neon interface label in the top-left corner.
function drawHeaderTitle(anchorX) {                                                                 // This draws the MICHELLE NUCCIO title box.
  const marginY = min(width, height) * 0.045;                                                       // 'const' makes a named value that the code will use later.
  const labelW = min(430, width * 0.72);                                                            // 'const' makes a named value that the code will use later.
  const labelH = 58;                                                                                // 'const' makes a named value that the code will use later.

  drawNeonRect(anchorX, marginY, labelW, labelH, 8, 1.2, 145);                                      // Call the helper that draws a glowing rectangle.

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 95);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1);                                                                                  // Choose how thick the outline line is.
  line(anchorX + 18, marginY + labelH - 14, anchorX + labelW - 18, marginY + labelH - 14);          // Draw a straight line between two points.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 245);                                                 // Choose the inside color; the last number is transparency.
  textStyle(BOLD);                                                                                  // Choose if the text is bold or normal.
  textAlign(LEFT, CENTER);                                                                          // Choose where text sits compared to its x and y point.
  textSize(constrain(width * 0.026, 18, 34));                                                       // Choose how big the letters are; multiplying by 's' keeps it responsive.
  text("MICHELLE NUCCIO", anchorX + 20, marginY + labelH * 0.45);                                   // Write words on the canvas.
  textSize(12);                                                                                     // Choose how big the letters are; multiplying by 's' keeps it responsive.
  fill(softBlue[0], softBlue[1], softBlue[2], 120);                                                 // Choose the inside color; the last number is transparency.
  text("ARCHIVE INTERFACE / CV PRINT SYSTEM", anchorX + 22, marginY + labelH - 13);                 // Write words on the canvas.
  textAlign(LEFT, BASELINE);                                                                        // Choose where text sits compared to its x and y point.
}                                                                                                   // Close this little group of instructions.

// Draws a desktop document-style archive window above the printer.
function drawArchiveWindow(win) {                                                                   // This draws the small clickable archive window.
  const s = win.s;                                                                                  // 'const' makes a named value that the code will use later.
  archiveWindowBounds = {                                                                           // Put this value into a named box so the code can use it.
    x: win.x,                                                                                       // 'x' is the left-right position.
    y: win.y,                                                                                       // 'y' is the up-down position.
    w: win.w,                                                                                       // 'w' means width.
    h: win.h                                                                                        // 'h' means height.
  };                                                                                                // Close this object or list and finish the sentence.

  push();                                                                                           // Save the current drawing settings, like position, color, and rotation.
  translate(win.x, win.y);                                                                          // Move the zero point, like moving the paper under your pencil.

  fill(26, 0, 28, 190);                                                                             // Choose the inside color; the last number is transparency.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 190);                                               // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1.4 * s);                                                                            // Choose how thick the outline line is.
  rect(0, 0, win.w, win.h, 8 * s);                                                                  // Draw a rectangle.

  drawNeonRect(0, 0, win.w, win.h, 8 * s, 1.1 * s, 130);                                            // Call the helper that draws a glowing rectangle.

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 125);                                               // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1 * s);                                                                              // Choose how thick the outline line is.
  line(0, 26 * s, win.w, 26 * s);                                                                   // Draw a straight line between two points.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 170);                                                 // Choose the inside color; the last number is transparency.
  circle(14 * s, 13 * s, 6 * s);                                                                    // Draw a circle.
  circle(27 * s, 13 * s, 6 * s);                                                                    // Draw a circle.
  circle(40 * s, 13 * s, 6 * s);                                                                    // Draw a circle.

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 80);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  noFill();                                                                                         // Make the next shapes hollow inside.
  rect(15 * s, 43 * s, 36 * s, 28 * s, 3 * s);                                                      // Draw a rectangle.
  line(23 * s, 51 * s, 43 * s, 51 * s);                                                             // Draw a straight line between two points.
  line(23 * s, 60 * s, 40 * s, 60 * s);                                                             // Draw a straight line between two points.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 235);                                                 // Choose the inside color; the last number is transparency.
  textStyle(BOLD);                                                                                  // Choose if the text is bold or normal.
  textAlign(LEFT, TOP);                                                                             // Choose where text sits compared to its x and y point.
  textSize(14 * s);                                                                                 // Choose how big the letters are; multiplying by 's' keeps it responsive.
  text("Welcome to my Archive,", 65 * s, 42 * s);                                                   // Write words on the canvas.
  textSize(15 * s);                                                                                 // Choose how big the letters are; multiplying by 's' keeps it responsive.
  text("Click to Enter", 65 * s, 61 * s);                                                           // Write words on the canvas.

  fill(softBlue[0], softBlue[1], softBlue[2], 95 + sin(frameCount * 0.08) * 45);                    // Choose the inside color; the last number is transparency.
  textSize(9 * s);                                                                                  // Choose how big the letters are; multiplying by 's' keeps it responsive.
  text("DOCUMENTS / INDEX", 65 * s, 83 * s);                                                        // Write words on the canvas.
  textAlign(LEFT, BASELINE);                                                                        // Choose where text sits compared to its x and y point.

  pop();                                                                                            // Restore the saved drawing settings so the next drawing is not affected.
}                                                                                                   // Close this little group of instructions.

// Draws the left profile/about window with a photo and introductory text.
function drawIntroWindow(win) {                                                                     // This draws the ABOUT ME box with image and text.
  const s = win.s;                                                                                  // 'const' makes a named value that the code will use later.
  push();                                                                                           // Save the current drawing settings, like position, color, and rotation.
  translate(win.x, win.y);                                                                          // Move the zero point, like moving the paper under your pencil.

  fill(24, 0, 27, 185);                                                                             // Choose the inside color; the last number is transparency.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 180);                                               // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1.4 * s);                                                                            // Choose how thick the outline line is.
  rect(0, 0, win.w, win.h, 10 * s);                                                                 // Draw a rectangle.
  drawNeonRect(0, 0, win.w, win.h, 10 * s, 1.1 * s, 125);                                           // Call the helper that draws a glowing rectangle.

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 115);                                               // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1 * s);                                                                              // Choose how thick the outline line is.
  line(0, 28 * s, win.w, 28 * s);                                                                   // Draw a straight line between two points.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 160);                                                 // Choose the inside color; the last number is transparency.
  circle(15 * s, 14 * s, 6 * s);                                                                    // Draw a circle.
  circle(29 * s, 14 * s, 6 * s);                                                                    // Draw a circle.
  circle(43 * s, 14 * s, 6 * s);                                                                    // Draw a circle.

  fill(softBlue[0], softBlue[1], softBlue[2], 185);                                                 // Choose the inside color; the last number is transparency.
  textStyle(BOLD);                                                                                  // Choose if the text is bold or normal.
  textSize(10 * s);                                                                                 // Choose how big the letters are; multiplying by 's' keeps it responsive.
  textAlign(RIGHT, CENTER);                                                                         // Choose where text sits compared to its x and y point.
  text("ABOUT_ME.txt", win.w - 16 * s, 14 * s);                                                     // Write words on the canvas.

  const pad = 18 * s;                                                                               // 'const' makes a named value that the code will use later.
  const contentY = 45 * s;                                                                          // 'const' makes a named value that the code will use later.
  const contentH = win.h - contentY - 20 * s;                                                       // 'const' makes a named value that the code will use later.
  const imageW = min(245 * s, win.w * 0.36);                                                        // 'const' makes a named value that the code will use later.
  drawFramedProfileImage(pad, contentY, imageW, contentH, 5 * s);                                   // Call the helper that draws the photo in its frame.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 235);                                                 // Choose the inside color; the last number is transparency.
  textAlign(LEFT, TOP);                                                                             // Choose where text sits compared to its x and y point.
  const textX = pad + imageW + 22 * s;                                                              // 'const' makes a named value that the code will use later.
  const textY = contentY + 4 * s;                                                                   // 'const' makes a named value that the code will use later.
  const textW = win.w - textX - pad;                                                                // 'const' makes a named value that the code will use later.
  textStyle(NORMAL);                                                                                // Choose if the text is bold or normal.
  textSize(14 * s);                                                                                 // Choose how big the letters are; multiplying by 's' keeps it responsive.
  textLeading(18 * s);                                                                              // Choose the space between text lines; multiplying by 's' keeps it responsive.

  const bodyY = textY;                                                                              // 'const' makes a named value that the code will use later.
  const bodyMaxH = win.h - bodyY - 16 * s;                                                          // 'const' makes a named value that the code will use later.
  drawWrappedParagraphs(introText, textX, bodyY, textW, bodyMaxH, 10.8 * s, 14.4 * s);              // Call the helper that writes the intro text inside the box.

  pop();                                                                                            // Restore the saved drawing settings so the next drawing is not affected.
}                                                                                                   // Close this little group of instructions.

// Draws the profile image inside a neon clipped frame.
function drawFramedProfileImage(x, y, w, h, radius) {                                               // This draws the photo inside a clipped neon frame.
  if (!profileImage) {                                                                              // 'if' asks a yes/no question before doing something.
    return;                                                                                         // 'return' stops this function right now.
  }                                                                                                 // Close this little group of instructions.

  drawingContext.save();                                                                            // Save the browser's deeper drawing state.
  drawingContext.beginPath();                                                                       // Start drawing an invisible shape path.
  drawingContext.roundRect(x, y, w, h, radius);                                                     // Make a rounded rectangle path for clipping.
  drawingContext.clip();                                                                            // Only allow drawing inside the shape we just made.

  const imageRatio = profileImage.width / profileImage.height;                                      // 'const' makes a named value that the code will use later.
  const frameRatio = w / h;                                                                         // 'const' makes a named value that the code will use later.
  let drawW = w;                                                                                    // 'let' creates a named value that is allowed to change.
  let drawH = h;                                                                                    // 'let' creates a named value that is allowed to change.
  let drawX = x;                                                                                    // 'let' creates a named value that is allowed to change.
  let drawY = y;                                                                                    // 'let' creates a named value that is allowed to change.

  if (imageRatio > frameRatio) {                                                                    // 'if' asks a yes/no question before doing something.
    drawH = h;                                                                                      // Put this value into a named box so the code can use it.
    drawW = h * imageRatio;                                                                         // Put this value into a named box so the code can use it.
    drawX = x - (drawW - w) * 0.42;                                                                 // Put this value into a named box so the code can use it.
  } else {                                                                                          // Do this step to build the animated page.
    drawW = w;                                                                                      // Put this value into a named box so the code can use it.
    drawH = w / imageRatio;                                                                         // Put this value into a named box so the code can use it.
    drawY = y - (drawH - h) * 0.35;                                                                 // Put this value into a named box so the code can use it.
  }                                                                                                 // Close this little group of instructions.

  tint(255, 178);                                                                                   // Change image transparency or color while drawing it.
  image(profileImage, drawX, drawY, drawW, drawH);                                                  // Place the loaded picture onto the canvas.
  noTint();                                                                                         // Change image transparency or color while drawing it.
  fill(neonBlue[0], neonBlue[1], neonBlue[2], 34);                                                  // Choose the inside color; the last number is transparency.
  rect(x, y, w, h);                                                                                 // Draw a rectangle.
  drawingContext.restore();                                                                         // Bring back the browser's saved drawing state.

  noFill();                                                                                         // Make the next shapes hollow inside.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 190);                                               // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1.2);                                                                                // Choose how thick the outline line is.
  rect(x, y, w, h, radius);                                                                         // Draw a rectangle.
}                                                                                                   // Close this little group of instructions.

// Writes paragraph text inside a fixed area with simple word wrapping.
function drawWrappedParagraphs(paragraphs, x, y, w, maxH, fontSize, leading) {                      // This draws long text and breaks it into lines that fit.
  textSize(fontSize);                                                                               // Choose how big the letters are; multiplying by 's' keeps it responsive.
  textLeading(leading);                                                                             // Choose the space between text lines; multiplying by 's' keeps it responsive.

  let cursorY = y;                                                                                  // This is the vertical writing position for the next text line.
  const maxChars = max(28, floor(w / (fontSize * 0.62)));                                           // 'const' makes a named value that the code will use later.

  for (const paragraph of paragraphs) {                                                             // 'for' repeats the same drawing action many times.
    if (paragraph === "") {                                                                         // 'if' asks a yes/no question before doing something.
      cursorY += leading * 0.6;                                                                     // Put this value into a named box so the code can use it.
      continue;                                                                                     // Do this step to build the animated page.
    }                                                                                               // Close this little group of instructions.

    const words = paragraph.split(" ");                                                             // 'const' makes a named value that the code will use later.
    let line = "";                                                                                  // This builds one text line before drawing it.

    for (const word of words) {                                                                     // 'for' repeats the same drawing action many times.
      const testLine = line ? line + " " + word : word;                                             // 'const' makes a named value that the code will use later.

      if (testLine.length > maxChars && line !== "") {                                              // 'if' asks a yes/no question before doing something.
        if (cursorY + leading > y + maxH) return;                                                   // 'if' asks a yes/no question before doing something.
        text(line, x, cursorY);                                                                     // Write words on the canvas.
        cursorY += leading;                                                                         // Put this value into a named box so the code can use it.
        line = word;                                                                                // Put this value into a named box so the code can use it.
      } else {                                                                                      // Do this step to build the animated page.
        line = testLine;                                                                            // Put this value into a named box so the code can use it.
      }                                                                                             // Close this little group of instructions.
    }                                                                                               // Close this little group of instructions.

    if (line !== "") {                                                                              // 'if' asks a yes/no question before doing something.
      if (cursorY + leading > y + maxH) return;                                                     // 'if' asks a yes/no question before doing something.
      text(line, x, cursorY);                                                                       // Write words on the canvas.
      cursorY += leading;                                                                           // Put this value into a named box so the code can use it.
    }                                                                                               // Close this little group of instructions.

    cursorY += leading * 0.5;                                                                       // Put this value into a named box so the code can use it.
  }                                                                                                 // Close this little group of instructions.
}                                                                                                   // Close this little group of instructions.

function buildWrappedLines(paragraphs, w, fontSize) {                                               // This starts a reusable recipe of code.
  textSize(fontSize);                                                                               // Choose how big the letters are; multiplying by 's' keeps it responsive.

  const lines = [];                                                                                 // 'const' makes a named value that the code will use later.

  for (const paragraph of paragraphs) {                                                             // 'for' repeats the same drawing action many times.
    if (paragraph === "") {                                                                         // 'if' asks a yes/no question before doing something.
      lines.push("");                                                                               // Add a new item to the end of a list.
      continue;                                                                                     // Do this step to build the animated page.
    }                                                                                               // Close this little group of instructions.

    const words = paragraph.split(" ");                                                             // 'const' makes a named value that the code will use later.
    let line = "";                                                                                  // This builds one text line before drawing it.

    for (const word of words) {                                                                     // 'for' repeats the same drawing action many times.
      const testLine = line ? `${line} ${word}` : word;                                             // 'const' makes a named value that the code will use later.

      if (textWidth(testLine) > w && line) {                                                        // 'if' asks a yes/no question before doing something.
        lines.push(line);                                                                           // Add a new item to the end of a list.
        line = word;                                                                                // Put this value into a named box so the code can use it.
      } else {                                                                                      // Do this step to build the animated page.
        line = testLine;                                                                            // Put this value into a named box so the code can use it.
      }                                                                                             // Close this little group of instructions.
    }                                                                                               // Close this little group of instructions.

    if (line) {                                                                                     // 'if' asks a yes/no question before doing something.
      lines.push(line);                                                                             // Add a new item to the end of a list.
    }                                                                                               // Close this little group of instructions.

    lines.push("");                                                                                 // Add a new item to the end of a list.
  }                                                                                                 // Close this little group of instructions.

  return lines;                                                                                     // 'return' sends this answer back to the place that asked for it.
}                                                                                                   // Close this little group of instructions.

// Draws the retro computer as a luminous wireframe object.
function drawComputer(c) {                                                                          // This draws the retro computer body.
  const s = c.s;                                                                                    // 'const' makes a named value that the code will use later.
  push();                                                                                           // Save the current drawing settings, like position, color, and rotation.
  translate(c.x, c.y);                                                                              // Move the zero point, like moving the paper under your pencil.

  drawWireShadow(c.w * 0.52, c.h * 1.02, c.w * 0.95, 38 * s);                                       // Call the helper that draws the soft machine shadow.

  noFill();                                                                                         // Make the next shapes hollow inside.
  strokeJoin(ROUND);                                                                                // Choose how corners of connected lines look.
  strokeCap(SQUARE);                                                                                // Choose how the ends of lines look.

  drawNeonRect(0, 0, c.w, 338 * s, 20 * s, 2.2 * s, 230);                                           // Call the helper that draws a glowing rectangle.
  drawNeonRect(18 * s, 18 * s, c.w - 36 * s, 302 * s, 13 * s, 1.2 * s, 130);                        // Call the helper that draws a glowing rectangle.
  drawNeonRect(34 * s, 30 * s, c.w - 68 * s, 276 * s, 10 * s, 1 * s, 80);                           // Call the helper that draws a glowing rectangle.
  drawNeonRect(68 * s, 52 * s, 384 * s, 246 * s, 18 * s, 2 * s, 230);                               // Call the helper that draws a glowing rectangle.
  drawNeonRect(88 * s, 72 * s, 344 * s, 206 * s, 9 * s, 1.4 * s, 180);                              // Call the helper that draws a glowing rectangle.
  drawDiagonalPanelLines(68 * s, 52 * s, 384 * s, 246 * s, 18 * s);                                 // Call the helper that draws diagonal panel lines.

  drawNeonRect(58 * s, 338 * s, 405 * s, 45 * s, 10 * s, 1.5 * s, 170);                             // Call the helper that draws a glowing rectangle.
  drawNeonRect(102 * s, 383 * s, 318 * s, 36 * s, 9 * s, 1.3 * s, 150);                             // Call the helper that draws a glowing rectangle.
  drawNeonRect(16 * s, 414 * s, 490 * s, 48 * s, 12 * s, 1.7 * s, 210);                             // Call the helper that draws a glowing rectangle.

  for (let i = 0; i < 18; i++) {                                                                    // 'for' repeats the same drawing action many times.
    const keyAlpha = i % 5 === 0 ? 230 : 120;                                                       // 'const' makes a named value that the code will use later.
    drawNeonRect((46 + i * 24) * s, 427 * s, 16 * s, 10 * s, 2 * s, 0.9 * s, keyAlpha);             // Call the helper that draws a glowing rectangle.
  }                                                                                                 // Close this little group of instructions.

  drawNeonRect(386 * s, 350 * s, 50 * s, 15 * s, 3 * s, 1.2 * s, 140);                              // Call the helper that draws a glowing rectangle.
  drawNeonCircle(466 * s, 360 * s, 18 * s, 1.4 * s, 170);                                           // Call the helper that draws a glowing circle.
  drawNeonCircle(466 * s, 360 * s, 8 * s, 1.8 * s, 170 + sin(frameCount * 0.08) * 70);              // Call the helper that draws a glowing circle.

  pop();                                                                                            // Restore the saved drawing settings so the next drawing is not affected.
}                                                                                                   // Close this little group of instructions.

// Draws all clipped monitor content: fuchsia terminal, glitch, typed CV, and final callout.
function drawScreenContent(screen) {                                                                // This draws the text and button inside the monitor.
  push();                                                                                           // Save the current drawing settings, like position, color, and rotation.
  translate(screen.x, screen.y);                                                                    // Move the zero point, like moving the paper under your pencil.

  drawingContext.save();                                                                            // Save the browser's deeper drawing state.
  drawingContext.beginPath();                                                                       // Start drawing an invisible shape path.
  drawingContext.rect(0, 0, screen.w, screen.h);                                                    // Make a rectangle path for clipping.
  drawingContext.clip();                                                                            // Only allow drawing inside the shape we just made.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(30, 0, 28, 215);                                                                             // Choose the inside color; the last number is transparency.
  rect(0, 0, screen.w, screen.h);                                                                   // Draw a rectangle.

  drawScreenGrid(screen);                                                                           // Do this step to build the animated page.
  drawGlitch(screen);                                                                               // Do this step to build the animated page.
  drawScanlines(screen);                                                                            // Do this step to build the animated page.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 245);                                                 // Choose the inside color; the last number is transparency.
  textSize(13 * screen.s);                                                                          // Choose how big the letters are; multiplying by 's' keeps it responsive.
  textStyle(BOLD);                                                                                  // Choose if the text is bold or normal.
  text("DOWNLOAD MY CV", 18 * screen.s, 24 * screen.s);                                             // Write words on the canvas.

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 160);                                               // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1 * screen.s);                                                                       // Choose how thick the outline line is.
  line(16 * screen.s, 34 * screen.s, screen.w - 16 * screen.s, 34 * screen.s);                      // Draw a straight line between two points.

  if (!animationStarted) {                                                                          // 'if' asks a yes/no question before doing something.
    drawCopyStartButton(screen);                                                                    // Do this step to build the animated page.
    drawingContext.restore();                                                                       // Bring back the browser's saved drawing state.
    pop();                                                                                          // Restore the saved drawing settings so the next drawing is not affected.
    return;                                                                                         // 'return' stops this function right now.
  }                                                                                                 // Close this little group of instructions.

  copyButtonBounds = null;                                                                          // Put this value into a named box so the code can use it.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 225);                                                 // Choose the inside color; the last number is transparency.
  textStyle(NORMAL);                                                                                // Choose if the text is bold or normal.
  textSize(10.5 * screen.s);                                                                        // Choose how big the letters are; multiplying by 's' keeps it responsive.
  textLeading(13 * screen.s);                                                                       // Choose the space between text lines; multiplying by 's' keeps it responsive.
  const maxChars = floor((screen.w - 34 * screen.s) / (6.3 * screen.s));                            // 'const' makes a named value that the code will use later.
  const visibleTerminal = getVisibleTerminalText(typedText, maxChars, 10);                          // 'const' makes a named value that the code will use later.
  text(visibleTerminal, 18 * screen.s, 54 * screen.s);                                              // Write words on the canvas.

  if (currentChar < fullText.length) {                                                              // 'if' asks a yes/no question before doing something.
    fill(neonBlue[0], neonBlue[1], neonBlue[2], 130 + sin(frameCount * 0.3) * 100);                 // Choose the inside color; the last number is transparency.
    rect(18 * screen.s + (frameCount % 14) * 2 * screen.s, screen.h - 20 * screen.s, 9 * screen.s, 12 * screen.s); // Draw a rectangle.
  } else {                                                                                          // Do this step to build the animated page.
    const alpha = map(sin(frameCount * 0.12), -1, 1, 150, 255);                                     // 'const' makes a named value that the code will use later.
    fill(32, 0, 30, 210);                                                                           // Choose the inside color; the last number is transparency.
    rect(24 * screen.s, screen.h * 0.5, screen.w - 48 * screen.s, 48 * screen.s, 4 * screen.s);     // Draw a rectangle.
    stroke(neonBlue[0], neonBlue[1], neonBlue[2], alpha);                                           // Choose the outline color; numbers are red, green, blue, and alpha.
    strokeWeight(1.4 * screen.s);                                                                   // Choose how thick the outline line is.
    noFill();                                                                                       // Make the next shapes hollow inside.
    rect(24 * screen.s, screen.h * 0.5, screen.w - 48 * screen.s, 48 * screen.s, 4 * screen.s);     // Draw a rectangle.
    noStroke();                                                                                     // Remove the outline from the next shapes.
    fill(softBlue[0], softBlue[1], softBlue[2], alpha);                                             // Choose the inside color; the last number is transparency.
    textStyle(BOLD);                                                                                // Choose if the text is bold or normal.
    textSize(17 * screen.s);                                                                        // Choose how big the letters are; multiplying by 's' keeps it responsive.
    textAlign(CENTER, CENTER);                                                                      // Choose where text sits compared to its x and y point.
    text("PRINT YOUR COPY", screen.w / 2, screen.h * 0.5 + 25 * screen.s);                          // Write words on the canvas.
    textAlign(LEFT, BASELINE);                                                                      // Choose where text sits compared to its x and y point.
  }                                                                                                 // Close this little group of instructions.

  drawingContext.restore();                                                                         // Bring back the browser's saved drawing state.
  pop();                                                                                            // Restore the saved drawing settings so the next drawing is not affected.
}                                                                                                   // Close this little group of instructions.

// Draws the clickable start prompt before the CV typing animation begins.
function drawCopyStartButton(screen) {                                                              // This draws the PRINT YOUR COPY button.
  const buttonW = 230 * screen.s;                                                                   // 'const' makes a named value that the code will use later.
  const buttonH = 54 * screen.s;                                                                    // 'const' makes a named value that the code will use later.
  const buttonX = (screen.w - buttonW) / 2;                                                         // 'const' makes a named value that the code will use later.
  const buttonY = screen.h * 0.5 - buttonH / 2;                                                     // 'const' makes a named value that the code will use later.

  copyButtonBounds = {                                                                              // Put this value into a named box so the code can use it.
    x: screen.x + buttonX,                                                                          // 'x' is the left-right position.
    y: screen.y + buttonY,                                                                          // 'y' is the up-down position.
    w: buttonW,                                                                                     // 'w' means width.
    h: buttonH                                                                                      // 'h' means height.
  };                                                                                                // Close this object or list and finish the sentence.

  fill(32, 0, 30, 210);                                                                             // Choose the inside color; the last number is transparency.
  rect(buttonX, buttonY, buttonW, buttonH, 5 * screen.s);                                           // Draw a rectangle.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 190 + sin(frameCount * 0.08) * 45);                 // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1.4 * screen.s);                                                                     // Choose how thick the outline line is.
  noFill();                                                                                         // Make the next shapes hollow inside.
  rect(buttonX, buttonY, buttonW, buttonH, 5 * screen.s);                                           // Draw a rectangle.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 235);                                                 // Choose the inside color; the last number is transparency.
  textStyle(BOLD);                                                                                  // Choose if the text is bold or normal.
  textSize(17 * screen.s);                                                                          // Choose how big the letters are; multiplying by 's' keeps it responsive.
  textAlign(CENTER, CENTER);                                                                        // Choose where text sits compared to its x and y point.
  text("PRINT YOUR COPY", screen.w / 2, buttonY + buttonH / 2);                                     // Write words on the canvas.

  fill(softBlue[0], softBlue[1], softBlue[2], 130);                                                 // Choose the inside color; the last number is transparency.
  textSize(8.5 * screen.s);                                                                         // Choose how big the letters are; multiplying by 's' keeps it responsive.
  text("CLICK TO START", screen.w / 2, buttonY + buttonH + 17 * screen.s);                          // Write words on the canvas.
  textAlign(LEFT, BASELINE);                                                                        // Choose where text sits compared to its x and y point.
}                                                                                                   // Close this little group of instructions.

// Adds a thin technical grid inside the monitor.
function drawScreenGrid(screen) {                                                                   // This draws the small grid inside the computer screen.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 35);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1);                                                                                  // Choose how thick the outline line is.
  for (let x = 0; x < screen.w; x += 18 * screen.s) {                                               // 'for' repeats the same drawing action many times.
    line(x, 0, x, screen.h);                                                                        // Draw a straight line between two points.
  }                                                                                                 // Close this little group of instructions.
  for (let y = 0; y < screen.h; y += 12 * screen.s) {                                               // 'for' repeats the same drawing action many times.
    line(0, y, screen.w, y);                                                                        // Draw a straight line between two points.
  }                                                                                                 // Close this little group of instructions.
}                                                                                                   // Close this little group of instructions.

// Draws random horizontal fuchsia glitch bars to mimic an unstable CRT signal.
function drawGlitch(screen) {                                                                       // This draws random glitch bars like an old screen.
  randomSeed(noiseSeedValue + floor(frameCount / 5));                                               // Make random-looking things repeat in a stable way.
  noStroke();                                                                                       // Remove the outline from the next shapes.

  if (random() < 0.58) {                                                                            // 'if' asks a yes/no question before doing something.
    for (let i = 0; i < 9; i++) {                                                                   // 'for' repeats the same drawing action many times.
      const y = random(screen.h);                                                                   // 'const' makes a named value that the code will use later.
      const h = random(1, 5) * screen.s;                                                            // 'const' makes a named value that the code will use later.
      const x = random(-18, 18) * screen.s;                                                         // 'const' makes a named value that the code will use later.
      fill(neonBlue[0], neonBlue[1], neonBlue[2], random(20, 72));                                  // Choose the inside color; the last number is transparency.
      rect(x, y, screen.w + abs(x), h);                                                             // Draw a rectangle.
    }                                                                                               // Close this little group of instructions.
  }                                                                                                 // Close this little group of instructions.

  if (random() < 0.12) {                                                                            // 'if' asks a yes/no question before doing something.
    fill(softBlue[0], softBlue[1], softBlue[2], 70);                                                // Choose the inside color; the last number is transparency.
    rect(random(screen.w * 0.25), random(screen.h), random(screen.w * 0.25, screen.w), random(3, 12) * screen.s); // Draw a rectangle.
  }                                                                                                 // Close this little group of instructions.
}                                                                                                   // Close this little group of instructions.

// Draws moving scanlines and a faint sweeping highlight across the screen.
function drawScanlines(screen) {                                                                    // This draws moving horizontal lines on the screen.
  strokeWeight(1);                                                                                  // Choose how thick the outline line is.
  for (let y = scanOffset; y < screen.h; y += 8 * screen.s) {                                       // 'for' repeats the same drawing action many times.
    stroke(neonBlue[0], neonBlue[1], neonBlue[2], 42);                                              // Choose the outline color; numbers are red, green, blue, and alpha.
    line(0, y, screen.w, y);                                                                        // Draw a straight line between two points.
  }                                                                                                 // Close this little group of instructions.

  noStroke();                                                                                       // Remove the outline from the next shapes.
  fill(softBlue[0], softBlue[1], softBlue[2], 18);                                                  // Choose the inside color; the last number is transparency.
  rect(0, (frameCount * 2.4) % screen.h, screen.w, 20 * screen.s);                                  // Draw a rectangle.
}                                                                                                   // Close this little group of instructions.

// Wraps long terminal lines so they fit inside the monitor width.
function wrapTerminalText(source, maxChars) {                                                       // This cuts long CV lines so they fit inside the monitor.
  return source.split("\n").map(line => {                                                           // 'return' sends this answer back to the place that asked for it.
    if (line.length <= maxChars) return line;                                                       // 'if' asks a yes/no question before doing something.

    const pieces = [];                                                                              // 'const' makes a named value that the code will use later.
    let rest = line;                                                                                // 'let' creates a named value that is allowed to change.
    while (rest.length > maxChars) {                                                                // 'while' keeps repeating until the condition is false.
      pieces.push(rest.slice(0, maxChars));                                                         // Take only a selected part of the text.
      rest = rest.slice(maxChars);                                                                  // Take only a selected part of the text.
    }                                                                                               // Close this little group of instructions.
    pieces.push(rest);                                                                              // Add a new item to the end of a list.
    return pieces.join("\n");                                                                       // 'return' sends this answer back to the place that asked for it.
  }).join("\n");                                                                                    // Glue text pieces together into one text.
}                                                                                                   // Close this little group of instructions.

// Returns only the latest terminal lines so the CV appears to scroll upward.
function getVisibleTerminalText(source, maxChars, maxLines) {                                       // This keeps only the newest CV lines visible.
  const wrapped = wrapTerminalText(source, maxChars).split("\n");                                   // 'const' makes a named value that the code will use later.
  const visible = wrapped.slice(max(0, wrapped.length - maxLines));                                 // 'const' makes a named value that the code will use later.

  if (wrapped.length > maxLines) {                                                                  // 'if' asks a yes/no question before doing something.
    visible.unshift("...");                                                                         // Add something to the beginning of a list.
  }                                                                                                 // Close this little group of instructions.
  return visible.join("\n");                                                                        // 'return' sends this answer back to the place that asked for it.
}                                                                                                   // Close this little group of instructions.

// Draws the side printer as a fuchsia wireframe and animates the printed page.
function drawPrinter(p) {                                                                           // This draws the printer and the paper animation.
  const s = p.s;                                                                                    // 'const' makes a named value that the code will use later.
  push();                                                                                           // Save the current drawing settings, like position, color, and rotation.
  translate(p.x, p.y);                                                                              // Move the zero point, like moving the paper under your pencil.

  drawWireShadow(p.w * 0.52, p.h * 1.04, p.w * 0.95, 34 * s);                                       // Call the helper that draws the soft machine shadow.
  drawNeonRect(0, 54 * s, p.w, 142 * s, 14 * s, 2 * s, 220);                                        // Call the helper that draws a glowing rectangle.
  drawNeonRect(24 * s, 86 * s, p.w - 48 * s, 34 * s, 6 * s, 1.2 * s, 135);                          // Call the helper that draws a glowing rectangle.
  drawNeonRect(38 * s, 97 * s, p.w - 76 * s, 10 * s, 4 * s, 1.2 * s, 190);                          // Call the helper that draws a glowing rectangle.
  drawNeonRect(52 * s, 0, p.w - 104 * s, 74 * s, 8 * s, 1.5 * s, 170);                              // Call the helper that draws a glowing rectangle.

  const paperOut = 76 * s * printPulse;                                                             // 'const' makes a named value that the code will use later.
  drawNeonRect(72 * s, 122 * s, p.w - 144 * s, 34 * s + paperOut, 3 * s, 1.2 * s, 165 + printPulse * 70); // Call the helper that draws a glowing rectangle.

  stroke(softBlue[0], softBlue[1], softBlue[2], 80 + printPulse * 130);                             // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1 * s);                                                                              // Choose how thick the outline line is.
  for (let i = 0; i < 5; i++) {                                                                     // 'for' repeats the same drawing action many times.
    line(92 * s, (143 + i * 12) * s, 92 * s + (p.w - 184 * s) * printPulse, (143 + i * 12) * s);    // Draw a straight line between two points.
  }                                                                                                 // Close this little group of instructions.

  drawNeonRect(38 * s, 167 * s, p.w - 76 * s, 16 * s, 5 * s, 1.2 * s, 170);                         // Call the helper that draws a glowing rectangle.
  drawNeonCircle(p.w - 48 * s, 76 * s, 14 * s, 1.4 * s, 160);                                       // Call the helper that draws a glowing circle.
  drawNeonCircle(p.w - 48 * s, 76 * s, 7 * s, 1.8 * s, 130 + printPulse * 110);                     // Call the helper that draws a glowing circle.

  if (printPulse > 0.05) {                                                                          // 'if' asks a yes/no question before doing something.
    noStroke();                                                                                     // Remove the outline from the next shapes.
    fill(softBlue[0], softBlue[1], softBlue[2], 95 * printPulse);                                   // Choose the inside color; the last number is transparency.
    textAlign(CENTER);                                                                              // Choose where text sits compared to its x and y point.
    textSize(12 * s);                                                                               // Choose how big the letters are; multiplying by 's' keeps it responsive.
    textStyle(BOLD);                                                                                // Choose if the text is bold or normal.
    text("READY", p.w - 78 * s, 80 * s);                                                            // Write words on the canvas.
    textAlign(LEFT, BASELINE);                                                                      // Choose where text sits compared to its x and y point.
  }                                                                                                 // Close this little group of instructions.

  pop();                                                                                            // Restore the saved drawing settings so the next drawing is not affected.
}                                                                                                   // Close this little group of instructions.

// Draws the curved cable connecting the computer to the printer.
function drawCable(computer, printer) {                                                             // This draws the cable connecting computer and printer.
  noFill();                                                                                         // Make the next shapes hollow inside.
  const startX = computer.x + computer.w * 0.9;                                                     // This is where the whole scene starts from the left.
  const startY = computer.y + computer.h * 0.78;                                                    // 'const' makes a named value that the code will use later.
  const endX = printer.x + printer.w * 0.12;                                                        // 'const' makes a named value that the code will use later.
  const endY = printer.y + printer.h * 0.72;                                                        // 'const' makes a named value that the code will use later.

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 35);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(8 * computer.s);                                                                     // Choose how thick the outline line is.
  bezier(startX, startY, startX + 90 * computer.s, startY + 80 * computer.s, endX - 80 * computer.s, endY + 55 * computer.s, endX, endY); // Draw a smooth curved line using four control points.

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 145);                                               // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(2.2 * computer.s);                                                                   // Choose how thick the outline line is.
  bezier(startX, startY, startX + 90 * computer.s, startY + 80 * computer.s, endX - 80 * computer.s, endY + 55 * computer.s, endX, endY); // Draw a smooth curved line using four control points.
}                                                                                                   // Close this little group of instructions.

// Adds subtle fuchsia particle points for depth.
function drawForegroundParticles() {                                                                // This draws tiny sparkling points in the front.
  noStroke();                                                                                       // Remove the outline from the next shapes.
  randomSeed(42);                                                                                   // Make random-looking things repeat in a stable way.
  for (let i = 0; i < 80; i++) {                                                                    // 'for' repeats the same drawing action many times.
    const x = random(width);                                                                        // 'const' makes a named value that the code will use later.
    const y = random(height);                                                                       // 'const' makes a named value that the code will use later.
    const twinkle = map(sin(frameCount * 0.02 + i), -1, 1, 20, 85);                                 // 'const' makes a named value that the code will use later.
    fill(neonBlue[0], neonBlue[1], neonBlue[2], twinkle);                                           // Choose the inside color; the last number is transparency.
    circle(x, y, random(0.8, 2.1));                                                                 // Draw a circle.
  }                                                                                                 // Close this little group of instructions.
}                                                                                                   // Close this little group of instructions.

// Draws a neon rectangle with a soft glow pass and a crisp line pass.
function drawNeonRect(x, y, w, h, radius, weight, alpha) {                                          // This draws a rectangle twice: glow first, sharp line second.
  noFill();                                                                                         // Make the next shapes hollow inside.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], alpha * 0.18);                                      // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(weight * 5);                                                                         // Choose how thick the outline line is.
  rect(x, y, w, h, radius);                                                                         // Draw a rectangle.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], alpha);                                             // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(weight);                                                                             // Choose how thick the outline line is.
  rect(x, y, w, h, radius);                                                                         // Draw a rectangle.
}                                                                                                   // Close this little group of instructions.

// Draws a neon circle with a soft glow pass and a crisp line pass.
function drawNeonCircle(x, y, diameter, weight, alpha) {                                            // This draws a glowing circle.
  noFill();                                                                                         // Make the next shapes hollow inside.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], alpha * 0.18);                                      // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(weight * 5);                                                                         // Choose how thick the outline line is.
  circle(x, y, diameter);                                                                           // Draw a circle.
  stroke(softBlue[0], softBlue[1], softBlue[2], alpha);                                             // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(weight);                                                                             // Choose how thick the outline line is.
  circle(x, y, diameter);                                                                           // Draw a circle.
}                                                                                                   // Close this little group of instructions.

// Draws faint diagonal construction lines inside a panel.
function drawDiagonalPanelLines(x, y, w, h, step) {                                                 // This draws diagonal decoration lines inside a panel.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 45);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1);                                                                                  // Choose how thick the outline line is.
  for (let i = -h; i < w; i += step) {                                                              // 'for' repeats the same drawing action many times.
    line(x + i, y + h, x + i + h, y);                                                               // Draw a straight line between two points.
  }                                                                                                 // Close this little group of instructions.
}                                                                                                   // Close this little group of instructions.

// Draws a flat wireframe shadow under each machine.
function drawWireShadow(x, y, w, h) {                                                               // This draws an oval shadow under a machine.
  noFill();                                                                                         // Make the next shapes hollow inside.
  stroke(deepBlue[0], deepBlue[1], deepBlue[2], 95);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  strokeWeight(1);                                                                                  // Choose how thick the outline line is.
  ellipse(x, y, w, h);                                                                              // Draw an oval.
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 20);                                                // Choose the outline color; numbers are red, green, blue, and alpha.
  ellipse(x, y, w * 0.72, h * 0.55);                                                                // Draw an oval.
}                                                                                                   // Close this little group of instructions.

// Triggers the real CV PDF download after the print animation finishes.
function downloadCurriculumPdf() {                                                                  // This starts the real CV PDF download.
  window.App.downloadCv();                                                                          // Tell the website app to download the CV file.
}                                                                                                   // Close this little group of instructions.

// Keeps the canvas full-screen when the browser window changes size.
function windowResized() {                                                                          // This fixes the canvas size when the browser changes size.
  resizeCanvas(windowWidth, windowHeight);                                                          // Resize the canvas to match the browser window.
}                                                                                                   // Close this little group of instructions.

// Restarts the typing and printing sequence when the user clicks/taps.
function mousePressed() {                                                                           // This runs when the user clicks or taps.
  // First interaction target: clicking the archive window opens the 3D portfolio space.
  if (archiveWindowBounds) {                                                                        // 'if' asks a yes/no question before doing something.
    const insideArchiveWindow =                                                                     // 'const' makes a named value that the code will use later.
      mouseX >= archiveWindowBounds.x &&                                                            // 'mouseX' is the left-right position of the click.
      mouseX <= archiveWindowBounds.x + archiveWindowBounds.w &&                                    // 'mouseX' is the left-right position of the click.
      mouseY >= archiveWindowBounds.y &&                                                            // 'mouseY' is the up-down position of the click.
      mouseY <= archiveWindowBounds.y + archiveWindowBounds.h;                                      // 'mouseY' is the up-down position of the click.

    if (insideArchiveWindow) {                                                                      // 'if' asks a yes/no question before doing something.
      window.App.enterArchive();                                                                    // Tell the website app to open the archive section.
      return;                                                                                       // 'return' stops this function right now.
    }                                                                                               // Close this little group of instructions.
  }                                                                                                 // Close this little group of instructions.

  // Second interaction target: clicking the monitor button starts the CV typing animation.
  if (!copyButtonBounds) {                                                                          // 'if' asks a yes/no question before doing something.
    return;                                                                                         // 'return' stops this function right now.
  }                                                                                                 // Close this little group of instructions.

  const insideCopyButton =                                                                          // 'const' makes a named value that the code will use later.
    mouseX >= copyButtonBounds.x &&                                                                 // 'mouseX' is the left-right position of the click.
    mouseX <= copyButtonBounds.x + copyButtonBounds.w &&                                            // 'mouseX' is the left-right position of the click.
    mouseY >= copyButtonBounds.y &&                                                                 // 'mouseY' is the up-down position of the click.
    mouseY <= copyButtonBounds.y + copyButtonBounds.h;                                              // 'mouseY' is the up-down position of the click.

  if (!insideCopyButton) {                                                                          // 'if' asks a yes/no question before doing something.
    return;                                                                                         // 'return' stops this function right now.
  }                                                                                                 // Close this little group of instructions.

  // Reset the print sequence so the animation can start from the beginning.
  animationStarted = true;                                                                          // Put this value into a named box so the code can use it.
  pdfDownloaded = false;                                                                            // Put this value into a named box so the code can use it.
  currentChar = 0;                                                                                  // Put this value into a named box so the code can use it.
  typedText = "";                                                                                   // Put this value into a named box so the code can use it.
  printPulse = 0;                                                                                   // Put this value into a named box so the code can use it.
}                                                                                                   // Close this little group of instructions.
