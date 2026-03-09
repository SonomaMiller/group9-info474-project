(function () {
    window.sonoma_3d = {
        draw: function (p, manager, ai, progress) {
            let tempTable = manager.tempTable;
            let precipTable = manager.precipTable;

            if (!tempTable || !precipTable) return;

            p.background(255);

            const w = manager.width;
            const h = manager.height;
            const rowCount = tempTable.getRowCount();

            // --- Pause Logic ---
            if (!p.keyIsDown(32)) {
                this.currentFrame = (this.currentFrame || 0) + 1;
            }

            let rotAngle = (this.currentFrame || 0) * 0.01;
            let viewScale = 0.7;
            const boxSize = 300;
            const halfBox = boxSize / 2;

            const project = (x3d, y3d, z3d) => {
                let cx = x3d - halfBox;
                let cy = y3d - halfBox;
                let cz = z3d - halfBox;
                let rotX = cx * p.cos(rotAngle) - cz * p.sin(rotAngle);
                let rotZ = cx * p.sin(rotAngle) + cz * p.cos(rotAngle);
                let screenX = (w / 2) + (rotX * viewScale);
                let screenY = (h / 2) + (cy * viewScale);
                return { x: screenX, y: screenY, z: rotZ };
            };

            // --- 1. Grey Grids for Axes ---
            p.stroke(235);
            p.strokeWeight(1);
            for (let i = 0; i <= 1; i += 0.1) {
                let d = i * boxSize;
                // Floor Grid (X-Z)
                let f1 = project(d, boxSize, 0); let f2 = project(d, boxSize, boxSize);
                p.line(f1.x, f1.y, f2.x, f2.y);
                let f3 = project(0, boxSize, d); let f4 = project(boxSize, boxSize, d);
                p.line(f3.x, f3.y, f4.x, f4.y);

                // Back Wall Grid (X-Y)
                let b1 = project(d, 0, 0); let b2 = project(d, boxSize, 0);
                p.line(b1.x, b1.y, b2.x, b2.y);
                let b3 = project(0, d, 0); let b4 = project(boxSize, d, 0);
                p.line(b3.x, b3.y, b4.x, b4.y);
            }

            // --- 2. Bounding Box & Ticks ---
            p.stroke(200);
            for (let t = 0; t <= 1; t += 0.25) {
                let val = t * boxSize;
                let tx1 = project(val, boxSize, 0); let tx2 = project(val, boxSize + 10, 0);
                p.line(tx1.x, tx1.y, tx2.x, tx2.y);
                let ty1 = project(0, val, 0); let ty2 = project(-10, val, 0);
                p.line(ty1.x, ty1.y, ty2.x, ty2.y);
                let tz1 = project(0, boxSize, val); let tz2 = project(0, boxSize + 10, val);
                p.line(tz1.x, tz1.y, tz2.x, tz2.y);
            }

            // --- 3. Axis Labels ---
            p.fill(120); p.noStroke(); p.textSize(10); p.textAlign(p.CENTER);
            let yStart = project(0, boxSize + 20, 0); let yEnd = project(boxSize, boxSize + 20, 0);
            p.text("1895", yStart.x, yStart.y); p.text("2026", yEnd.x, yEnd.y);
            let tStart = project(0, boxSize + 20, 0); let tEnd = project(0, boxSize + 20, boxSize);
            p.text("35\u2109", tStart.x - 20, tStart.y + 10); p.text("50.1\u2109", tEnd.x, tEnd.y + 10);

            // --- 4. The 3D Ribbon (Plane) ---
            let lastPos = null;
            let lastFloor = null;

            for (let i = 0; i < rowCount; i++) {
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let year = parseInt(dateStr.split('-')[1]);
                let tempF = tempTable.getNum(i, 1);
                let precipInches = precipTable.getNum(i, 1);

                let x3 = p.map(year, 1895, 2026, 0, boxSize);
                let y3 = p.map(precipInches, 0, 80, boxSize, 0);
                let z3 = p.map(tempF, 35, 50.1, 0, boxSize);

                let currentPos = project(x3, y3, z3);
                let currentFloor = project(x3, boxSize, z3); // Point directly on the floor

                if (lastPos && !isNaN(currentPos.x)) {
                    let colAmt = p.map(tempF, 35, 50.1, 0, 1);
                    let c = p.lerpColor(p.color(0, 100, 255, 150), p.color(255, 50, 0, 150), p.constrain(colAmt, 0, 1));

                    // Draw Plane Segment (Quad)
                    p.fill(c);
                    p.noStroke();
                    p.beginShape();
                    p.vertex(lastPos.x, lastPos.y);
                    p.vertex(currentPos.x, currentPos.y);
                    p.vertex(currentFloor.x, currentFloor.y);
                    p.vertex(lastFloor.x, lastFloor.y);
                    p.endShape(p.CLOSE);

                    // Optional: Draw the top line thicker to define the edge
                    p.stroke(c);
                    p.strokeWeight(1);
                    p.line(lastPos.x, lastPos.y, currentPos.x, currentPos.y);
                }
                lastPos = currentPos;
                lastFloor = currentFloor;
            }

            if (p.keyIsDown(32)) {
                p.fill(0, 150); p.noStroke(); p.text("PAUSED", w - 50, 30);
            }
        }
    };
})();
