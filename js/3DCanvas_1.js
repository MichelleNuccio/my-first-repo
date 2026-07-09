(() => {
  // Canvas 01 / DATA BOUQUET
  // This file creates the first WEBGL sketch: a 3D bouquet made from simple geometry.
  const palette = {
    background: [9, 1, 15],
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

    // Creates the WEBGL canvas inside the first panel.
    p.setup = () => {
      holder = document.getElementById("portrait-canvas");
      p.createCanvas(holder.clientWidth, holder.clientHeight, p.WEBGL).parent(holder);
      p.pixelDensity(1);
    };

    // Draws the bouquet, lights, and floating perfume bubbles every frame.
    p.draw = () => {
      p.background(...palette.background);
      p.orbitControl(1.4, 1.4, 0.08);
      drawLighting();
      drawFlowerBouquet();
      drawPerfumeBubbles();
    };

    // Resizes the canvas when the browser window changes.
    p.windowResized = () => resizeSketchToParent(p, holder);

    // Sets colored lights so the bouquet feels glossy and dimensional.
    function drawLighting() {
      p.ambientLight(42, 6, 54);
      p.directionalLight(255, 142, 232, -0.35, 0.55, -0.8);
      p.pointLight(255, 0, 190, 220, -240, 220);
      p.pointLight(56, 174, 255, -260, 80, 180);
    }

    // Builds a small bouquet with several flower heads and converging stems.
    function drawFlowerBouquet() {
      const flowers = [
        { x: 0, y: -88, z: 18, scale: 1, tilt: 0, hue: 0 },
        { x: -72, y: -48, z: -8, scale: 0.78, tilt: -0.34, hue: 1 },
        { x: 72, y: -42, z: -16, scale: 0.82, tilt: 0.32, hue: 2 },
        { x: -36, y: 4, z: 22, scale: 0.64, tilt: -0.18, hue: 2 },
        { x: 42, y: 10, z: 18, scale: 0.68, tilt: 0.2, hue: 1 }
      ];

      p.push();
      p.rotateZ(p.sin(p.frameCount * 0.018) * 0.04);

      for (const flower of flowers) {
        drawSingleFlower(flower);
      }

      // The binding ring visually gathers the separate stems into one bouquet.
      p.push();
      p.translate(0, 122, 0);
      p.rotateX(p.HALF_PI);
      p.noFill();
      p.stroke(255, 142, 232, 180);
      p.strokeWeight(2);
      p.torus(38, 2, 48, 6);
      p.pop();

      // Extra leaves make the lower part feel fuller and more botanical.
      drawLeaf(-58, 82, -0.92, 0.95);
      drawLeaf(64, 78, 0.86, 0.95);
      drawLeaf(-24, 124, -0.42, 0.7);
      drawLeaf(28, 120, 0.45, 0.7);

      p.pop();
    }

    // Draws one flower head and its stem.
    function drawSingleFlower(flower) {
      const stemBase = p.createVector(0, 150, 0);
      const head = p.createVector(flower.x, flower.y, flower.z);
      const stemTop = p.createVector(flower.x * 0.72, flower.y + 48 * flower.scale, flower.z * 0.5);

      p.push();
      p.rotateZ(flower.tilt + p.sin(p.frameCount * 0.012 + flower.x) * 0.03);
      drawStemBetween(stemBase, stemTop, 5.2 * flower.scale);

      // Petals are flattened ellipsoids arranged radially around the flower center.
      for (let i = 0; i < 9; i++) {
        const angle = i * p.TWO_PI / 9 + p.sin(p.frameCount * 0.01 + flower.x) * 0.035;
        const petalX = head.x + p.cos(angle) * 42 * flower.scale;
        const petalY = head.y + p.sin(angle) * 31 * flower.scale;

        p.push();
        p.translate(petalX, petalY, head.z + 8 + p.sin(angle) * 7);
        p.rotateZ(angle);
        p.rotateY(p.sin(p.frameCount * 0.012 + i + flower.x) * 0.12);
        if (flower.hue === 0) {
          p.specularMaterial(255, 94, 213);
        } else if (flower.hue === 1) {
          p.specularMaterial(255, 142, 232);
        } else {
          p.specularMaterial(185, 128, 255);
        }
        p.shininess(54);
        p.scale(1.45 * flower.scale, 0.58 * flower.scale, 0.14 * flower.scale);
        p.ellipsoid(30, 30, 30, 28, 14);
        p.pop();
      }

      // The center is a glowing spherical data-like node.
      p.push();
      p.translate(head.x, head.y, head.z + 24);
      p.emissiveMaterial(flower.hue === 2 ? palette.blue : palette.neon);
      p.sphere((15 + p.sin(p.frameCount * 0.04 + flower.x) * 1.2) * flower.scale, 24, 14);
      p.pop();

      p.pop();
    }

    // Draws one stem as a cylinder between two 3D points.
    function drawStemBetween(start, end, radius) {
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
      p.specularMaterial(58, 210, 176);
      p.shininess(42);
      p.cylinder(radius, length, 18, 6);
      p.pop();
    }

    // Draws a leaf as a flattened ellipsoid attached to the bouquet.
    function drawLeaf(x, y, rotation, leafScale = 1) {
      p.push();
      p.translate(x, y, 0);
      p.rotateZ(rotation);
      p.rotateY(0.28);
      p.specularMaterial(42, 164, 148);
      p.shininess(34);
      p.scale(1.7 * leafScale, 0.48 * leafScale, 0.14 * leafScale);
      p.ellipsoid(30, 30, 30, 28, 12);
      p.pop();
    }

    // Draws many tiny sparkling bubbles around the petals like visible perfume.
    function drawPerfumeBubbles() {
      p.noStroke();
      for (let i = 0; i < 76; i++) {
        const ring = i % 4;
        const a = i * 1.618 + p.frameCount * (0.003 + ring * 0.0008);
        const drift = p.sin(p.frameCount * 0.015 + i * 0.7);
        const radius = 52 + ring * 27 + p.sin(i * 2.1) * 13;
        const x = p.cos(a) * radius + p.sin(i * 0.9) * 18;
        const y = -58 + p.sin(a * 1.4 + i) * 54 - ring * 8 + drift * 4;
        const z = p.sin(a) * 42 + p.cos(i * 0.6) * 18;
        const bubbleSize = 2.2 + (i % 6) * 0.72 + p.sin(p.frameCount * 0.04 + i) * 0.45;
        const sparkle = p.map(p.sin(p.frameCount * 0.055 + i * 1.9), -1, 1, 0.45, 1);

        p.push();
        p.translate(x, y, z);
        if (i % 5 === 0) {
          p.emissiveMaterial(56 * sparkle, 174 * sparkle, 255 * sparkle);
        } else if (i % 3 === 0) {
          p.emissiveMaterial(255 * sparkle, 209 * sparkle, 244 * sparkle);
        } else {
          p.emissiveMaterial(255 * sparkle, 142 * sparkle, 232 * sparkle);
        }
        p.sphere(bubbleSize, 10, 8);
        p.pop();
      }
    }
  });
})();
