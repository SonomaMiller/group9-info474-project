(function () {
    window.Amber_Dry = {
        draw: function (p, manager, ai, progress) {

            let table = manager.precipDrynessTable;

            const margin = 70;
            const w = manager.width - margin * 2 + 90;
            const h = manager.height - margin * 2;

            let yearly = {};
            for (let r = 0; r < table.getRowCount(); r++) {
                let dateStr = table.getString(r, "Date");
                let precip = table.getNum(r, "Precipitation (in.)");
                let parts = dateStr.split("/");
                let year = parseInt(parts[2]);
                let month = parseInt(parts[0]);
                if (!yearly[year]) yearly[year] = 0;
                if (month === 7 || month === 8) yearly[year] += precip;
            }

            let years = Object.keys(yearly).map(y => parseInt(y)).sort((a, b) => a - b);
            let dry = [];
            let hoverData = null;
            for (let i = 0; i < years.length; i++) dry[i] = yearly[years[i]];

            const numberOfRows = years.length;
            const minVal = 0;
            const maxVal = Math.max(...dry) + 0.2;

            p.background(210);
            p.fill(0);
            p.stroke(0);
            p.strokeWeight(0.7);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Washington Dry Season Precipitation (Jul-Aug) 1895-2026", manager.width / 2, 30);

            // draw axes
            p.line(margin, margin, margin, margin + h);
            p.line(margin, margin + h, margin + w, margin + h);

             // draw y-ticks and scale
            const numYTicks = 14;
            const range = maxVal - minVal;
            for (let i = 0; i <= numYTicks; i++) {
                let t = i / numYTicks;
                let value = minVal + t * range;
                let y = margin + h - t * h;

                p.stroke(0);
                p.strokeWeight(0.1);
                p.line(margin - 5, y, margin + w, y);

                p.fill(0);
                p.noStroke();
                p.textSize(12);
                p.textAlign(p.RIGHT, p.CENTER);
                p.text(value.toFixed(1), margin - 8, y);
            }

            // draw bars
            const barW = w / numberOfRows;
            for (let i = 0; i < numberOfRows; i++) {
                let x = margin + (i / (numberOfRows - 1)) * w - barW / 2;
                let yVal = margin + h - ((dry[i] - minVal) / (maxVal - minVal)) * h;
                let yBase = margin + h;

                // hover detection
                if (
                    p.mouseX >= x && p.mouseX <= x + barW - 0.5 &&
                    p.mouseY >= yVal && p.mouseY <= yBase
                ) {
                    p.fill(240, 0, 0); // Highlight on hover
                    hoverData = { year: years[i], precip: dry[i], mX: p.mouseX, mY: p.mouseY };
                } else {
                    p.fill(200, 120, 80, 200);
                }

                p.noStroke();
                p.rect(x, yVal, barW - 0.5, yBase - yVal);

                p.fill(200, 120, 80, 200);
                p.noStroke();
                p.rect(x, yVal, barW - 0.5, yBase - yVal);
            }

            // draw x-axis labels
            p.push();
            p.fill(0);
            p.noStroke();
            p.textSize(10);
            p.textAlign(p.CENTER, p.TOP);
            for (let i = 0; i < numberOfRows; i += 10) {
                let x = margin + (i / (numberOfRows - 1)) * w;
                p.text(years[i], x, margin + h + 5);
            }

            // draw x- and y-axis title
            p.push();

            p.fill(0);
            p.noStroke();
            p.translate(margin - 50, margin + h / 2);
            p.rotate(-p.HALF_PI);
            p.textSize(13);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Precipitation (in.)", 0, 0);

            p.pop();

            p.textSize(13);
            p.textAlign(p.CENTER, p.BOTTOM);
            p.text("Year", margin + w / 2, margin + h + 35);

            if (hoverData) {
                this.drawHoverBox(p, hoverData);
            }
        },

        drawHoverBox: function (p, data) {
            let boxW = 130;
            let boxH = 55;
            let x = data.mX + 10;
            let y = data.mY - boxH - 10;

            if (x + boxW > p.width) x = data.mX - boxW - 10;
            if (y < 0) y = data.mY + 10;

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
            p.text(`Precipitation: ${data.precip.toFixed(2)}"`, x + 10, y + 30);
            p.pop();
        }
    };
})();
