(() => {
  // Canvas 02 / M'AMA NON M'AMA
  // This file creates an interactive WEBGL flower whose petals can be plucked.
  const palette = {
    background: [6, 0, 13],
    neon: [255, 0, 190],
    soft: [255, 142, 232],
    pale: [255, 209, 244],
    blue: [56, 174, 255]
  };

  // Keeps this canvas fitted to its HTML container.
  function resizeSketchToParent(p, parentElement) {
    if (!parentElement) return;
    p.resizeCanvas(parentElement.clientWidth, parentElement.clientHeight);
  }

  new p5((p) => {
    let holder;
    let loveStatus;
    let lovePetals = [];
    let pluckedCount = 0;
    let loveMessage = "CLICK A PETAL";

    // Creates the petal data used by the plucking interaction.
    function buildLovePetals() {
      lovePetals = [];
      pluckedCount = 0;
      loveMessage = "CLICK A PETAL";

      for (let i = 0; i < 13; i++) {
        const angle = i * p.TWO_PI / 13 - p.HALF_PI;
        lovePetals.push({
          angle,
          scale: 0.9 + (i % 3) * 0.08,
          hue: i % 3,
          plucked: false,
          progress: 0,
          fallSide: i % 2 === 0 ? -1 : 1
        });
      }
    }

    // Creates the WEBGL canvas inside the second panel.
    p.setup = () => {
      holder = document.getElementById("archive-field-canvas");
      loveStatus = document.getElementById("love-status");
      p.createCanvas(holder.clientWidth, holder.clientHeight, p.WEBGL).parent(holder);
      p.pixelDensity(1);
      buildLovePetals();
    };

    // Draws the interactive flower and the falling petals.
    p.draw = () => {
      p.background(...palette.background);
      p.orbitControl(1.4, 1.4, 0.08);
      drawLighting();
      drawReflectiveGround();
      updateLovePetals();
      drawLoveFlower();
      updateLoveStatus();
      drawFloatingSparks();
    };

    // Resizes the canvas when the browser window changes.
    p.windowResized = () => resizeSketchToParent(p, holder);

    // Plucks one petal on each click; after all petals are gone, the flower resets.
    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

      const nextPetal = lovePetals.find((petal) => !petal.plucked);
      if (!nextPetal) {
        buildLovePetals();
        return;
      }

      nextPetal.plucked = true;
      pluckedCount += 1;
      loveMessage = pluckedCount % 2 === 1 ? "M'AMA" : "NON M'AMA";
    };

    // Updates the readable HTML label layered over the WEBGL canvas.
    function updateLoveStatus() {
      if (!loveStatus) return;
      const hint = pluckedCount >= lovePetals.length ? " / CLICK TO RESET" : " / CLICK TO PLUCK";
      loveStatus.textContent = `${loveMessage}${hint}`;
    }

    // Sets colored lights for glossy petals and a bright flower center.
    function drawLighting() {
      p.ambientLight(12, 2, 22);
      p.directionalLight(255, 190, 244, -0.35, 0.58, -0.72);
      p.pointLight(255, 0, 190, -210, -170, 210);
      p.pointLight(56, 174, 255, 220, -60, -210);
      p.pointLight(255, 235, 250, 0, -220, 120);
    }

    // Draws a reflective ground plane under the flower.
    function drawReflectiveGround() {
      p.push();
      p.translate(0, 128, 0);
      p.rotateX(p.HALF_PI);
      p.noStroke();
      p.specularMaterial(30, 8, 38);
      p.shininess(90);
      p.plane(430, 310);
      p.pop();

      p.push();
      p.translate(0, 126, 0);
      p.rotateX(p.HALF_PI);
      p.noFill();
      p.stroke(255, 0, 190, 42);
      p.strokeWeight(1);
      for (let r = 58; r < 230; r += 36) {
        p.circle(0, 0, r * 2);
      }
      p.pop();
    }

    // Advances the falling animation for already-plucked petals.
    function updateLovePetals() {
      for (const petal of lovePetals) {
        if (petal.plucked) {
          petal.progress = p.min(1, petal.progress + 0.018);
        }
      }
    }

    // Draws the flower head, stem, leaves, and all petals.
    function drawLoveFlower() {
      const head = p.createVector(0, -68, 18);

      p.noStroke();
      drawStemBetween(p.createVector(0, 132, 0), p.createVector(0, -18, 8), 7);
      drawLeaf(-42, 56, -0.72);
      drawLeaf(48, 28, 0.72);

      p.push();
      p.translate(head.x, head.y, head.z);
      p.rotateY(p.sin(p.frameCount * 0.008) * 0.12);

      for (const petal of lovePetals) {
        drawLovePetal(petal);
      }

      p.push();
      p.translate(0, 0, 26);
      p.emissiveMaterial(...palette.neon);
      p.sphere(23, 30, 16);
      p.pop();

      p.pop();
    }

    // Draws an individual petal either attached to the flower or falling away.
    function drawLovePetal(petal) {
      p.noStroke();
      const baseRadius = 56;
      const attachedX = p.cos(petal.angle) * baseRadius;
      const attachedY = p.sin(petal.angle) * baseRadius * 0.72;
      const t = petal.progress;
      const fallX = attachedX + petal.fallSide * 92 * t;
      const fallY = attachedY + 152 * t * t;
      const fallZ = p.sin(petal.angle) * 12 + 64 * t;

      p.push();
      p.translate(fallX, fallY, fallZ);
      p.rotateZ(petal.angle + t * petal.fallSide * 2.4);
      p.rotateY(0.28 + t * 2.5 + p.sin(p.frameCount * 0.012 + petal.angle) * 0.08);

      if (petal.hue === 0) {
        p.specularMaterial(255, 72, 218);
      } else if (petal.hue === 1) {
        p.specularMaterial(255, 180, 244);
      } else {
        p.specularMaterial(105, 205, 255);
      }
      p.shininess(118);
      p.scale(1.5 * petal.scale, 0.5 * petal.scale, 0.09 * petal.scale);
      p.ellipsoid(30, 30, 30, 30, 12);
      p.pop();
    }

    // Draws a glossy leaf near the flower stem.
    function drawLeaf(x, y, rotation) {
      p.noStroke();
      p.push();
      p.translate(x, y, 0);
      p.rotateZ(rotation);
      p.rotateY(0.32);
      p.specularMaterial(92, 238, 204);
      p.shininess(100);
      p.scale(1.7, 0.45, 0.12);
      p.ellipsoid(28, 28, 28, 24, 10);
      p.pop();
    }

    // Draws one stem as a cylinder between two 3D points.
    function drawStemBetween(start, end, radius) {
      p.noStroke();
      const direction = p5.Vector.sub(end, start);
      const midpoint = p5.Vector.add(start, end).mult(0.5);
      const length = direction.mag();
      const yAxis = p.createVector(0, 1, 0);
      const axis = yAxis.cross(direction);
      const angle = yAxis.angleBetween(direction);

      p.push();
      p.translate(midpoint.x, midpoint.y, midpoint.z);
      if (axis.mag() > 0.0001) {
        p.rotate(angle, [axis.x, axis.y, axis.z]);
      }
      p.specularMaterial(92, 238, 204);
      p.shininess(120);
      p.cylinder(radius, length, 18, 6);
      p.pop();
    }

    // Adds small floating light points around the flower.
    function drawFloatingSparks() {
      p.noStroke();
      for (let i = 0; i < 48; i++) {
        const a = i * 1.91 + p.frameCount * 0.004;
        const r = 70 + (i % 8) * 18;
        const x = p.cos(a) * r;
        const y = -24 + p.sin(i * 0.8 + p.frameCount * 0.01) * 92;
        const z = p.sin(a) * r * 0.72;
        const glow = p.map(p.sin(p.frameCount * 0.05 + i), -1, 1, 0.45, 1);
        p.push();
        p.translate(x, y, z);
        if (i % 4 === 0) {
          p.emissiveMaterial(56 * glow, 174 * glow, 255 * glow);
        } else {
          p.emissiveMaterial(255 * glow, 142 * glow, 232 * glow);
        }
        p.sphere(2.2 + (i % 3), 10, 8);
        p.pop();
      }
    }
  });
})();
