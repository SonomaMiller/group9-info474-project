(function () {
    window.sonoma_heatmap = {
        draw: function (p, manager, ai, progress) {
            let tempTable = manager.tempTable;
            let precipTable = manager.precipTable;
            console.log("Avg Temp Table: ", tempTable);
            console.log("Avg Precip Table: ", precipTable);

            if (!tempTable || !precipTable) return;

            p.background(255);

            const margin = 60;
            const w = manager.width - margin * 2;
            const h = manager.height - margin * 2;

            const rowCount = tempTable.getRowCount();

            p.push();
            p.translate(margin, margin);

            for (let i = 0; i < rowCount; i++) {
                // Extract Year from Date (e.g., "01-1895")
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let dateParts = dateStr.split('-');
                let year = parseInt(dateParts[1]);

                // Extract Values
                let tempF = tempTable.getNum(i, 1);
                // Use i to match the row in precipTable
                let precipInches = precipTable.getNum(i, 1);

                // 4. Mapping
                // If year is 1895, x will be 0. If year is NaN, x will be NaN.
                let x = p.map(year, 1895, 2026, 0, w);

                // Safety: If precip is unexpectedly high, map it to the top of the chart
                let y = p.map(precipInches, 30, 60, h, 0);

                // 5. Draw
                if (!isNaN(x) && !isNaN(y)) {
                    let cBlue = p.color(0, 0, 255, 180);   // Cold
                    let cWhite = p.color(255, 255, 255, 180); // Neutral
                    let cRed = p.color(255, 0, 0, 180);    // Hot

                    let amt = p.map(tempF, 35, 65, 0, 1);
                    amt = p.constrain(amt, 0, 1);

                    let col;
                    if (amt < 0.5) {
                        // First half: Blue to White
                        let inter = p.map(amt, 0, 0.5, 0, 1);
                        col = p.lerpColor(cBlue, cWhite, inter);
                    } else {
                        // Second half: White to Red
                        let inter = p.map(amt, 0.5, 1, 0, 1);
                        col = p.lerpColor(cWhite, cRed, inter);
                    }

                    p.fill(col);
                    p.noStroke();
                    p.stroke(0, 50);
                    p.strokeWeight(0.5);
                    p.ellipse(x, y, 5, 5);
                }
            }

            // 5. Draw Labels
            p.fill(0);
            p.textAlign(p.CENTER);
            p.textSize(12);
            p.text("Year (1895 - 2026)", w / 2, h + 35);

            p.push();
            p.rotate(-p.HALF_PI);
            p.text("Precipitation (Inches)", -h / 2, -40);
            p.pop();
        }
    };
})();