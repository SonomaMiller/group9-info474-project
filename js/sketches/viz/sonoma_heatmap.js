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
                // Extract Year from Date (e.g., "Jan-1895")
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let dateParts = dateStr.split('-');
                // Handles "1895" or "Jan-1895"
                let year = parseInt(dateParts[dateParts.length - 1]);

                // Extract Values
                let tempF = tempTable.getNum(i, 1);
                // Use i to match the row in precipTable
                let precipInches = precipTable.getNum(i, 1);

                // 3. Mapping
                // X = Year, Y = Precipitation
                let x = p.map(year, 1895, 2026, 0, w);
                let y = p.map(precipInches, 0, 10, h, 0);

                // 4. Heatmap Color Logic
                // Low temp (35F) = Blue, High temp (65F) = Red
                let c1 = p.color(0, 120, 255, 150);
                let c2 = p.color(255, 60, 0, 150);

                // Constrain ensures we don't get "broken" colors outside the 35-65 range
                let amt = p.map(tempF, 35, 65, 0, 1);
                let col = p.lerpColor(c1, c2, p.constrain(amt, 0, 1));

                p.fill(col);
                p.noStroke();

                // Draw dots that are slightly larger for visibility
                p.rect(x, y, 4, 4);
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

            p.pop();
        }
    };
})();