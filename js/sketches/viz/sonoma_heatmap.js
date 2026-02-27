(function () {
    window.heatmap = {
        draw: function (p, manager, ai, progress) {
            // Safety check: ensure tables are loaded
            if (!manager.tempTable || !manager.precipTable) return;

            let tempRows = manager.tempTable.getRows();
            let precipRows = manager.precipTable.getRows();

            p.push();
            // Use the margins defined in manager
            p.translate(manager.margin.left, manager.margin.top);

            for (let i = 0; i < tempRows.length; i++) {
                // 1. Extract Date and Year
                let dateStr = tempRows[i].getString(0);
                let year = parseInt(dateStr.split('-')[1]);

                // 2. Extract Data Values
                let tempF = tempRows[i].getNum(1); // Column F2
                let precipInches = precipRows[i] ? precipRows[i].getNum(1) : 0;

                // 3. Map to Canvas Coordinates
                // X = Year, Y = Precipitation Value
                let x = p.map(year, 1895, 2025, 0, manager.width);
                let y = p.map(precipInches, 0, 10, manager.height, 0);

                // 4. Map Color (Heatmap logic)
                // Low temp (35F) = Blue, High temp (65F) = Red
                let c1 = p.color(0, 120, 255, 200);
                let c2 = p.color(255, 60, 0, 200);
                let amt = p.map(tempF, 35, 65, 0, 1);
                let col = p.lerpColor(c1, c2, amt);

                p.fill(col);
                p.noStroke();
                // Draw each data point as a small rectangle
                p.rect(x, y, 5, 5);
            }

            // Draw simple axis labels
            p.fill(0);
            p.textAlign(p.CENTER);
            p.text("Year (1895 - 2025)", manager.width / 2, manager.height + 25);
            p.pop();
        }
    };
})();
