(function () {
    window.Amber_AvgTemp = {
        draw: function (p, manager, ai, progress) {
            let table = manager.avgTempTable;
            console.log("Avg Temp Table: ", table);
            
            p.background(100);
            p.fill(0);
            p.stroke(0);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Long-Term Warming Trend in Washington State (1895-2026)", manager.width / 2, 30);
        }
    };
})();
