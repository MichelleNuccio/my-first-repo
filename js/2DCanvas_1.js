(() => {
  // Canvas 03 / SIGNAL BLOOM
  // This file creates a 2D illustrated flower with signal-like lines and translucent petals.

  // Keeps this canvas fitted to its HTML container.
  function resizeSketchToParent(p, parentElement) {
    if (!parentElement) return;
    p.resizeCanvas(parentElement.clientWidth, parentElement.clientHeight);
  }

  new p5((p) => {
    let holder;

    // Creates the first 2D illustration canvas.
    p.setup = () => {
      holder = document.getElementById("flower-illustration-a");
      p.createCanvas(holder.clientWidth, holder.clientHeight).parent(holder);
      p.pixelDensity(1);
    };

    // Draws a layered 2D flower that feels like a digital botanical diagram.
    p.draw = () => {
      p.background(9, 1, 15);
      drawSoft2DGrid(p);
      drawSignalFlower();
      drawSignalLines();
    };

    // Resizes the canvas when the browser window changes.
    p.windowResized = () => resizeSketchToParent(p, holder);

    // Draws the main illustrated flower.
    function drawSignalFlower() {
      const cx = p.width * 0.5;
      const cy = p.height * 0.45;
      const pulse = p.sin(p.frameCount * 0.025) * 4;

      p.push();
      p.translate(cx, cy);

      p.stroke(255, 0, 190, 150);
      p.strokeWeight(2);
      p.noFill();
      p.bezier(0, 55, -24, 118, 20, 190, -6, 260);

      for (let i = 0; i < 12; i++) {
        const a = i * p.TWO_PI / 12 + p.sin(p.frameCount * 0.01) * 0.025;
        p.push();
        p.rotate(a);
        p.noStroke();
        p.fill(255, i % 2 === 0 ? 92 : 142, 224, 145);
        p.ellipse(42 + pulse, 0, 84, 26);
        p.stroke(255, 209, 244, 120);
        p.strokeWeight(1);
        p.noFill();
        p.ellipse(42 + pulse, 0, 84, 26);
        p.pop();
      }

      p.noStroke();
      p.fill(255, 0, 190, 230);
      p.circle(0, 0, 42);
      p.fill(255, 209, 244, 170);
      p.circle(-8, -8, 10);

      drawIllustratedLeaf(-42, 138, -0.75, 1);
      drawIllustratedLeaf(46, 172, 0.72, 0.82);
      p.pop();
    }

    // Draws animated signal lines and nodes around the flower.
    function drawSignalLines() {
      p.noFill();
      for (let i = 0; i < 6; i++) {
        const y = p.height * 0.25 + i * 42 + p.sin(p.frameCount * 0.015 + i) * 8;
        p.stroke(i % 2 === 0 ? 255 : 56, i % 2 === 0 ? 0 : 174, i % 2 === 0 ? 190 : 255, 40);
        p.strokeWeight(1);
        p.bezier(36, y, p.width * 0.32, y - 54, p.width * 0.68, y + 54, p.width - 36, y);
      }

      p.noStroke();
      for (let i = 0; i < 22; i++) {
        const a = i * 0.82 + p.frameCount * 0.01;
        const x = p.width * 0.5 + p.cos(a) * (90 + i * 2.5);
        const y = p.height * 0.45 + p.sin(a * 1.4) * 92;
        const glow = p.map(p.sin(p.frameCount * 0.06 + i), -1, 1, 80, 230);
        p.fill(i % 3 === 0 ? 56 : 255, i % 3 === 0 ? 174 : 209, i % 3 === 0 ? 255 : 244, glow);
        p.circle(x, y, 3 + (i % 4));
      }
    }

    // Draws one flat illustrated leaf.
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
  });

  // Draws a shared 2D background grid.
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
})();
