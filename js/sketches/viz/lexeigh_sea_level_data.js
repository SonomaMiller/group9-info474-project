(function () {
    window.lexeigh_sea_level = {
        draw: function (p, manager, ai, progress) {
            let table = manager.seaLevelTable;
            console.log("Avg Sea Level Table: ", table);
            console.log(manager.width, manager.height);

            const margin = 60;
            const w = manager.width - margin * 2 + 50;
            const h = manager.height - margin * 2;

            const numberOfRows = table.getRowCount();
            const numberOfCols = table.getColumnCount();
            let years = [];
            let seaLevel = [];

            for (let i = 0; i < numberOfRows; i++) {
                years[i] = table.getNum(i, 1);
                seaLevel[i] = table.getNum(i, 7);
            }

            const minSeaLevel = Math.min(...seaLevel) - 0.2;
            const maxSeaLevel = Math.max(...seaLevel) + 0.2;

            p.background(210);
            p.fill(0);
            p.stroke(0);
            p.strokeWeight(0.7);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Sea Level in Washington from 1899 to 2026", manager.width / 2, 30);

            // draw axes
            p.line(margin, margin, margin, margin + h);
            p.line(margin, margin + h, margin + w, margin + h);

            // draw y-ticks and scale
            let numYTicks = 14;
            let range = maxSeaLevel - minSeaLevel;
            for (let i = 0; i <= numYTicks; i++) {
                let t = i / numYTicks;
                let value = minSeaLevel + t * range;
                let y = margin + h - t * h;

                p.strokeWeight(0.1);
                p.line(margin - 5, y, margin + w, y);

                p.noStroke();
                p.strokeWeight(0.4);
                p.textSize(12);
                p.text(value.toFixed(1), margin - 20, y);
                p.stroke(0);
            }

            // draw line
            p.stroke(80, 120, 200);
            p.strokeWeight(1);
            for (let i = 0; i < numberOfRows; i++) {
                let x1 = margin + (i / (numberOfRows - 1)) * w;
                let y1 = margin + h - ((seaLevel[i] - minSeaLevel) / (maxSeaLevel - minSeaLevel)) * h;
                let x2 = margin + ((i + 1) / (numberOfRows - 1)) * w;
                let y2 = margin + h - ((seaLevel[i + 1] - minSeaLevel) / (maxSeaLevel - minSeaLevel)) * h;
                p.line(x1, y1, x2, y2);
            }

            // draw x scale
            // don't know if I want ticks here.
            for (let i = 0; i < numberOfRows; i += 10) {
                let x = margin + (i / (numberOfRows - 1)) * w;
                p.noStroke();
                p.strokeWeight(0.1);
                p.textSize(10);
                p.textAlign(p.CENTER, p.TOP);
                p.text(years[i], x, margin + h + 5);
            }

            // draw x- and y-labels
            p.push();

            p.translate(margin - 45, margin + h / 2);
            p.rotate(-p.HALF_PI);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Sea Level (M)", 0, 0);

            p.pop();

            p.textAlign(p.CENTER, p.BOTTOM);
            p.text("Year", margin + w / 2, margin + h + 35);

        }
    };
})();
