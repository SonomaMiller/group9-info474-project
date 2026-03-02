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

                if (i === 0) {
                    console.log(`Row 0 debug: Date=${dateStr}, Year=${year}, Temp=${tempF}, Precip=${precipInches}`);
                }

                // 4. Mapping
                // If year is 1895, x will be 0. If year is NaN, x will be NaN.
                let x = p.map(year, 1895, 2026, 0, w);

                // Safety: If precip is unexpectedly high, map it to the top of the chart
                let y = p.map(precipInches, 0, 60, h, 0);
                y = p.constrain(y, 0, h);

                // 5. Draw
                if (!isNaN(x) && !isNaN(y)) {
                    let amt = p.map(tempF, 35, 65, 0, 1);
                    let col = p.lerpColor(p.color(0, 0, 255, 150), p.color(255, 0, 0, 150), p.constrain(amt, 0, 1));

                    p.fill(col);
                    p.noStroke();
                    p.ellipse(x, y, 4, 4);
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