(() => {                                                                                        // Start a private little code room so names do not leak outside.

  function resizeSketchToParent(p, parentElement) {                                             // Make a helper that fits the canvas inside its HTML box.
    if (!parentElement) return;                                                                 // 'if' checks a yes-or-no condition before doing something.
    p.resizeCanvas(parentElement.clientWidth, parentElement.clientHeight);                      // Change the canvas size to match its HTML holder.
  }                                                                                             // Close this small group of instructions.

  new p5((p) => {                                                                               // Create a new p5 drawing; 'p' is the toolbox for this canvas.
    let holder;                                                                                 // 'holder' remembers the HTML box that will contain this canvas.

    p.setup = () => {                                                                           // This runs once when this canvas starts.
      holder = document.getElementById("flower-illustration-a");                                // Find the HTML element with this exact id.
      p.createCanvas(holder.clientWidth, holder.clientHeight).parent(holder);                   // Create a 2D p5 canvas inside the HTML holder.
      p.pixelDensity(1);                                                                        // Choose canvas sharpness; 1 is usually faster.
    };                                                                                          // Close this object or function part.

    p.draw = () => {                                                                            // This runs again and again to animate the canvas.
      p.background(9, 1, 15);                                                                   // Paint the whole canvas before drawing the next frame.
      drawSoft2DGrid(p);                                                                        // Do this step to build the drawing.
      drawSignalFlower();                                                                       // Do this step to build the drawing.
      drawSignalLines();                                                                        // Do this step to build the drawing.
    };                                                                                          // Close this object or function part.

    p.windowResized = () => resizeSketchToParent(p, holder);                                    // When the browser changes size, resize this canvas too.

    function drawSignalFlower() {                                                               // Start a helper that draws floating signal or perfume details.
      const cx = p.width * 0.5;                                                                 // 'cx' means the center x position of the canvas.
      const cy = p.height * 0.45;                                                               // 'cy' means the center y position of the canvas.
      const pulse = p.sin(p.frameCount * 0.025) * 4;                                            // Save a moving number used for animation.

      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(cx, cy);                                                                      // Move the drawing origin to a new place.

      p.stroke(255, 0, 190, 150);                                                               // Choose the outline color; numbers are red, green, blue, alpha.
      p.strokeWeight(2);                                                                        // Choose how thick the outline line is.
      p.noFill();                                                                               // Draw only outlines, with no inside color.
      p.bezier(0, 55, -24, 118, 20, 190, -6, 260);                                              // Draw a smooth curve using four points.

      for (let i = 0; i < 12; i++) {                                                            // 'for' repeats these steps many times.
        const a = i * p.TWO_PI / 12 + p.sin(p.frameCount * 0.01) * 0.025;                       // Save an angle used for rotation or circular placement.
        p.push();                                                                               // Save the current drawing position, rotation, and style.
        p.rotate(a);                                                                            // Rotate the 2D drawing direction.
        p.noStroke();                                                                           // Draw without an outline.
        p.fill(255, i % 2 === 0 ? 92 : 142, 224, 145);                                          // Choose the inside color; the last number can be transparency.
        p.ellipse(42 + pulse, 0, 84, 26);                                                       // Draw an oval.
        p.stroke(255, 209, 244, 120);                                                           // Choose the outline color; numbers are red, green, blue, alpha.
        p.strokeWeight(1);                                                                      // Choose how thick the outline line is.
        p.noFill();                                                                             // Draw only outlines, with no inside color.
        p.ellipse(42 + pulse, 0, 84, 26);                                                       // Draw an oval.
        p.pop();                                                                                // Restore the saved drawing position, rotation, and style.
      }                                                                                         // Close this small group of instructions.

      p.noStroke();                                                                             // Draw without an outline.
      p.fill(255, 0, 190, 230);                                                                 // Choose the inside color; the last number can be transparency.
      p.circle(0, 0, 42);                                                                       // Draw a circle.
      p.fill(255, 209, 244, 170);                                                               // Choose the inside color; the last number can be transparency.
      p.circle(-8, -8, 10);                                                                     // Draw a circle.

      drawIllustratedLeaf(-42, 138, -0.75, 1);                                                  // Do this step to build the drawing.
      drawIllustratedLeaf(46, 172, 0.72, 0.82);                                                 // Do this step to build the drawing.
      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
    }                                                                                           // Close this small group of instructions.

    function drawSignalLines() {                                                                // Start a helper that draws floating signal or perfume details.
      p.noFill();                                                                               // Draw only outlines, with no inside color.
      for (let i = 0; i < 6; i++) {                                                             // 'for' repeats these steps many times.
        const y = p.height * 0.25 + i * 42 + p.sin(p.frameCount * 0.015 + i) * 8;               // Save the up-down position.
        p.stroke(i % 2 === 0 ? 255 : 56, i % 2 === 0 ? 0 : 174, i % 2 === 0 ? 190 : 255, 40);   // Choose the outline color; numbers are red, green, blue, alpha.
        p.strokeWeight(1);                                                                      // Choose how thick the outline line is.
        p.bezier(36, y, p.width * 0.32, y - 54, p.width * 0.68, y + 54, p.width - 36, y);       // Draw a smooth curve using four points.
      }                                                                                         // Close this small group of instructions.

      p.noStroke();                                                                             // Draw without an outline.
      for (let i = 0; i < 22; i++) {                                                            // 'for' repeats these steps many times.
        const a = i * 0.82 + p.frameCount * 0.01;                                               // Save an angle used for rotation or circular placement.
        const x = p.width * 0.5 + p.cos(a) * (90 + i * 2.5);                                    // Save the left-right position.
        const y = p.height * 0.45 + p.sin(a * 1.4) * 92;                                        // Save the up-down position.
        const glow = p.map(p.sin(p.frameCount * 0.06 + i), -1, 1, 80, 230);                     // Save a transparency value for a glowing effect.
        p.fill(i % 3 === 0 ? 56 : 255, i % 3 === 0 ? 174 : 209, i % 3 === 0 ? 255 : 244, glow); // Choose the inside color; the last number can be transparency.
        p.circle(x, y, 3 + (i % 4));                                                            // Draw a circle.
      }                                                                                         // Close this small group of instructions.
    }                                                                                           // Close this small group of instructions.

    function drawIllustratedLeaf(x, y, rotation, leafScale) {                                   // Start a reusable helper recipe.
      p.push();                                                                                 // Save the current drawing position, rotation, and style.
      p.translate(x, y);                                                                        // Move the drawing origin to a new place.
      p.rotate(rotation);                                                                       // Rotate the 2D drawing direction.
      p.fill(42, 164, 148, 120);                                                                // Choose the inside color; the last number can be transparency.
      p.stroke(110, 255, 226, 130);                                                             // Choose the outline color; numbers are red, green, blue, alpha.
      p.strokeWeight(1.4);                                                                      // Choose how thick the outline line is.
      p.ellipse(0, 0, 82 * leafScale, 25 * leafScale);                                          // Draw an oval.
      p.line(-30 * leafScale, 0, 30 * leafScale, 0);                                            // Draw a straight line.
      p.pop();                                                                                  // Restore the saved drawing position, rotation, and style.
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
