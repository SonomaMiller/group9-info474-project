(function () {
    window.Amber_AvgTemp = {
        draw: function (p, manager, ai, progress) {
            let table = manager.avgTempTable;
            console.log("Avg Temp Table: ", table);
            console.log(manager.width, manager.height);

            const margin = 60;
            const w = manager.width - margin * 2 + 90;
            const h = manager.height - margin * 2;

            const numberOfRows = table.getRowCount();
            const numberOfCols = table.getColumnCount();
            let years = [];
            let tempF = [];
            let tempC = [];
            let rollingAvgF = [];
            let hoverData = null;

            for (let i = 0; i < numberOfRows; i++) {
                years[i] = table.getString(i, 0);
                tempF[i] = table.getNum(i, 1);
                tempC[i] = table.getNum(i, 3);
                rollingAvgF[i] = table.getNum(i, 2);
            }

            const minTempF = Math.min(...tempF) - 0.2;
            const maxTempF = Math.max(...tempF) + 0.2;

            p.background(210);
            p.fill(0);
            p.stroke(0);
            p.strokeWeight(0.7);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Long-Term Warming Trend in Washington State (1895-2026)", manager.width / 2, 30);

            // draw axes
            p.line(margin, margin, margin, margin + h);
            p.line(margin, margin + h, margin + w, margin + h);

            // draw y-ticks and scale
            let numYTicks = 14;
            let range = maxTempF - minTempF;
            for (let i = 0; i <= numYTicks; i++) {
                let t = i / numYTicks;
                let value = minTempF + t * range;
                let y = margin + h - t * h;

                p.strokeWeight(0.1);
                p.line(margin - 5, y, margin + w, y);

                p.noStroke();
                p.strokeWeight(0.4);
                p.textSize(12);
                p.text(value.toFixed(1), margin - 20, y);
                p.stroke(0);
            }

            // draw avg temp line
            p.stroke(80, 120, 200);
            p.strokeWeight(1);
            for (let i = 0; i < numberOfRows; i++) {
                let x1 = margin + (i / (numberOfRows - 1)) * w;
                let y1 = margin + h - ((tempF[i] - minTempF) / (maxTempF - minTempF)) * h;
                let x2 = margin + ((i + 1) / (numberOfRows - 1)) * w;
                let y2 = margin + h - ((tempF[i + 1] - minTempF) / (maxTempF - minTempF)) * h;
                p.line(x1, y1, x2, y2);
            }

            // draw rolling avg temp line
            p.stroke(220, 120, 30);
            p.strokeWeight(2);
            for (let i = 0; i < numberOfRows - 1; i++) {
                let x1 = margin + (i / (numberOfRows - 1)) * w;
                let y1 = margin + h - ((rollingAvgF[i] - minTempF) / (maxTempF - minTempF)) * h;
                let x2 = margin + ((i + 1) / (numberOfRows - 1)) * w;
                let y2 = margin + h - ((rollingAvgF[i + 1] - minTempF) / (maxTempF - minTempF)) * h;
                p.line(x1, y1, x2, y2);
            }

            // detect hover
            const hoverRadius = 6;
            for (let i = 0; i < numberOfRows; i++) {
                let px = margin + (i / (numberOfRows - 1)) * w;
                let py = margin + h - ((tempF[i] - minTempF) / (maxTempF - minTempF)) * h;

                if (Math.abs(p.mouseX - px) < hoverRadius && Math.abs(p.mouseY - py) < hoverRadius) {
                    p.fill(255, 0, 0);
                    p.noStroke();
                    p.circle(px, py, hoverRadius);

                    hoverData = { year: years[i], tempF: tempF[i], tempC: tempC[i], rollingAvgF: rollingAvgF[i], mX: p.mouseX, mY: p.mouseY };
                    break;
                }
            }

            // draw x scale
            // don't know if I want ticks here.
            for (let i = 0; i < numberOfRows; i += 10) {
                let x = margin + (i / (numberOfRows - 1)) * w;
                p.fill(0);
                p.noStroke();
                p.strokeWeight(0.1);
                p.textSize(10);
                p.textAlign(p.CENTER, p.TOP);
                p.text(years[i], x, margin + h + 5);
            }

            // draw x- and y-labels
            p.push();

            p.textSize(13);
            p.translate(margin - 45, margin + h / 2);
            p.rotate(-p.HALF_PI);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Temperature (°F)", 0, 0);

            p.pop();

            p.textSize(13);
            p.textAlign(p.CENTER, p.BOTTOM);
            p.text("Year", margin + w / 2, margin + h + 35);

            if (hoverData) {
                this.drawHoverBox(p, hoverData);
            }

        },

        drawHoverBox: function (p, data) {
            let boxW = 200;
            let boxH = 90;
            let x = data.mX + 10;
            let y = data.mY - boxH - 10;

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
            p.text(`Annual Avg in Fahrenheit: ${data.tempF.toFixed(2)}°F`, x + 10, y + 30);
            p.text(`Annual Avg in Celcius: ${data.tempC.toFixed(2)}°C`, x + 10, y + 50);
            p.text(`10yr Avg: ${data.rollingAvgF.toFixed(2)}°F`, x + 10, y + 70);
            p.pop();
        }
    };
})();
