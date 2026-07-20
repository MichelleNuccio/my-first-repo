(() => {                                                                                        // Start a private little code room so names do not leak outside.

  function resizeSketchToParent(p, parentElement) {                                             // Make a helper that fits the canvas inside its HTML box.
    if (!parentElement) return;                                                                 // 'if' checks a yes-or-no condition before doing something.
    p.resizeCanvas(parentElement.clientWidth, parentElement.clientHeight);                      // Change the canvas size to match its HTML holder.
  }                                                                                             // Close this small group of instructions.

  new p5((p) => {                                                                               // Create a new p5 drawing; 'p' is the toolbox for this canvas.
    let holder;                                                                                 // 'holder' remembers the HTML box that will contain this canvas.

    p.setup = () => {                                                                           // This runs once when this canvas starts.
      holder = document.getElementById("flower-illustration-b");                                // Find the HTML element with this exact id.
      p.createCanvas(holder.clientWidth, holder.clientHeight).parent(holder);                   // Create a 2D p5 canvas inside the HTML holder.
      p.pixelDensity(1);                                                                        // Choose canvas sharpness; 1 is usually faster.
    };                                                                                          // Close this object or function part.

    p.draw = () => {                                                                            // This runs again and again to animate the canvas.
      p.background(7, 0, 12);                                                                   // Paint the whole canvas before drawing the next frame.
      drawSoft2DGrid(p);                                                                        // Do this step to build the drawing.
      drawNightBouquet();                                                                       // Do this step to build the drawing.
      drawPerfumeDots2D();                                                                      // Do this step to build the drawing.
    };                                                                                          // Close this object or function part.

    p.windowResized = () => resizeSketchToParent(p, holder);                                    // When the browser changes size, resize this canvas too.

    function drawNightBouquet() {                                                               // Start a helper that draws the flower or bouquet.
      const cx = p.width * 0.5;                                                                 // 'cx' means the center x position of the canvas.
      const cy = p.height * 0.48;                                                               // 'cy' means the center y position of the canvas.
      const flowers = [                                                                         // 'const' saves a value that should stay the same for this step.
        { x: -72, y: -8, s: 0.82, petals: 8, hue: 0 },                                          // Do this step to build the drawing.
        { x: 0, y: -46, s: 1.05, petals: 9, hue: 1 },                                           // Do this step to build the drawing.
        { x: 74, y: -4, s: 0.78, petals: 8, hue: 2 },                                           // Do this step to build the drawing.
        { x: -30, y: 34, s: 0.62, petals: 7, hue: 2 },                                          // Do this step to build the drawing.
        { x: 38, y: 38, s: 0.66, petals: 7, hue: 0 }                                            // Do this step to build the drawing.
      ];                                                                                        // Close this list.

      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(cx, cy);                                                                      // Move the drawing origin to a new place.

      for (const flower of flowers) {                                                           // 'for' repeats these steps many times.
        p.stroke(255, 0, 190, 70);                                                              // Choose the outline color; numbers are red, green, blue, alpha.
        p.noFill();                                                                             // Draw only outlines, with no inside color.
        p.strokeWeight(3 * flower.s);                                                           // Choose how thick the outline line is.
        p.bezier(0, 210, flower.x * 0.18, 132, flower.x * 0.65, 72, flower.x, flower.y + 34);   // Draw a smooth curve using four points.
        p.stroke(255, 209, 244, 150);                                                           // Choose the outline color; numbers are red, green, blue, alpha.
        p.strokeWeight(1.5 * flower.s);                                                         // Choose how thick the outline line is.
        p.bezier(0, 210, flower.x * 0.18, 132, flower.x * 0.65, 72, flower.x, flower.y + 34);   // Draw a smooth curve using four points.
      }                                                                                         // Close this small group of instructions.

      drawNightLeaf(-58, 120, -0.55, 0.85);                                                     // Do this step to build the drawing.
      drawNightLeaf(56, 132, 0.52, 0.75);                                                       // Do this step to build the drawing.
      drawNightLeaf(-16, 160, -0.28, 0.62);                                                     // Do this step to build the drawing.

      for (const flower of flowers) {                                                           // 'for' repeats these steps many times.
        drawNightFlowerHead(flower);                                                            // Do this step to build the drawing.
      }                                                                                         // Close this small group of instructions.

      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
    }                                                                                           // Close this small group of instructions.

    function drawNightFlowerHead(flower) {                                                      // Start a reusable helper recipe.
      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(flower.x, flower.y);                                                          // Move the drawing origin to a new place.

      for (let i = 0; i < flower.petals; i++) {                                                 // 'for' repeats these steps many times.
        const a = i * p.TWO_PI / flower.petals - p.HALF_PI;                                     // Save an angle used for rotation or circular placement.
        const wobble = p.sin(p.frameCount * 0.018 + i + flower.x) * 3;                          // 'const' saves a value that should stay the same for this step.
        p.push();                                                                               // Save the current drawing position, rotation, and style.
        p.rotate(a);                                                                            // Rotate the 2D drawing direction.
        p.noFill();                                                                             // Draw only outlines, with no inside color.
        p.stroke(255, 0, 190, 120);                                                             // Choose the outline color; numbers are red, green, blue, alpha.
        p.strokeWeight(2.6 * flower.s);                                                         // Choose how thick the outline line is.
        p.ellipse((42 + wobble) * flower.s, 0, 102 * flower.s, 31 * flower.s);                  // Draw an oval.
        if (flower.hue === 0) {                                                                 // 'if' checks a yes-or-no condition before doing something.
          p.stroke(255, 142, 232, 210);                                                         // Choose the outline color; numbers are red, green, blue, alpha.
        } else if (flower.hue === 1) {                                                          // Do this step to build the drawing.
          p.stroke(255, 80, 210, 215);                                                          // Choose the outline color; numbers are red, green, blue, alpha.
        } else {                                                                                // Do this step to build the drawing.
          p.stroke(116, 195, 255, 190);                                                         // Choose the outline color; numbers are red, green, blue, alpha.
        }                                                                                       // Close this small group of instructions.
        p.strokeWeight(1.2 * flower.s);                                                         // Choose how thick the outline line is.
        p.ellipse((39 + wobble) * flower.s, 0, 72 * flower.s, 20 * flower.s);                   // Draw an oval.
        p.pop();                                                                                // Restore the saved drawing position, rotation, and style.
      }                                                                                         // Close this small group of instructions.

      p.noFill();                                                                               // Draw only outlines, with no inside color.
      p.stroke(flower.hue === 2 ? 56 : 255, flower.hue === 2 ? 174 : 235, flower.hue === 2 ? 255 : 250, 230); // Choose the outline color; numbers are red, green, blue, alpha.
      p.strokeWeight(2);                                                                        // Choose how thick the outline line is.
      p.circle(0, 0, 31 * flower.s);                                                            // Draw a circle.
      p.stroke(255, 0, 190, 180);                                                               // Choose the outline color; numbers are red, green, blue, alpha.
      p.strokeWeight(1);                                                                        // Choose how thick the outline line is.
      p.circle(7 * flower.s, -6 * flower.s, 8 * flower.s);                                      // Draw a circle.
      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
    }                                                                                           // Close this small group of instructions.

    function drawNightLeaf(x, y, rotation, leafScale) {                                         // Start a reusable helper recipe.
      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(x, y);                                                                        // Move the drawing origin to a new place.
      p.rotate(rotation);                                                                       // Rotate the 2D drawing direction.
      p.noFill();                                                                               // Draw only outlines, with no inside color.
      p.stroke(110, 255, 226, 95);                                                              // Choose the outline color; numbers are red, green, blue, alpha.
      p.strokeWeight(1.4);                                                                      // Choose how thick the outline line is.
      p.ellipse(0, 0, 88 * leafScale, 24 * leafScale);                                          // Draw an oval.
      p.line(-30 * leafScale, 0, 30 * leafScale, 0);                                            // Draw a straight line.
      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
    }                                                                                           // Close this small group of instructions.

    function drawPerfumeDots2D() {                                                              // Start a helper that draws floating signal or perfume details.
      p.noFill();                                                                               // Draw only outlines, with no inside color.
      for (let i = 0; i < 64; i++) {                                                            // 'for' repeats these steps many times.
        const a = i * 1.37 + p.frameCount * 0.008;                                              // Save an angle used for rotation or circular placement.
        const radius = 62 + (i % 7) * 19;                                                       // Save an angle used for rotation or circular placement.
        const x = p.width * 0.5 + p.cos(a) * radius;                                            // Save the left-right position.
        const y = p.height * 0.43 + p.sin(a * 1.35) * radius * 0.55;                            // Save the up-down position.
        const twinkle = p.map(p.sin(p.frameCount * 0.07 + i), -1, 1, 55, 220);                  // Save a moving number used for animation.
        p.stroke(i % 5 === 0 ? 56 : 255, i % 5 === 0 ? 174 : 209, i % 5 === 0 ? 255 : 244, twinkle); // Choose the outline color; numbers are red, green, blue, alpha.
        p.strokeWeight(1);                                                                      // Choose how thick the outline line is.
        p.circle(x, y, 2 + (i % 4));                                                            // Draw a circle.
      }                                                                                         // Close this small group of instructions.
    }                                                                                           // Close this small group of instructions.
  });                                                                                           // Close this p5 sketch.

  function drawSoft2DGrid(p) {                                                                  // Start a helper that draws the soft background grid.
    p.stroke(255, 0, 190, 18);                                                                  // Choose the outline color; numbers are red, green, blue, alpha.
    p.strokeWeight(1);                                                                          // Choose how thick the outline line is.
    for (let x = 0; x <= p.width; x += 36) {                                                    // 'for' repeats these steps many times.
      p.line(x, 0, x, p.height);                                                                // Draw a straight line.
    }                                                                                           // Close this small group of instructions.
    for (let y = 0; y <= p.height; y += 36) {                                                   // 'for' repeats these steps many times.
      p.line(0, y, p.width, y);                                                                 // Draw a straight line.
    }                                                                                           // Close this small group of instructions.
  }                                                                                             // Close this small group of instructions.
})();                                                                                           // Run this private code room now.
