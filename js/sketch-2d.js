// CV source text imported from the shared data file.
const cvLines = window.PortfolioData.cvLines;

// Variables that store the animation state: typed text progress, screen effects, glitch variation, and printer movement.
let typedText = "";
let fullText = "";
let currentChar = 0;
let scanOffset = 0;
let noiseSeedValue = 0;
let printPulse = 0;
let animationStarted = false;
let pdfDownloaded = false;
let copyButtonBounds = null;
let archiveWindowBounds = null;
let profileImage;

// Main color palette for the neon wireframe interface.
// The names still say "Blue" from an earlier version, but the RGB values now create the fuchsia look.
const neonBlue = [255, 0, 190];
const deepBlue = [92, 0, 78];
const softBlue = [255, 110, 230];

// Introduction text drawn inside the ABOUT_ME.txt window on the landing page.
const introText = [
  "I'm Michelle, an architect, researcher and computational designer with a curiosity for everything that happens between architecture, code and philosophy.",
  "",
  "I love experimenting with generative design, creative coding and interactive media, turning data, algorithms and abstract concepts into visual experiences. My research is inspired by post-humanist thinking, ecological systems and the invisible relationships that shape the spaces we live in.",
  "",
  "This website is my collection of experiments, prototypes and ongoing explorations. Some work, some fail, all teach me something. Have a look around!"
];

// Loads external visual assets before the sketch starts.
function preload() {
  profileImage = loadImage("assets/michelle-profile.jpeg");
}

// Initializes the P5 canvas, font, and source text before animation starts.
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  textFont("Courier New");
  fullText = cvLines.join("\n");
  noiseSeedValue = random(1000);
}

// Main P5 loop: clears the frame, updates animation, and draws the full wireframe scene.
function draw() {
  background(12, 2, 18);
  drawBlueprintBackground();

  const stage = getStage();
  drawHeaderTitle(stage.computer.x);
  drawIntroWindow(stage.introWindow);
  drawComputer(stage.computer);
  drawPrinter(stage.printer);
  drawArchiveWindow(stage.archiveWindow);
  updateText();
  drawScreenContent(stage.screen);
  drawCable(stage.computer, stage.printer);
  drawForegroundParticles();
}

// Calculates responsive layout values for the computer, screen, and printer.
function getStage() {
  const scaleFactor = min(width / 1010, height / 760)*0.75;
  const computerW = 520 * scaleFactor;
  const computerH = 430 * scaleFactor;
  const printerW = 335 * scaleFactor;
  const baseY = height * 0.86;
  const gap = 54 * scaleFactor;
  const totalW = computerW + printerW + gap;
  const startX = (width - totalW) / 2;

  const computer = {
    x: startX,
    y: baseY - computerH,
    w: computerW,
    h: computerH,
    s: scaleFactor
  };

  const printer = {
    x: startX + computerW + gap,
    y: baseY - 230 * scaleFactor,
    w: printerW,
    h: 230 * scaleFactor,
    s: scaleFactor
  };

  const screen = {
    x: computer.x + 88 * scaleFactor,
    y: computer.y + 72 * scaleFactor,
    w: 344 * scaleFactor,
    h: 206 * scaleFactor,
    s: scaleFactor
  };

  const archiveWindowW = min(340 * scaleFactor, width - printer.x - 34 * scaleFactor);
  const archiveWindow = {
    x: printer.x + (printer.w - archiveWindowW) / 2,
    y: max(90 * scaleFactor, printer.y - 128 * scaleFactor),
    w: archiveWindowW,
    h: 104 * scaleFactor,
    s: scaleFactor
  };

  const headerBottom = min(width, height) * 0.045 + 58;
  const availableIntroTop = headerBottom + 22 * scaleFactor;
  const availableIntroBottom = computer.y - 34 * scaleFactor;
  const introH = min(250 * scaleFactor, max(178 * scaleFactor, availableIntroBottom - availableIntroTop));
  const introWindow = {
    x: computer.x,
    y: availableIntroTop + max(0, (availableIntroBottom - availableIntroTop - introH) * 0.5),
    w: min(820 * scaleFactor, width - computer.x - 34 * scaleFactor),
    h: introH,
    s: scaleFactor
  };

  return { computer, printer, screen, archiveWindow, introWindow };
}

// Advances the typed CV text, scanline motion, and printer completion state.
function updateText() {
  scanOffset = (scanOffset + 0.8) % 8;

  if (!animationStarted) {
    return;
  }

  if (currentChar < fullText.length) {
    currentChar += random() < 0.12 ? 4 : 2;
    typedText = fullText.slice(0, currentChar);
  }

  printPulse = lerp(printPulse, currentChar >= fullText.length ? 1 : 0, 0.025);

  if (!pdfDownloaded && currentChar >= fullText.length && printPulse > 0.96) {
    pdfDownloaded = true;
    downloadCurriculumPdf();
  }
}

// Draws the dark technical background with a fuchsia perspective grid.
function drawBlueprintBackground() {
  noFill();
  strokeCap(SQUARE);

  const grid = 44;
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 18);
  strokeWeight(1);
  for (let x = (frameCount * 0.18) % grid; x < width; x += grid) {
    line(x, 0, x, height);
  }
  for (let y = (frameCount * 0.12) % grid; y < height; y += grid) {
    line(0, y, width, y);
  }

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 70);
  line(0, height * 0.7, width, height * 0.7);
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 22);
  for (let i = 0; i < 12; i++) {
    const y = height * 0.7 + i * 22;
    line(width * 0.22 - i * 32, y, width * 0.78 + i * 32, y);
  }

  drawBlueGlow(width * 0.43, height * 0.44, min(width, height) * 0.56, 12);
}

// Draws a soft fuchsia glow made from translucent ellipses.
function drawBlueGlow(x, y, size, maxAlpha) {
  noStroke();
  const t = frameCount * 0.006;
  const driftX = sin(t * 0.72) * size * 0.035;
  const driftY = cos(t * 0.58) * size * 0.025;
  const stretchX = 1.22 + sin(t * 0.9) * 0.12;
  const stretchY = 0.72 + cos(t * 0.74) * 0.07;
  const tilt = sin(t * 0.52) * 0.08;

  push();
  translate(x + driftX, y + driftY);
  rotate(tilt);
  for (let r = size; r > 0; r -= 34) {
    const a = map(r, 0, size, 0, maxAlpha);
    fill(neonBlue[0], neonBlue[1], neonBlue[2], a);
    ellipse(0, 0, r * stretchX, r * stretchY);
  }
  pop();
}

// Draws the portfolio name as a fixed neon interface label in the top-left corner.
function drawHeaderTitle(anchorX) {
  const marginY = min(width, height) * 0.045;
  const labelW = min(430, width * 0.72);
  const labelH = 58;

  drawNeonRect(anchorX, marginY, labelW, labelH, 8, 1.2, 145);

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 95);
  strokeWeight(1);
  line(anchorX + 18, marginY + labelH - 14, anchorX + labelW - 18, marginY + labelH - 14);

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 245);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  textSize(constrain(width * 0.026, 18, 34));
  text("MICHELLE NUCCIO", anchorX + 20, marginY + labelH * 0.45);
  textSize(12);
  fill(softBlue[0], softBlue[1], softBlue[2], 120);
  text("ARCHIVE INTERFACE / CV PRINT SYSTEM", anchorX + 22, marginY + labelH - 13);
  textAlign(LEFT, BASELINE);
}

// Draws a desktop document-style archive window above the printer.
function drawArchiveWindow(win) {
  const s = win.s;
  archiveWindowBounds = {
    x: win.x,
    y: win.y,
    w: win.w,
    h: win.h
  };

  push();
  translate(win.x, win.y);

  fill(26, 0, 28, 190);
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 190);
  strokeWeight(1.4 * s);
  rect(0, 0, win.w, win.h, 8 * s);

  drawNeonRect(0, 0, win.w, win.h, 8 * s, 1.1 * s, 130);

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 125);
  strokeWeight(1 * s);
  line(0, 26 * s, win.w, 26 * s);

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 170);
  circle(14 * s, 13 * s, 6 * s);
  circle(27 * s, 13 * s, 6 * s);
  circle(40 * s, 13 * s, 6 * s);

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 80);
  noFill();
  rect(15 * s, 43 * s, 36 * s, 28 * s, 3 * s);
  line(23 * s, 51 * s, 43 * s, 51 * s);
  line(23 * s, 60 * s, 40 * s, 60 * s);

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 235);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(14 * s);
  text("Welcome to my Archive,", 65 * s, 42 * s);
  textSize(15 * s);
  text("Click to Enter", 65 * s, 61 * s);

  fill(softBlue[0], softBlue[1], softBlue[2], 95 + sin(frameCount * 0.08) * 45);
  textSize(9 * s);
  text("DOCUMENTS / INDEX", 65 * s, 83 * s);
  textAlign(LEFT, BASELINE);

  pop();
}

// Draws the left profile/about window with a photo and introductory text.
function drawIntroWindow(win) {
  const s = win.s;
  push();
  translate(win.x, win.y);

  fill(24, 0, 27, 185);
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 180);
  strokeWeight(1.4 * s);
  rect(0, 0, win.w, win.h, 10 * s);
  drawNeonRect(0, 0, win.w, win.h, 10 * s, 1.1 * s, 125);

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 115);
  strokeWeight(1 * s);
  line(0, 28 * s, win.w, 28 * s);

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 160);
  circle(15 * s, 14 * s, 6 * s);
  circle(29 * s, 14 * s, 6 * s);
  circle(43 * s, 14 * s, 6 * s);

  fill(softBlue[0], softBlue[1], softBlue[2], 185);
  textStyle(BOLD);
  textSize(10 * s);
  textAlign(RIGHT, CENTER);
  text("ABOUT_ME.txt", win.w - 16 * s, 14 * s);

  const pad = 18 * s;
  const contentY = 45 * s;
  const contentH = win.h - contentY - 20 * s;
  const imageW = min(245 * s, win.w * 0.36);
  drawFramedProfileImage(pad, contentY, imageW, contentH, 5 * s);

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 235);
  textAlign(LEFT, TOP);
  const textX = pad + imageW + 22 * s;
  const textY = contentY + 4 * s;
  const textW = win.w - textX - pad;
  textStyle(NORMAL);
  textSize(14 * s);
  textLeading(18 * s);

  const bodyY = textY;
  const bodyMaxH = win.h - bodyY - 16 * s;
  drawWrappedParagraphs(introText, textX, bodyY, textW, bodyMaxH, 10.8 * s, 14.4 * s);

  pop();
}

// Draws the profile image inside a neon clipped frame.
function drawFramedProfileImage(x, y, w, h, radius) {
  if (!profileImage) {
    return;
  }

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect(x, y, w, h, radius);
  drawingContext.clip();

  const imageRatio = profileImage.width / profileImage.height;
  const frameRatio = w / h;
  let drawW = w;
  let drawH = h;
  let drawX = x;
  let drawY = y;

  if (imageRatio > frameRatio) {
    drawH = h;
    drawW = h * imageRatio;
    drawX = x - (drawW - w) * 0.42;
  } else {
    drawW = w;
    drawH = w / imageRatio;
    drawY = y - (drawH - h) * 0.35;
  }

  tint(255, 178);
  image(profileImage, drawX, drawY, drawW, drawH);
  noTint();
  fill(neonBlue[0], neonBlue[1], neonBlue[2], 34);
  rect(x, y, w, h);
  drawingContext.restore();

  noFill();
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 190);
  strokeWeight(1.2);
  rect(x, y, w, h, radius);
}

// Writes paragraph text inside a fixed area with simple word wrapping.
function drawWrappedParagraphs(paragraphs, x, y, w, maxH, fontSize, leading) {
  textSize(fontSize);
  textLeading(leading);

  let cursorY = y;
  const maxChars = max(28, floor(w / (fontSize * 0.62)));

  for (const paragraph of paragraphs) {
    if (paragraph === "") {
      cursorY += leading * 0.6;
      continue;
    }

    const words = paragraph.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? line + " " + word : word;

      if (testLine.length > maxChars && line !== "") {
        if (cursorY + leading > y + maxH) return;
        text(line, x, cursorY);
        cursorY += leading;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line !== "") {
      if (cursorY + leading > y + maxH) return;
      text(line, x, cursorY);
      cursorY += leading;
    }

    cursorY += leading * 0.5;
  }
}

function buildWrappedLines(paragraphs, w, fontSize) {
  textSize(fontSize);

  const lines = [];

  for (const paragraph of paragraphs) {
    if (paragraph === "") {
      lines.push("");
      continue;
    }

    const words = paragraph.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;

      if (textWidth(testLine) > w && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      lines.push(line);
    }

    lines.push("");
  }

  return lines;
}

// Draws the retro computer as a luminous wireframe object.
function drawComputer(c) {
  const s = c.s;
  push();
  translate(c.x, c.y);

  drawWireShadow(c.w * 0.52, c.h * 1.02, c.w * 0.95, 38 * s);

  noFill();
  strokeJoin(ROUND);
  strokeCap(SQUARE);

  drawNeonRect(0, 0, c.w, 338 * s, 20 * s, 2.2 * s, 230);
  drawNeonRect(18 * s, 18 * s, c.w - 36 * s, 302 * s, 13 * s, 1.2 * s, 130);
  drawNeonRect(34 * s, 30 * s, c.w - 68 * s, 276 * s, 10 * s, 1 * s, 80);
  drawNeonRect(68 * s, 52 * s, 384 * s, 246 * s, 18 * s, 2 * s, 230);
  drawNeonRect(88 * s, 72 * s, 344 * s, 206 * s, 9 * s, 1.4 * s, 180);
  drawDiagonalPanelLines(68 * s, 52 * s, 384 * s, 246 * s, 18 * s);

  drawNeonRect(58 * s, 338 * s, 405 * s, 45 * s, 10 * s, 1.5 * s, 170);
  drawNeonRect(102 * s, 383 * s, 318 * s, 36 * s, 9 * s, 1.3 * s, 150);
  drawNeonRect(16 * s, 414 * s, 490 * s, 48 * s, 12 * s, 1.7 * s, 210);

  for (let i = 0; i < 18; i++) {
    const keyAlpha = i % 5 === 0 ? 230 : 120;
    drawNeonRect((46 + i * 24) * s, 427 * s, 16 * s, 10 * s, 2 * s, 0.9 * s, keyAlpha);
  }

  drawNeonRect(386 * s, 350 * s, 50 * s, 15 * s, 3 * s, 1.2 * s, 140);
  drawNeonCircle(466 * s, 360 * s, 18 * s, 1.4 * s, 170);
  drawNeonCircle(466 * s, 360 * s, 8 * s, 1.8 * s, 170 + sin(frameCount * 0.08) * 70);

  pop();
}

// Draws all clipped monitor content: fuchsia terminal, glitch, typed CV, and final callout.
function drawScreenContent(screen) {
  push();
  translate(screen.x, screen.y);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, screen.w, screen.h);
  drawingContext.clip();

  noStroke();
  fill(30, 0, 28, 215);
  rect(0, 0, screen.w, screen.h);

  drawScreenGrid(screen);
  drawGlitch(screen);
  drawScanlines(screen);

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 245);
  textSize(13 * screen.s);
  textStyle(BOLD);
  text("DOWNLOAD MY CV", 18 * screen.s, 24 * screen.s);

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 160);
  strokeWeight(1 * screen.s);
  line(16 * screen.s, 34 * screen.s, screen.w - 16 * screen.s, 34 * screen.s);

  if (!animationStarted) {
    drawCopyStartButton(screen);
    drawingContext.restore();
    pop();
    return;
  }

  copyButtonBounds = null;

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 225);
  textStyle(NORMAL);
  textSize(10.5 * screen.s);
  textLeading(13 * screen.s);
  const maxChars = floor((screen.w - 34 * screen.s) / (6.3 * screen.s));
  const visibleTerminal = getVisibleTerminalText(typedText, maxChars, 10);
  text(visibleTerminal, 18 * screen.s, 54 * screen.s);

  if (currentChar < fullText.length) {
    fill(neonBlue[0], neonBlue[1], neonBlue[2], 130 + sin(frameCount * 0.3) * 100);
    rect(18 * screen.s + (frameCount % 14) * 2 * screen.s, screen.h - 20 * screen.s, 9 * screen.s, 12 * screen.s);
  } else {
    const alpha = map(sin(frameCount * 0.12), -1, 1, 150, 255);
    fill(32, 0, 30, 210);
    rect(24 * screen.s, screen.h * 0.5, screen.w - 48 * screen.s, 48 * screen.s, 4 * screen.s);
    stroke(neonBlue[0], neonBlue[1], neonBlue[2], alpha);
    strokeWeight(1.4 * screen.s);
    noFill();
    rect(24 * screen.s, screen.h * 0.5, screen.w - 48 * screen.s, 48 * screen.s, 4 * screen.s);
    noStroke();
    fill(softBlue[0], softBlue[1], softBlue[2], alpha);
    textStyle(BOLD);
    textSize(17 * screen.s);
    textAlign(CENTER, CENTER);
    text("PRINT YOUR COPY", screen.w / 2, screen.h * 0.5 + 25 * screen.s);
    textAlign(LEFT, BASELINE);
  }

  drawingContext.restore();
  pop();
}

// Draws the clickable start prompt before the CV typing animation begins.
function drawCopyStartButton(screen) {
  const buttonW = 230 * screen.s;
  const buttonH = 54 * screen.s;
  const buttonX = (screen.w - buttonW) / 2;
  const buttonY = screen.h * 0.5 - buttonH / 2;

  copyButtonBounds = {
    x: screen.x + buttonX,
    y: screen.y + buttonY,
    w: buttonW,
    h: buttonH
  };

  fill(32, 0, 30, 210);
  rect(buttonX, buttonY, buttonW, buttonH, 5 * screen.s);
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 190 + sin(frameCount * 0.08) * 45);
  strokeWeight(1.4 * screen.s);
  noFill();
  rect(buttonX, buttonY, buttonW, buttonH, 5 * screen.s);

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 235);
  textStyle(BOLD);
  textSize(17 * screen.s);
  textAlign(CENTER, CENTER);
  text("PRINT YOUR COPY", screen.w / 2, buttonY + buttonH / 2);

  fill(softBlue[0], softBlue[1], softBlue[2], 130);
  textSize(8.5 * screen.s);
  text("CLICK TO START", screen.w / 2, buttonY + buttonH + 17 * screen.s);
  textAlign(LEFT, BASELINE);
}

// Adds a thin technical grid inside the monitor.
function drawScreenGrid(screen) {
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 35);
  strokeWeight(1);
  for (let x = 0; x < screen.w; x += 18 * screen.s) {
    line(x, 0, x, screen.h);
  }
  for (let y = 0; y < screen.h; y += 12 * screen.s) {
    line(0, y, screen.w, y);
  }
}

// Draws random horizontal fuchsia glitch bars to mimic an unstable CRT signal.
function drawGlitch(screen) {
  randomSeed(noiseSeedValue + floor(frameCount / 5));
  noStroke();

  if (random() < 0.58) {
    for (let i = 0; i < 9; i++) {
      const y = random(screen.h);
      const h = random(1, 5) * screen.s;
      const x = random(-18, 18) * screen.s;
      fill(neonBlue[0], neonBlue[1], neonBlue[2], random(20, 72));
      rect(x, y, screen.w + abs(x), h);
    }
  }

  if (random() < 0.12) {
    fill(softBlue[0], softBlue[1], softBlue[2], 70);
    rect(random(screen.w * 0.25), random(screen.h), random(screen.w * 0.25, screen.w), random(3, 12) * screen.s);
  }
}

// Draws moving scanlines and a faint sweeping highlight across the screen.
function drawScanlines(screen) {
  strokeWeight(1);
  for (let y = scanOffset; y < screen.h; y += 8 * screen.s) {
    stroke(neonBlue[0], neonBlue[1], neonBlue[2], 42);
    line(0, y, screen.w, y);
  }

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 18);
  rect(0, (frameCount * 2.4) % screen.h, screen.w, 20 * screen.s);
}

// Wraps long terminal lines so they fit inside the monitor width.
function wrapTerminalText(source, maxChars) {
  return source.split("\n").map(line => {
    if (line.length <= maxChars) return line;

    const pieces = [];
    let rest = line;
    while (rest.length > maxChars) {
      pieces.push(rest.slice(0, maxChars));
      rest = rest.slice(maxChars);
    }
    pieces.push(rest);
    return pieces.join("\n");
  }).join("\n");
}

// Returns only the latest terminal lines so the CV appears to scroll upward.
function getVisibleTerminalText(source, maxChars, maxLines) {
  const wrapped = wrapTerminalText(source, maxChars).split("\n");
  const visible = wrapped.slice(max(0, wrapped.length - maxLines));

  if (wrapped.length > maxLines) {
    visible.unshift("...");
  }
  return visible.join("\n");
}

// Draws the side printer as a fuchsia wireframe and animates the printed page.
function drawPrinter(p) {
  const s = p.s;
  push();
  translate(p.x, p.y);

  drawWireShadow(p.w * 0.52, p.h * 1.04, p.w * 0.95, 34 * s);
  drawNeonRect(0, 54 * s, p.w, 142 * s, 14 * s, 2 * s, 220);
  drawNeonRect(24 * s, 86 * s, p.w - 48 * s, 34 * s, 6 * s, 1.2 * s, 135);
  drawNeonRect(38 * s, 97 * s, p.w - 76 * s, 10 * s, 4 * s, 1.2 * s, 190);
  drawNeonRect(52 * s, 0, p.w - 104 * s, 74 * s, 8 * s, 1.5 * s, 170);

  const paperOut = 76 * s * printPulse;
  drawNeonRect(72 * s, 122 * s, p.w - 144 * s, 34 * s + paperOut, 3 * s, 1.2 * s, 165 + printPulse * 70);

  stroke(softBlue[0], softBlue[1], softBlue[2], 80 + printPulse * 130);
  strokeWeight(1 * s);
  for (let i = 0; i < 5; i++) {
    line(92 * s, (143 + i * 12) * s, 92 * s + (p.w - 184 * s) * printPulse, (143 + i * 12) * s);
  }

  drawNeonRect(38 * s, 167 * s, p.w - 76 * s, 16 * s, 5 * s, 1.2 * s, 170);
  drawNeonCircle(p.w - 48 * s, 76 * s, 14 * s, 1.4 * s, 160);
  drawNeonCircle(p.w - 48 * s, 76 * s, 7 * s, 1.8 * s, 130 + printPulse * 110);

  if (printPulse > 0.05) {
    noStroke();
    fill(softBlue[0], softBlue[1], softBlue[2], 95 * printPulse);
    textAlign(CENTER);
    textSize(12 * s);
    textStyle(BOLD);
    text("READY", p.w - 78 * s, 80 * s);
    textAlign(LEFT, BASELINE);
  }

  pop();
}

// Draws the curved cable connecting the computer to the printer.
function drawCable(computer, printer) {
  noFill();
  const startX = computer.x + computer.w * 0.9;
  const startY = computer.y + computer.h * 0.78;
  const endX = printer.x + printer.w * 0.12;
  const endY = printer.y + printer.h * 0.72;

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 35);
  strokeWeight(8 * computer.s);
  bezier(startX, startY, startX + 90 * computer.s, startY + 80 * computer.s, endX - 80 * computer.s, endY + 55 * computer.s, endX, endY);

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 145);
  strokeWeight(2.2 * computer.s);
  bezier(startX, startY, startX + 90 * computer.s, startY + 80 * computer.s, endX - 80 * computer.s, endY + 55 * computer.s, endX, endY);
}

// Adds subtle fuchsia particle points for depth.
function drawForegroundParticles() {
  noStroke();
  randomSeed(42);
  for (let i = 0; i < 40; i++) {
    const x = random(width);
    const y = random(height);
    const twinkle = map(sin(frameCount * 0.02 + i), -1, 1, 20, 85);
    fill(neonBlue[0], neonBlue[1], neonBlue[2], twinkle);
    circle(x, y, random(0.8, 2.1));
  }
}

// Draws a neon rectangle with a soft glow pass and a crisp line pass.
function drawNeonRect(x, y, w, h, radius, weight, alpha) {
  noFill();
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], alpha * 0.18);
  strokeWeight(weight * 5);
  rect(x, y, w, h, radius);
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], alpha);
  strokeWeight(weight);
  rect(x, y, w, h, radius);
}

// Draws a neon circle with a soft glow pass and a crisp line pass.
function drawNeonCircle(x, y, diameter, weight, alpha) {
  noFill();
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], alpha * 0.18);
  strokeWeight(weight * 5);
  circle(x, y, diameter);
  stroke(softBlue[0], softBlue[1], softBlue[2], alpha);
  strokeWeight(weight);
  circle(x, y, diameter);
}

// Draws faint diagonal construction lines inside a panel.
function drawDiagonalPanelLines(x, y, w, h, step) {
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 45);
  strokeWeight(1);
  for (let i = -h; i < w; i += step) {
    line(x + i, y + h, x + i + h, y);
  }
}

// Draws a flat wireframe shadow under each machine.
function drawWireShadow(x, y, w, h) {
  noFill();
  stroke(deepBlue[0], deepBlue[1], deepBlue[2], 95);
  strokeWeight(1);
  ellipse(x, y, w, h);
  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 20);
  ellipse(x, y, w * 0.72, h * 0.55);
}

// Triggers the real CV PDF download after the print animation finishes.
function downloadCurriculumPdf() {
  window.App.downloadCv();
}

// Keeps the canvas full-screen when the browser window changes size.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Restarts the typing and printing sequence when the user clicks/taps.
function mousePressed() {
  // First interaction target: clicking the archive window opens the 3D portfolio space.
  if (archiveWindowBounds) {
    const insideArchiveWindow =
      mouseX >= archiveWindowBounds.x &&
      mouseX <= archiveWindowBounds.x + archiveWindowBounds.w &&
      mouseY >= archiveWindowBounds.y &&
      mouseY <= archiveWindowBounds.y + archiveWindowBounds.h;

    if (insideArchiveWindow) {
      window.App.enterArchive();
      return;
    }
  }

  // Second interaction target: clicking the monitor button starts the CV typing animation.
  if (!copyButtonBounds) {
    return;
  }

  const insideCopyButton =
    mouseX >= copyButtonBounds.x &&
    mouseX <= copyButtonBounds.x + copyButtonBounds.w &&
    mouseY >= copyButtonBounds.y &&
    mouseY <= copyButtonBounds.y + copyButtonBounds.h;

  if (!insideCopyButton) {
    return;
  }

  // Reset the print sequence so the animation can start from the beginning.
  animationStarted = true;
  pdfDownloaded = false;
  currentChar = 0;
  typedText = "";
  printPulse = 0;
}
