(function () {
    window.sonoma_heatmap = {
        draw: function (p, manager, ai, progress) {
            let tempTable = manager.tempTable;
            if (!tempTable || tempTable.getRowCount() === 0) return;

            p.background(255);

            const margin = 80;
            const w = manager.width - margin * 2;
            const h = manager.height - margin * 2;

            const rowCount = tempTable.getRowCount();

            // Calculate grid dimensions
            const numYears = 2026 - 1895 + 1;
            const cellW = w / numYears;
            const cellH = h / 12;

            p.push();
            p.translate(margin, margin);

            for (let i = 0; i < rowCount; i++) {
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let dateParts = dateStr.split('-');
                let month = parseInt(dateParts[0]);
                let year = parseInt(dateParts[1]);
                let tempF = tempTable.getNum(i, 1);

                // X position based on Year
                let x = p.map(year, 1895, 2026, 0, w);
                // Y position based on Month (1 at top, 12 at bottom)
                let y = p.map(month, 1, 12, 0, h - cellH);

                let amt = p.map(tempF, 30, 75, 0, 1);
                amt = p.constrain(amt, 0, 1);

                let cBlue = p.color(0, 50, 255);
                let cWhite = p.color(240, 240, 240);
                let cRed = p.color(255, 20, 0);

                let col;
                if (amt < 0.5) {
                    col = p.lerpColor(cBlue, cWhite, p.map(amt, 0, 0.5, 0, 1));
                } else {
                    col = p.lerpColor(cWhite, cRed, p.map(amt, 0.5, 1, 0, 1));
                }

                // 3. Draw the "Cell"
                p.fill(col);
                p.noStroke();
                p.rect(x, y, cellW + 0.5, cellH + 0.5);
            }

            // 4. Labels
            p.fill(0);
            p.textAlign(p.CENTER, p.TOP);
            p.text("1895", 0, h + 10);
            p.text("2026", w, h + 10);
            p.text("Year", w/2, h + 25);

            p.textAlign(p.RIGHT, p.CENTER);
            p.text("Jan", -10, cellH/2);
            p.text("Dec", -10, h - cellH/2);

            p.pop();
        }
    };
})();
