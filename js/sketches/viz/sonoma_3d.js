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

            // --- 1. Full Triple-Plane Grid ---
            p.stroke(240);
            p.strokeWeight(1);
            for (let i = 0; i <= 1; i += 0.2) {
                let d = i * boxSize;

                // Floor Grid (Year vs Temperature)
                let f1 = project(d, boxSize, 0); let f2 = project(d, boxSize, boxSize);
                p.line(f1.x, f1.y, f2.x, f2.y);
                let f3 = project(0, boxSize, d); let f4 = project(boxSize, boxSize, d);
                p.line(f3.x, f3.y, f4.x, f4.y);

                // Back Wall Grid (Year vs Precipitation)
                let b1 = project(d, 0, 0); let b2 = project(d, boxSize, 0);
                p.line(b1.x, b1.y, b2.x, b2.y);
                let b3 = project(0, d, 0); let b4 = project(boxSize, d, 0);
                p.line(b3.x, b3.y, b4.x, b4.y);

                // Side Wall Grid (Temp vs Precipitation)
                let s1 = project(0, d, 0); let s2 = project(0, d, boxSize);
                p.line(s1.x, s1.y, s2.x, s2.y);
                let s3 = project(0, 0, d); let s4 = project(0, boxSize, d);
                p.line(s3.x, s3.y, s4.x, s4.y);
            }

            // --- 2. Axis Ticks & Bounding Box ---
            p.stroke(180);
            for (let t = 0; t <= 1; t += 0.5) {
                let v = t * boxSize;
                // Year Ticks
                let tx1 = project(v, boxSize, 0); let tx2 = project(v, boxSize + 8, 0);
                p.line(tx1.x, tx1.y, tx2.x, tx2.y);
                // Precip Ticks
                let ty1 = project(0, v, 0); let ty2 = project(-8, v, 0);
                p.line(ty1.x, ty1.y, ty2.x, ty2.y);
                // Temp Ticks
                let tz1 = project(0, boxSize, v); let tz2 = project(0, boxSize + 8, v);
                p.line(tz1.x, tz1.y, tz2.x, tz2.y);
            }

            // --- 3. Bold Titles & Labels ---
            p.noStroke();
            p.textAlign(p.CENTER);

            // Sub-labels (Min/Mid/Max)
            p.fill(150); p.textSize(9);
            // Year
            let yL1 = project(0, boxSize+15, 0); let yL2 = project(boxSize, boxSize+15, 0);
            p.text("1895", yL1.x, yL1.y); p.text("2026", yL2.x, yL2.y);
            // Precip
            let pL1 = project(-20, boxSize, 0); let pL2 = project(-20, 0, 0);
            p.text("0\"", pL1.x, pL1.y); p.text("80\"", pL2.x, pL2.y);
            // Temp
            let tL1 = project(0, boxSize+15, 0); let tL2 = project(0, boxSize+15, boxSize);
            p.text("35\u00B0F", tL1.x-15, tL1.y+5); p.text("50.1\u00B0F", tL2.x, tL2.y+5);

            // Bold Main Titles
            p.fill(0); p.textStyle(p.BOLD); p.textSize(13);
            let tYear = project(halfBox, boxSize + 40, 0);
            p.text("YEAR", tYear.x, tYear.y);

            let tTemp = project(0, boxSize + 40, halfBox);
            p.text("TEMPERATURE", tTemp.x, tTemp.y);

            p.push();
            let tPrecip = project(-45, halfBox, 0);
            p.translate(tPrecip.x, tPrecip.y);
            p.rotate(-p.HALF_PI);
            p.text("PRECIPITATION", 0, 0);
            p.pop();
            p.textStyle(p.NORMAL); // Reset style

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

                let curPos = project(x3, y3, z3);
                let curFloor = project(x3, boxSize, z3);

                if (lastPos && !isNaN(curPos.x)) {
                    let colAmt = p.map(tempF, 35, 50.1, 0, 1);
                    let c = p.lerpColor(p.color(0, 120, 255, 140), p.color(255, 50, 0, 140), p.constrain(colAmt, 0, 1));

                    p.fill(c); p.noStroke();
                    p.beginShape();
                    p.vertex(lastPos.x, lastPos.y); p.vertex(curPos.x, curPos.y);
                    p.vertex(curFloor.x, curFloor.y); p.vertex(lastFloor.x, lastFloor.y);
                    p.endShape(p.CLOSE);

                    p.stroke(c); p.strokeWeight(1.5);
                    p.line(lastPos.x, lastPos.y, curPos.x, curPos.y);
                }
                lastPos = curPos; lastFloor = curFloor;
            }

            if (p.keyIsDown(32)) {
                p.fill(255, 0, 0); p.textSize(16); p.text("PAUSED", w/2, 40);
            }
        }
    };
})();
