new p5((p) => {
  let holder;
  let step = 1;

  const stepNames = [
    "Background",
    "Grid",
    "Stem",
    "Petals",
    "Center",
    "Leaves",
    "Signal lines",
    "Glowing nodes"
  ];

  p.setup = () => {
    holder = document.getElementById("flower-step-canvas");
    p.createCanvas(holder.clientWidth, holder.clientHeight).parent(holder);
    p.pixelDensity(1);

    document.getElementById("next-step").addEventListener("click", () => {
      step = Math.min(step + 1, 8);
    });

    document.getElementById("prev-step").addEventListener("click", () => {
      step = Math.max(step - 1, 1);
    });
  };

  p.draw = () => {
    document.getElementById("step-label").textContent = stepNames[step - 1];

    if (step >= 1) {
      p.background(255, 255, 255);
    }

    if (step >= 2) {
      drawSoft2DGrid(p);
    }

    if (step >= 3) {
      drawStem();
    }

    if (step >= 4) {
      drawPetals();
    }

    if (step >= 5) {
      drawCenter();
    }

    if (step >= 6) {
      drawLeaves();
    }

    if (step >= 7) {
      drawSignalLinesOnly();
    }

    if (step >= 8) {
      drawGlowingNodesOnly();
    }
  };

  function drawStem() {
    const cx = p.width * 0.5;
    const cy = p.height * 0.45;

    p.push();
    p.translate(cx, cy);
    p.stroke(255, 0, 190, 150);
    p.strokeWeight(2);
    p.noFill();
    p.bezier(0, 55, -24, 118, 20, 190, -6, 260); //Built the line with 4pt (x,y)
    p.pop();
  }

  function drawPetals() {
    const cx = p.width * 0.5;
    const cy = p.height * 0.45;

    p.push();
    p.translate(cx, cy);

    for (let i = 0; i < 12; i++) {
      const a = i * p.TWO_PI / 12;

      p.push();
      p.rotate(a);
      p.noStroke();
      p.fill(255, i % 2 === 0 ? 92 : 142, 224, 145);
      p.ellipse(42, 0, 84, 26);

      p.stroke(255, 209, 244, 120);
      p.strokeWeight(1);
      p.noFill();
      p.ellipse(42, 0, 84, 26);
      p.pop();
    }

    p.pop();
  }

  function drawCenter() {
    const cx = p.width * 0.5;
    const cy = p.height * 0.45;

    p.noStroke();
    p.fill(255, 0, 190, 230);
    p.circle(cx, cy, 42);

    p.fill(255, 209, 244, 170);
    p.circle(cx - 8, cy - 8, 10);
  }

  function drawLeaves() {
    const cx = p.width * 0.5;
    const cy = p.height * 0.45;

    drawIllustratedLeaf(cx - 42, cy + 138, -0.75, 1);
    drawIllustratedLeaf(cx + 46, cy + 172, 0.72, 0.82);
  }

  function drawIllustratedLeaf(x, y, rotation, leafScale) {
    p.push();
    p.translate(x, y);
    p.rotate(rotation);
    p.fill(42, 164, 148, 120);
    p.stroke(110, 255, 226, 130);
    p.strokeWeight(1.4);
    p.ellipse(0, 0, 82 * leafScale, 25 * leafScale);
    p.line(-30 * leafScale, 0, 30 * leafScale, 0);
    p.pop();
  }

  function drawSignalLinesOnly() {
    p.noFill();

    for (let i = 0; i < 6; i++) {
      const y = p.height * 0.25 + i * 42;

      p.stroke(
        i % 2 === 0 ? 255 : 56,
        i % 2 === 0 ? 0 : 174,
        i % 2 === 0 ? 190 : 255,
        40
      );

      p.strokeWeight(1);
      p.bezier(36, y, p.width * 0.32, y - 54, p.width * 0.68, y + 54, p.width - 36, y);
    }
  }

  function drawGlowingNodesOnly() {
    p.noStroke();

    for (let i = 0; i < 22; i++) {
      const a = i * 0.82 + p.frameCount * 0.01;
      const x = p.width * 0.5 + p.cos(a) * (90 + i * 2.5);
      const y = p.height * 0.45 + p.sin(a * 1.4) * 92;

      p.fill(i % 3 === 0 ? 56 : 255, i % 3 === 0 ? 174 : 209, i % 3 === 0 ? 255 : 244, 180);
      p.circle(x, y, 3 + (i % 4));
    }
  }
});
function drawSoft2DGrid(p) {
  p.stroke(255, 0, 190, 18);
  p.strokeWeight(1);

  for (let x = 0; x <= p.width; x += 36) {
    p.line(x, 0, x, p.height);
  }

  for (let y = 0; y <= p.height; y += 36) {
    p.line(0, y, p.width, y);
  }
}