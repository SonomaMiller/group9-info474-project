(function () {
    window.sonoma_heatmap = {
        draw: function (p, manager, ai, progress) {
            let tempTable = manager.tempTable;
            let precipTable = manager.precipTable;

            if (!tempTable || tempTable.getRowCount() === 0) return;

            p.background(255);

            const margin = 60;
            const w = manager.width - margin * 2;
            const h = manager.height - margin * 2;

            // 1. DYNAMIC RANGE FINDING
            // To highlight the 2-degree shift, we find the actual tight bounds of your data
            let temps = tempTable.getColumn(1).map(Number);
            let minDataTemp = Math.min(...temps);
            let maxDataTemp = Math.max(...temps);
            
            let precips = precipTable.getColumn(1).map(Number);
            let maxPrecip = Math.max(...precips);

            const rowCount = tempTable.getRowCount();
            const barWidth = w / (2026 - 1895);

            p.push();
            p.translate(margin, margin);

            for (let i = 0; i < rowCount; i++) {
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let year = parseInt(dateStr.split('-')[1]);
                let tempF = tempTable.getNum(i, 1);
                let precipInches = precipTable.getNum(i, 1);

                // 2. COORDINATE MAPPING
                let x = p.map(year, 1895, 2026, 0, w);
                // Y starts from the bottom (h) and goes up based on inches
                let y = p.map(precipInches, 0, maxPrecip, 0, h);

                // 3. COLOR MAPPING (The Highlight Fix)
                // We map to the MIN and MAX of your data, not 30-75.
                // This ensures the coldest year is PURE BLUE and hottest is PURE RED.
                let amt = p.map(tempF, minDataTemp, maxDataTemp, 0, 1);
                amt = p.constrain(amt, 0, 1);

                let cBlue = p.color(0, 50, 255);
                let cWhite = p.color(245, 245, 245); 
                let cRed = p.color(255, 20, 0);

                let col;
                if (amt < 0.5) {
                    col = p.lerpColor(cBlue, cWhite, p.map(amt, 0, 0.5, 0, 1));
                } else {
                    col = p.lerpColor(cWhite, cRed, p.map(amt, 0.5, 1, 0, 1));
                }

                // 4. DRAW THE BAR
                p.fill(col);
                p.noStroke();
                // Draw bar from bottom up: rect(x, y_start, width, height)
                p.rect(x, h - y, barWidth, y);
            }

            // 5. AXIS LABELS
            p.fill(0);
            p.textAlign(p.CENTER);
            p.text("Year", w / 2, h + 30);
            p.push();
            p.rotate(-p.HALF_PI);
            p.text("Precipitation (Inches)", -h / 2, -40);
            p.pop();

            p.pop();
        }
    };
})();
