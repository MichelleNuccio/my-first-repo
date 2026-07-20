(() => {                                                                                        // Start a private little code room so names do not leak outside.
  const palette = {                                                                             // Save the color palette used by this sketch.
    background: [9, 1, 15],                                                                     // Do this step to build the drawing.
    neon: [255, 0, 190],                                                                        // Do this step to build the drawing.
    soft: [255, 142, 232],                                                                      // Do this step to build the drawing.
    pale: [255, 209, 244],                                                                      // Do this step to build the drawing.
    blue: [56, 174, 255]                                                                        // Do this step to build the drawing.
  };                                                                                            // Close this object or function part.

  function resizeSketchToParent(p, parentElement) {                                             // Make a helper that fits the canvas inside its HTML box.
    if (!parentElement) return;                                                                 // 'if' checks a yes-or-no condition before doing something.
    p.resizeCanvas(parentElement.clientWidth, parentElement.clientHeight);                      // Change the canvas size to match its HTML holder.
  }                                                                                             // Close this small group of instructions.

  new p5((p) => {                                                                               // Create a new p5 drawing; 'p' is the toolbox for this canvas.
    let holder;                                                                                 // 'holder' remembers the HTML box that will contain this canvas.

    p.setup = () => {                                                                           // This runs once when this canvas starts.
      holder = document.getElementById("portrait-canvas");                                      // Find the HTML element with this exact id.
      p.createCanvas(holder.clientWidth, holder.clientHeight, p.WEBGL).parent(holder);          // Create a 3D p5 canvas inside the HTML holder.
      p.pixelDensity(1);                                                                        // Choose canvas sharpness; 1 is usually faster.
    };                                                                                          // Close this object or function part.

    p.draw = () => {                                                                            // This runs again and again to animate the canvas.
      p.background(...palette.background);                                                      // Paint the whole canvas before drawing the next frame.
      p.orbitControl(1.4, 1.4, 0.08);                                                           // Let the user rotate and zoom the 3D scene with the mouse.
      drawLighting();                                                                           // Do this step to build the drawing.
      drawFlowerBouquet();                                                                      // Do this step to build the drawing.
      drawPerfumeBubbles();                                                                     // Do this step to build the drawing.
    };                                                                                          // Close this object or function part.

    p.windowResized = () => resizeSketchToParent(p, holder);                                    // When the browser changes size, resize this canvas too.

    function drawLighting() {                                                                   // Start a helper that adds 3D lights.
      p.ambientLight(42, 6, 54);                                                                // Add soft light everywhere in the 3D scene.
      p.directionalLight(255, 142, 232, -0.35, 0.55, -0.8);                                     // Add light that shines from one direction.
      p.pointLight(255, 0, 190, 220, -240, 220);                                                // Add a light that shines from one point in 3D space.
      p.pointLight(56, 174, 255, -260, 80, 180);                                                // Add a light that shines from one point in 3D space.
    }                                                                                           // Close this small group of instructions.

    function drawFlowerBouquet() {                                                              // Start a helper that draws the flower or bouquet.
      const flowers = [                                                                         // 'const' saves a value that should stay the same for this step.
        { x: 0, y: -88, z: 18, scale: 1, tilt: 0, hue: 0 },                                     // Do this step to build the drawing.
        { x: -72, y: -48, z: -8, scale: 0.78, tilt: -0.34, hue: 1 },                            // Do this step to build the drawing.
        { x: 72, y: -42, z: -16, scale: 0.82, tilt: 0.32, hue: 2 },                             // Do this step to build the drawing.
        { x: -36, y: 4, z: 22, scale: 0.64, tilt: -0.18, hue: 2 },                              // Do this step to build the drawing.
        { x: 42, y: 10, z: 18, scale: 0.68, tilt: 0.2, hue: 1 }                                 // Do this step to build the drawing.
      ];                                                                                        // Close this list.

      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.rotateZ(p.sin(p.frameCount * 0.018) * 0.04);                                            // Rotate the 3D shape around the z axis.

      for (const flower of flowers) {                                                           // 'for' repeats these steps many times.
        drawSingleFlower(flower);                                                               // Do this step to build the drawing.
      }                                                                                         // Close this small group of instructions.

      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(0, 122, 0);                                                                   // Move the drawing origin to a new place.
      p.rotateX(p.HALF_PI);                                                                     // Rotate the 3D shape around the x axis.
      p.noFill();                                                                               // Draw only outlines, with no inside color.
      p.stroke(255, 142, 232, 180);                                                             // Choose the outline color; numbers are red, green, blue, alpha.
      p.strokeWeight(2);                                                                        // Choose how thick the outline line is.
      p.torus(38, 2, 48, 6);                                                                    // Draw a 3D ring shape.
      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.

      drawLeaf(-58, 82, -0.92, 0.95);                                                           // Do this step to build the drawing.
      drawLeaf(64, 78, 0.86, 0.95);                                                             // Do this step to build the drawing.
      drawLeaf(-24, 124, -0.42, 0.7);                                                           // Do this step to build the drawing.
      drawLeaf(28, 120, 0.45, 0.7);                                                             // Do this step to build the drawing.

      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
    }                                                                                           // Close this small group of instructions.

    function drawSingleFlower(flower) {                                                         // Start a reusable helper recipe.
      const stemBase = p.createVector(0, 150, 0);                                               // Save a moving number used for animation.
      const head = p.createVector(flower.x, flower.y, flower.z);                                // Save an angle used for rotation or circular placement.
      const stemTop = p.createVector(flower.x * 0.72, flower.y + 48 * flower.scale, flower.z * 0.5); // Save a moving number used for animation.

      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.rotateZ(flower.tilt + p.sin(p.frameCount * 0.012 + flower.x) * 0.03);                   // Rotate the 3D shape around the z axis.
      drawStemBetween(stemBase, stemTop, 5.2 * flower.scale);                                   // Do this step to build the drawing.

      for (let i = 0; i < 9; i++) {                                                             // 'for' repeats these steps many times.
        const angle = i * p.TWO_PI / 9 + p.sin(p.frameCount * 0.01 + flower.x) * 0.035;         // Save an angle used for rotation or circular placement.
        const petalX = head.x + p.cos(angle) * 42 * flower.scale;                               // Save a moving number used for animation.
        const petalY = head.y + p.sin(angle) * 31 * flower.scale;                               // Save a moving number used for animation.

        p.push();                                                                               // Save the current drawing position, rotation, and style.
        p.translate(petalX, petalY, head.z + 8 + p.sin(angle) * 7);                             // Move the drawing origin to a new place.
        p.rotateZ(angle);                                                                       // Rotate the 3D shape around the z axis.
        p.rotateY(p.sin(p.frameCount * 0.012 + i + flower.x) * 0.12);                           // Rotate the 3D shape around the y axis.
        if (flower.hue === 0) {                                                                 // 'if' checks a yes-or-no condition before doing something.
          p.specularMaterial(255, 94, 213);                                                     // Choose a shiny material for 3D shapes.
        } else if (flower.hue === 1) {                                                          // Do this step to build the drawing.
          p.specularMaterial(255, 142, 232);                                                    // Choose a shiny material for 3D shapes.
        } else {                                                                                // Do this step to build the drawing.
          p.specularMaterial(185, 128, 255);                                                    // Choose a shiny material for 3D shapes.
        }                                                                                       // Close this small group of instructions.
        p.shininess(54);                                                                        // Choose how glossy the 3D material looks.
        p.scale(1.45 * flower.scale, 0.58 * flower.scale, 0.14 * flower.scale);                 // Make the next shape bigger or smaller.
        p.ellipsoid(30, 30, 30, 28, 14);                                                        // Do this step to build the drawing.
        p.pop();                                                                                // Restore the saved drawing position, rotation, and style.
      }                                                                                         // Close this small group of instructions.

      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(head.x, head.y, head.z + 24);                                                 // Move the drawing origin to a new place.
      p.emissiveMaterial(flower.hue === 2 ? palette.blue : palette.neon);                       // Do this step to build the drawing.
      p.sphere((15 + p.sin(p.frameCount * 0.04 + flower.x) * 1.2) * flower.scale, 24, 14);      // Draw a 3D ball.
      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.

      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
    }                                                                                           // Close this small group of instructions.

    function drawStemBetween(start, end, radius) {                                              // Start a reusable helper recipe.
      const direction = p5.Vector.sub(end, start);                                              // Save a moving number used for animation.
      const midpoint = p5.Vector.add(start, end).mult(0.5);                                     // Save a moving number used for animation.
      const length = direction.mag();                                                           // Save a moving number used for animation.
      const yAxis = p.createVector(0, 1, 0);                                                    // Save an angle used for rotation or circular placement.
      const axis = yAxis.cross(direction);                                                      // Save an angle used for rotation or circular placement.
      const angle = yAxis.angleBetween(direction);                                              // Save an angle used for rotation or circular placement.

      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(midpoint.x, midpoint.y, midpoint.z);                                          // Move the drawing origin to a new place.
      if (axis.mag() > 0.0001) {                                                                // 'if' checks a yes-or-no condition before doing something.
        p.rotate(angle, [axis.x, axis.y, axis.z]);                                              // Rotate the 2D drawing direction.
      }                                                                                         // Close this small group of instructions.
      p.specularMaterial(58, 210, 176);                                                         // Choose a shiny material for 3D shapes.
      p.shininess(42);                                                                          // Choose how glossy the 3D material looks.
      p.cylinder(radius, length, 18, 6);                                                        // Draw a 3D cylinder.
      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
    }                                                                                           // Close this small group of instructions.

    function drawLeaf(x, y, rotation, leafScale = 1) {                                          // Start a helper that draws leaves.
      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(x, y, 0);                                                                     // Move the drawing origin to a new place.
      p.rotateZ(rotation);                                                                      // Rotate the 3D shape around the z axis.
      p.rotateY(0.28);                                                                          // Rotate the 3D shape around the y axis.
      p.specularMaterial(42, 164, 148);                                                         // Choose a shiny material for 3D shapes.
      p.shininess(34);                                                                          // Choose how glossy the 3D material looks.
      p.scale(1.7 * leafScale, 0.48 * leafScale, 0.14 * leafScale);                             // Make the next shape bigger or smaller.
      p.ellipsoid(30, 30, 30, 28, 12);                                                          // Do this step to build the drawing.
      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
    }                                                                                           // Close this small group of instructions.

    function drawPerfumeBubbles() {                                                             // Start a helper that draws floating signal or perfume details.
      p.noStroke();                                                                             // Draw without an outline.
      for (let i = 0; i < 76; i++) {                                                            // 'for' repeats these steps many times.
        const ring = i % 4;                                                                     // 'const' saves a value that should stay the same for this step.
        const a = i * 1.618 + p.frameCount * (0.003 + ring * 0.0008);                           // Save an angle used for rotation or circular placement.
        const drift = p.sin(p.frameCount * 0.015 + i * 0.7);                                    // Save a moving number used for animation.
        const radius = 52 + ring * 27 + p.sin(i * 2.1) * 13;                                    // Save an angle used for rotation or circular placement.
        const x = p.cos(a) * radius + p.sin(i * 0.9) * 18;                                      // Save the left-right position.
        const y = -58 + p.sin(a * 1.4 + i) * 54 - ring * 8 + drift * 4;                         // Save the up-down position.
        const z = p.sin(a) * 42 + p.cos(i * 0.6) * 18;                                          // 'const' saves a value that should stay the same for this step.
        const bubbleSize = 2.2 + (i % 6) * 0.72 + p.sin(p.frameCount * 0.04 + i) * 0.45;        // 'const' saves a value that should stay the same for this step.
        const sparkle = p.map(p.sin(p.frameCount * 0.055 + i * 1.9), -1, 1, 0.45, 1);           // Save an angle used for rotation or circular placement.

        p.push();                                                                               // Save the current drawing position, rotation, and style.
        p.translate(x, y, z);                                                                   // Move the drawing origin to a new place.
        if (i % 5 === 0) {                                                                      // 'if' checks a yes-or-no condition before doing something.
          p.emissiveMaterial(56 * sparkle, 174 * sparkle, 255 * sparkle);                       // Do this step to build the drawing.
        } else if (i % 3 === 0) {                                                               // Do this step to build the drawing.
          p.emissiveMaterial(255 * sparkle, 209 * sparkle, 244 * sparkle);                      // Do this step to build the drawing.
        } else {                                                                                // Do this step to build the drawing.
          p.emissiveMaterial(255 * sparkle, 142 * sparkle, 232 * sparkle);                      // Do this step to build the drawing.
        }                                                                                       // Close this small group of instructions.
        p.sphere(bubbleSize, 10, 8);                                                            // Draw a 3D ball.
        p.pop();                                                                                // Restore the saved drawing position, rotation, and style.
      }                                                                                         // Close this small group of instructions.
    }                                                                                           // Close this small group of instructions.
  });                                                                                           // Close this p5 sketch.
})();                                                                                           // Run this private code room now.
