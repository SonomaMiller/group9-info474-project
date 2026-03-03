(function () {
    window.sonoma_3d = {
        draw: function (p, manager, ai, progress) {
            let tempTable = manager.tempTable;
            let precipTable = manager.precipTable;

            if (!tempTable || !precipTable) return;

            p.background(255);

            const margin = 80;
            const w = manager.width - margin * 2;
            const h = manager.height - margin * 2;
            const rowCount = tempTable.getRowCount();

            // Angle to tilt the Z-axis (Temperature)
            const angle = p.PI / 6;
            const zScale = 0.5; // How "deep" the Z-axis looks

            // Helper function to turn 3D (x,y,z) into 2D (screenX, screenY)
            const project = (x3d, y3d, z3d) => {
                // We offset based on the Z-axis angle to create the 3D illusion
                let screenX = x3d + z3d * p.cos(angle) * zScale;
                let screenY = y3d - z3d * p.sin(angle) * zScale;
                return { x: screenX, y: screenY };
            };

            p.push();
            p.translate(margin, h + margin); // Start from bottom-left

            p.noFill();
            p.strokeWeight(2);
            p.beginShape();

            for (let i = 0; i < rowCount; i++) {
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let year = parseInt(dateStr.split('-')[1]);
                let tempF = tempTable.getNum(i, 1);
                let precipInches = precipTable.getNum(i, 1);

                // Map raw data to 3D coordinate space
                let x3 = p.map(year, 1895, 2026, 0, w * 0.8);
                let y3 = p.map(precipInches, 0, 80, 0, -h * 0.8); // Negative is UP
                let z3 = p.map(tempF, 35, 75, 0, w * 0.5);

                // Project to 2D
                let pos = project(x3, y3, z3);

                if (!isNaN(pos.x) && !isNaN(pos.y)) {
                    // Color based on Temperature (Z-axis)
                    let colAmt = p.map(tempF, 45, 65, 0, 1);
                    let c = p.lerpColor(p.color(0, 150, 255), p.color(255, 50, 0), p.constrain(colAmt, 0, 1));

                    p.stroke(c);
                    p.vertex(pos.x, pos.y);
                }
            }
            p.endShape();

            p.stroke(200);
            p.strokeWeight(1);
            // X Axis (Year)
            let xEnd = project(w * 0.8, 0, 0);
            p.line(0, 0, xEnd.x, xEnd.y);
            // Y Axis (Precip)
            let yEnd = project(0, -h * 0.8, 0);
            p.line(0, 0, yEnd.x, yEnd.y);
            // Z Axis (Temp)
            let zEnd = project(0, 0, w * 0.5);
            p.line(0, 0, zEnd.x, zEnd.y);

            p.pop();

            // Labels
            p.fill(0);
            p.noStroke();
            p.textSize(12);
            p.text("Precipitation", 20, 50);
            p.text("Year", margin + w * 0.7, h + margin + 20);
            p.text("Temperature", margin + 120, h + margin - 20);
        }
    };
})();
