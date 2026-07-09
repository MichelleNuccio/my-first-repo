// CV content that gets typed onto the old computer screen.
// Replace these lines with your real curriculum text.
const cvLines = [
  "CURRICULUM VITAE",
  "",
  "NOME: Il tuo nome",
  "RUOLO: Creative technologist / designer",
  "LOCATION: Italia",
  "",
  "PROFILO",
  "Sviluppo esperienze digitali, visual design",
  "e interfacce interattive con cura per ritmo,",
  "dettaglio e comunicazione visiva.",
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
];

// Variables that store the animation state: typed text progress, screen effects, glitch variation, and printer movement.
let typedText = "";
let fullText = "";
let currentChar = 0;
let scanOffset = 0;
let noiseSeedValue = 0;
let printPulse = 0;

const neonBlue = [0, 190, 255];
const deepBlue = [0, 55, 95];
const softBlue = [95, 225, 255];

// Initializes the P5 canvas, font, and source text before animation starts.
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont("Courier New");
  fullText = cvLines.join("\n");
  noiseSeedValue = random(1000);
}

// Main P5 loop: clears the frame, updates animation, and draws the full wireframe scene.
function draw() {
  background(2, 6, 14);
  drawBlueprintBackground();

  const stage = getStage();
  drawComputer(stage.computer);
  drawPrinter(stage.printer);
  updateText();
  drawScreenContent(stage.screen);
  drawCable(stage.computer, stage.printer);
  drawForegroundParticles();
}

// Calculates responsive layout values for the computer, screen, and printer.
function getStage() {
  const scaleFactor = min(width / 1010, height / 720);
  const computerW = 520 * scaleFactor;
  const computerH = 430 * scaleFactor;
  const printerW = 335 * scaleFactor;
  const baseY = height * 0.68;
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

  return { computer, printer, screen };
}

// Advances the typed CV text, scanline motion, and printer completion state.
function updateText() {
  if (currentChar < fullText.length) {
    currentChar += random() < 0.12 ? 4 : 2;
    typedText = fullText.slice(0, currentChar);
  }

  scanOffset = (scanOffset + 0.8) % 8;
  printPulse = lerp(printPulse, currentChar >= fullText.length ? 1 : 0, 0.025);
}

// Draws the dark technical background with a blue perspective grid.
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

  drawBlueGlow(width * 0.43, height * 0.41, min(width, height) * 0.6, 14);
}

// Draws a soft blue glow made from translucent ellipses.
function drawBlueGlow(x, y, size, maxAlpha) {
  noStroke();
  for (let r = size; r > 0; r -= 34) {
    const a = map(r, 0, size, 0, maxAlpha);
    fill(neonBlue[0], neonBlue[1], neonBlue[2], a);
    ellipse(x, y, r * 1.35, r * 0.8);
  }
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

// Draws all clipped monitor content: blue terminal, glitch, typed CV, and final callout.
function drawScreenContent(screen) {
  push();
  translate(screen.x, screen.y);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, screen.w, screen.h);
  drawingContext.clip();

  noStroke();
  fill(0, 18, 34, 210);
  rect(0, 0, screen.w, screen.h);

  drawScreenGrid(screen);
  drawGlitch(screen);
  drawScanlines(screen);

  noStroke();
  fill(softBlue[0], softBlue[1], softBlue[2], 245);
  textSize(13 * screen.s);
  textStyle(BOLD);
  text("PRINT YOUR DATA", 18 * screen.s, 24 * screen.s);

  stroke(neonBlue[0], neonBlue[1], neonBlue[2], 160);
  strokeWeight(1 * screen.s);
  line(16 * screen.s, 34 * screen.s, screen.w - 16 * screen.s, 34 * screen.s);

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
    fill(0, 18, 35, 205);
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

// Draws random horizontal blue glitch bars to mimic an unstable CRT signal.
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

// Draws the side printer as a blue wireframe and animates the printed page.
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

// Adds subtle blue particle points for depth.
function drawForegroundParticles() {
  noStroke();
  randomSeed(42);
  for (let i = 0; i < 80; i++) {
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

// Keeps the canvas full-screen when the browser window changes size.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Restarts the typing and printing sequence when the user clicks/taps.
function mousePressed() {
  currentChar = 0;
  typedText = "";
  printPulse = 0;
}
