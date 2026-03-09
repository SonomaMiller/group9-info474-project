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

            // --- Rotation Logic ---
            // p.frameCount makes it animate over time
            let rotAngle = p.frameCount * 0.01;
            let viewScale = 0.6;

            // Helper function for 3D rotation and projection in 2D space
            const project = (x3d, y3d, z3d) => {
                // 1. Center the data (assuming a 300x300x300 cube)
                let cx = x3d - 150;
                let cy = y3d - 150;
                let cz = z3d - 150;

                // 2. Rotate around the Y-axis (Standard Rotation Matrix)
                let rotX = cx * p.cos(rotAngle) - cz * p.sin(rotAngle);
                let rotZ = cx * p.sin(rotAngle) + cz * p.cos(rotAngle);

                // 3. Project to 2D Screen Coordinates
                let screenX = (w / 2) + (rotX * viewScale);
                let screenY = (h / 2) + (cy * viewScale);

                return { x: screenX, y: screenY };
            };

            // --- Draw Axes ---
            p.stroke(200);
            p.strokeWeight(1);
            let origin = project(0, 0, 0);
            let xAxis = project(300, 0, 0);
            let yAxis = project(0, 300, 0);
            let zAxis = project(0, 0, 300);

            p.line(origin.x, origin.y, xAxis.x, xAxis.y); // Year
            p.line(origin.x, origin.y, yAxis.x, yAxis.y); // Precip
            p.line(origin.x, origin.y, zAxis.x, zAxis.y); // Temp

            p.fill(100);
            p.noStroke();
            p.text("Year", xAxis.x, xAxis.y);
            p.text("Precipitation", yAxis.x, yAxis.y);
            p.text("Temperature", zAxis.x, zAxis.y);

            // --- Draw the 3D Line ---
            p.noFill();
            p.strokeWeight(2);
            p.beginShape();

            for (let i = 0; i < rowCount; i++) {
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let year = parseInt(dateStr.split('-')[1]);
                let tempF = tempTable.getNum(i, 1);
                let precipInches = precipTable.getNum(i, 1);

                // Map raw data to the 300-unit virtual cube
                let x3 = p.map(year, 1895, 2026, 0, 300);
                let y3 = p.map(precipInches, 0, 80, 300, 0);
                let z3 = p.map(tempF, 35, 75, 0, 300);

                let pos = project(x3, y3, z3);

                if (!isNaN(pos.x) && !isNaN(pos.y)) {
                    // Change color based on Temperature (Z-axis)
                    let colAmt = p.map(tempF, 45, 65, 0, 1);
                    let c = p.lerpColor(p.color(0, 100, 255), p.color(255, 50, 0), p.constrain(colAmt, 0, 1));

                    p.stroke(c);
                    p.vertex(pos.x, pos.y);
                }
            }
            p.endShape();
        }
    };
})();