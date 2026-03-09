(function () {
    window.sonoma_3d = {
        draw: function (p, manager, ai, progress) {
            let tempTable = manager.tempTable;
            let precipTable = manager.precipTable;

            if (!tempTable || !precipTable) return;

            p.background(255);
            p.push();
            p.rotateY(p.frameCount * 0.01);
            p.rotateX(-0.2); // Slight tilt to see the floor

            const rowCount = tempTable.getRowCount();
            const size = 300; // The bounding box size for our graph

            // Draw Axes for reference
            p.stroke(200);
            p.line(-size / 2, size / 2, -size / 2, size / 2, size / 2, -size / 2); // X
            p.line(-size / 2, size / 2, -size / 2, -size / 2, -size / 2, -size / 2); // Y
            p.line(-size / 2, size / 2, -size / 2, -size / 2, size / 2, size / 2); // Z

            p.noFill();
            p.strokeWeight(2);
            p.beginShape();

            for (let i = 0; i < rowCount; i++) {
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let dateParts = dateStr.split('-');
                let year = parseInt(dateParts[1]);
                let tempF = tempTable.getNum(i, 1);
                let precipInches = precipTable.getNum(i, 1);

                // Map raw data to 3D coordinate space
                // X: Year (Mapped from left to right)
                let x = p.map(year, 1895, 2026, -size / 2, size / 2);

                // Y: Precipitation (Mapped bottom to top)
                let y = p.map(precipInches, 0, 80, size / 2, -size / 2);

                // Z: Temperature (Mapped front to back)
                let z = p.map(tempF, 35, 75, -size / 2, size / 2);

                if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                    // Change color dynamically based on temperature
                    let colAmt = p.map(tempF, 40, 70, 0, 1);
                    let c = p.lerpColor(p.color(0, 100, 255), p.color(255, 50, 0), p.constrain(colAmt, 0, 1));
                    p.stroke(c);

                    p.vertex(x, y, z);
                }
            }
            p.endShape();
            p.pop();

            p.fill(0);
            p.noStroke();
            p.textSize(16);
            p.textAlign(p.LEFT, p.TOP);
            p.text("3D Climate Path: X=Year, Y=Precip, Z=Temp", -p.width / 2 + 20, -p.height / 2 + 20);
        }
    };
})();
