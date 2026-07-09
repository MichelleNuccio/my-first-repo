(() => {
  // Canvas 04 / NIGHT GARDEN
  // This file creates a 2D bouquet drawn only with luminous outlines.

  // Keeps this canvas fitted to its HTML container.
  function resizeSketchToParent(p, parentElement) {
    if (!parentElement) return;
    p.resizeCanvas(parentElement.clientWidth, parentElement.clientHeight);
  }

  new p5((p) => {
    let holder;

    // Creates the second 2D illustration canvas.
    p.setup = () => {
      holder = document.getElementById("flower-illustration-b");
      p.createCanvas(holder.clientWidth, holder.clientHeight).parent(holder);
      p.pixelDensity(1);
    };

    // Draws a nocturnal outline bouquet with bubbles and soft movement.
    p.draw = () => {
      p.background(7, 0, 12);
      drawSoft2DGrid(p);
      drawNightBouquet();
      drawPerfumeDots2D();
    };

    // Resizes the canvas when the browser window changes.
    p.windowResized = () => resizeSketchToParent(p, holder);

    // Draws a small bouquet made of several outlined flower heads.
    function drawNightBouquet() {
      const cx = p.width * 0.5;
      const cy = p.height * 0.48;
      const flowers = [
        { x: -72, y: -8, s: 0.82, petals: 8, hue: 0 },
        { x: 0, y: -46, s: 1.05, petals: 9, hue: 1 },
        { x: 74, y: -4, s: 0.78, petals: 8, hue: 2 },
        { x: -30, y: 34, s: 0.62, petals: 7, hue: 2 },
        { x: 38, y: 38, s: 0.66, petals: 7, hue: 0 }
      ];

      p.push();
      p.translate(cx, cy);

      // Stems converge at the bottom so the separate flowers read as one bouquet.
      for (const flower of flowers) {
        p.stroke(255, 0, 190, 70);
        p.noFill();
        p.strokeWeight(3 * flower.s);
        p.bezier(0, 210, flower.x * 0.18, 132, flower.x * 0.65, 72, flower.x, flower.y + 34);
        p.stroke(255, 209, 244, 150);
        p.strokeWeight(1.5 * flower.s);
        p.bezier(0, 210, flower.x * 0.18, 132, flower.x * 0.65, 72, flower.x, flower.y + 34);
      }

      drawNightLeaf(-58, 120, -0.55, 0.85);
      drawNightLeaf(56, 132, 0.52, 0.75);
      drawNightLeaf(-16, 160, -0.28, 0.62);

      for (const flower of flowers) {
        drawNightFlowerHead(flower);
      }

      p.pop();
    }

    // Draws one flower head using only outlines.
    function drawNightFlowerHead(flower) {
      p.push();
      p.translate(flower.x, flower.y);

      for (let i = 0; i < flower.petals; i++) {
        const a = i * p.TWO_PI / flower.petals - p.HALF_PI;
        const wobble = p.sin(p.frameCount * 0.018 + i + flower.x) * 3;
        p.push();
        p.rotate(a);
        p.noFill();
        p.stroke(255, 0, 190, 120);
        p.strokeWeight(2.6 * flower.s);
        p.ellipse((42 + wobble) * flower.s, 0, 102 * flower.s, 31 * flower.s);
        if (flower.hue === 0) {
          p.stroke(255, 142, 232, 210);
        } else if (flower.hue === 1) {
          p.stroke(255, 80, 210, 215);
        } else {
          p.stroke(116, 195, 255, 190);
        }
        p.strokeWeight(1.2 * flower.s);
        p.ellipse((39 + wobble) * flower.s, 0, 72 * flower.s, 20 * flower.s);
        p.pop();
      }

      p.noFill();
      p.stroke(flower.hue === 2 ? 56 : 255, flower.hue === 2 ? 174 : 235, flower.hue === 2 ? 255 : 250, 230);
      p.strokeWeight(2);
      p.circle(0, 0, 31 * flower.s);
      p.stroke(255, 0, 190, 180);
      p.strokeWeight(1);
      p.circle(7 * flower.s, -6 * flower.s, 8 * flower.s);
      p.pop();
    }

    // Draws one outlined leaf.
    function drawNightLeaf(x, y, rotation, leafScale) {
      p.push();
      p.translate(x, y);
      p.rotate(rotation);
      p.noFill();
      p.stroke(110, 255, 226, 95);
      p.strokeWeight(1.4);
      p.ellipse(0, 0, 88 * leafScale, 24 * leafScale);
      p.line(-30 * leafScale, 0, 30 * leafScale, 0);
      p.pop();
    }

    // Draws outlined bubbles around the bouquet like a scent cloud.
    function drawPerfumeDots2D() {
      p.noFill();
      for (let i = 0; i < 64; i++) {
        const a = i * 1.37 + p.frameCount * 0.008;
        const radius = 62 + (i % 7) * 19;
        const x = p.width * 0.5 + p.cos(a) * radius;
        const y = p.height * 0.43 + p.sin(a * 1.35) * radius * 0.55;
        const twinkle = p.map(p.sin(p.frameCount * 0.07 + i), -1, 1, 55, 220);
        p.stroke(i % 5 === 0 ? 56 : 255, i % 5 === 0 ? 174 : 209, i % 5 === 0 ? 255 : 244, twinkle);
        p.strokeWeight(1);
        p.circle(x, y, 2 + (i % 4));
      }
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
