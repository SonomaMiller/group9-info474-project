(function () {
    window.Amber_Precipitation = {
        draw: function (p, manager, ai, progress) {

            let table = manager.precipV2Table;

            const margin = 70;
            const w = manager.width - margin * 2;
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
            p.text("Washington Dry Season Precipitation (Jul–Aug) 1895–2026", manager.width / 2, 30);

            // draw axes
            p.line(margin, margin, margin, margin + h);
            p.line(margin, margin + h, margin + w, margin + h);

        }
    };
})();
