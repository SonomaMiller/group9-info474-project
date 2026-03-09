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

            // --- Configuration ---
            // Only update the frame count if the space bar (key code 32) is NOT pressed
            if (!p.keyIsDown(32)) {
                this.currentFrame = (this.currentFrame || 0) + 1;
            }

            let rotAngle = (this.currentFrame || 0) * 0.01;
            let viewScale = 0.7;
            const boxSize = 300;
            const halfBox = boxSize / 2;

            // Manual 3D to 2D Projection
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

            // --- 1. Draw Bounding Box & Ticks ---
            p.stroke(220);
            p.strokeWeight(1);

            for (let t = 0; t <= 1; t += 0.25) {
                let val = t * boxSize;

                let tx1 = project(val, boxSize, 0);
                let tx2 = project(val, boxSize + 10, 0);
                p.line(tx1.x, tx1.y, tx2.x, tx2.y);

                let ty1 = project(0, val, 0);
                let ty2 = project(-10, val, 0);
                p.line(ty1.x, ty1.y, ty2.x, ty2.y);

                let tz1 = project(0, boxSize, val);
                let tz2 = project(0, boxSize + 10, val);
                p.line(tz1.x, tz1.y, tz2.x, tz2.y);
            }

            // --- 2. Axis Labels (Min/Max) ---
            p.fill(120);
            p.noStroke();
            p.textSize(10);
            p.textAlign(p.CENTER);

            let yStart = project(0, boxSize + 20, 0);
            let yEnd = project(boxSize, boxSize + 20, 0);
            p.text("1895", yStart.x, yStart.y);
            p.text("2026", yEnd.x, yEnd.y);

            let pStart = project(-25, boxSize, 0);
            let pEnd = project(-25, 0, 0);
            p.text("0\"", pStart.x, pStart.y);
            p.text("80\"", pEnd.x, pEnd.y);

            let tStart = project(0, boxSize + 20, 0);
            let tEnd = project(0, boxSize + 20, boxSize);
            p.text("35°F", tStart.x - 20, tStart.y + 10);
            p.text("50.1°F", tEnd.x, tEnd.y + 10);

            // --- 3. Main Axis Titles ---
            p.textSize(14);
            p.fill(0);
            let titleYear = project(halfBox, boxSize + 45, 0);
            p.text("YEAR", titleYear.x, titleYear.y);

            let titleTemp = project(0, boxSize + 45, halfBox);
            p.text("TEMP", titleTemp.x, titleTemp.y);

            p.push();
            let titlePrecip = project(-50, halfBox, 0);
            p.translate(titlePrecip.x, titlePrecip.y);
            p.rotate(-p.HALF_PI);
            p.text("PRECIPITATION", 0, 0);
            p.pop();

            // --- 4. The 3D Line ---
            p.strokeWeight(2);
            let lastPos = null;

            for (let i = 0; i < rowCount; i++) {
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let year = parseInt(dateStr.split('-')[1]);
                let tempF = tempTable.getNum(i, 1);
                let precipInches = precipTable.getNum(i, 1);

                let x3 = p.map(year, 1895, 2026, 0, boxSize);
                let y3 = p.map(precipInches, 0, 80, boxSize, 0);
                let z3 = p.map(tempF, 35, 50.1, 0, boxSize);

                let pos = project(x3, y3, z3);

                if (lastPos && !isNaN(pos.x) && !isNaN(pos.y)) {
                    let colAmt = p.map(tempF, 35, 50.1, 0, 1);
                    let c = p.lerpColor(p.color(0, 100, 255), p.color(255, 50, 0), p.constrain(colAmt, 0, 1));

                    p.stroke(c);
                    p.line(lastPos.x, lastPos.y, pos.x, pos.y);
                }
                lastPos = pos;
            }

            // Pause Indicator
            if (p.keyIsDown(32)) {
                p.fill(0, 150);
                p.noStroke();
                p.text("PAUSED", w - 50, 30);
            }
        }
    };
})();
