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

            let temps = tempTable.getColumn(1).map(Number);
            let minDataTemp = Math.min(...temps);
            let maxDataTemp = Math.max(...temps);

            let precips = precipTable.getColumn(1).map(Number);
            let maxPrecip = Math.max(...precips);

            const rowCount = tempTable.getRowCount();
            const barWidth = w / (2026 - 1895);

            let hoverData = null;

            p.push();
            p.translate(margin, margin);

            for (let i = 0; i < rowCount; i++) {
                let dateStr = tempTable.getString(i, 0);
                if (!dateStr) continue;

                let year = parseInt(dateStr.split('-')[1]);
                let tempF = tempTable.getNum(i, 1);
                let precipInches = precipTable.getNum(i, 1);

                let x = p.map(year, 1895, 2026, 0, w);
                let yHeight = p.map(precipInches, 0, maxPrecip, 0, h);

                // COLOR LOGIC (Relative to Min/Max to show warming)
                let amt = p.map(tempF, minDataTemp, maxDataTemp, 0, 1);
                amt = p.constrain(amt, 0, 1);

                let col = p.lerpColor(p.color(0, 50, 255), p.color(255, 20, 0), amt);

                // HOVER DETECTION
                // Adjust mouseX/Y by the margin since we translated the origin
                let mX = p.mouseX - margin;
                let mY = p.mouseY - margin;

                if (mX > x && mX < x + barWidth && mY > h - yHeight && mY < h) {
                    p.fill(p.red(col), p.green(col), p.blue(col), 255); // Solid color on hover
                    hoverData = { year, tempF, precipInches, mX: p.mouseX, mY: p.mouseY };
                } else {
                    p.fill(p.red(col), p.green(col), p.blue(col), 180); // Semi-transparent
                }

                p.noStroke();
                p.rect(x, h - yHeight, barWidth, yHeight);
            }
            p.pop();

            // DRAW AXIS LABELS
            p.fill(0);
            p.textAlign(p.CENTER);
            p.textSize(12);
            p.text("Year (1895 - 2026)", margin + w / 2, margin + h + 35);

            p.push();
            p.translate(margin - 40, margin + h / 2);
            p.rotate(-p.HALF_PI);
            p.text("Precipitation (Inches)", 0, 0);
            p.pop();

            // 2. DRAW THE HOVER BOX
            if (hoverData) {
                this.drawHoverBox(p, hoverData);
            }
        },

        drawHoverBox: function (p, data) {
            let boxW = 120;
            let boxH = 70;
            let x = data.mX + 10;
            let y = data.mY - boxH - 10;

            // Keep box on screen
            if (x + boxW > p.width) x = data.mX - boxW - 10;

            p.push();
            p.fill(255, 240);
            p.stroke(0);
            p.strokeWeight(1);
            p.rect(x, y, boxW, boxH, 5);

            p.noStroke();
            p.fill(0);
            p.textAlign(p.LEFT, p.TOP);
            p.textSize(12);
            p.textStyle(p.BOLD);
            p.text(`Year: ${data.year}`, x + 10, y + 10);

            p.textStyle(p.NORMAL);
            p.text(`Temp: ${data.tempF.toFixed(2)}°F`, x + 10, y + 30);
            p.text(`Precip: ${data.precipInches.toFixed(2)}"`, x + 10, y + 50);
            p.pop();
        }
    };
})();