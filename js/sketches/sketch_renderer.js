// Responsible for rendering the main visualization based on the current active index
(function () {
    window.Renderer = {

        setData: function (manager) {
            var self = this;

            manager.avgTempTable = manager.p5.loadTable('data/washington_avg_temp_clean.csv', 'csv', 'header');
            manager.tempTable = manager.p5.loadTable('data/temperature_clean.csv', 'csv', 'header');
            manager.precipTable = manager.p5.loadTable('data/precipitation_clean.csv', 'csv', 'header');
            manager.snowPackTable = manager.p5.loadTable('data/WA-SnowfallData.csv', 'csv', 'header');
            manager.seaLevelTable = manager.p5.loadTable('data/WAYearlySeaLevel.csv', 'csv', 'header');
            manager.precipDrynessTable = manager.p5.loadTable('data/washington_precipitation_dryness.csv', 'header');

            manager.offsetX = (manager.margin && manager.margin.left) || 20;
            manager.offsetY = (manager.margin && manager.margin.top) || 0;

            function computeLayout(data) {
                manager.data = data;
            }

            computeLayout([]);
            return Promise.resolve(manager.data);
        },

        draw: function (p, manager, ai, progress) {
            console.log("Active index ", ai)
            try { console.log('Renderer: delegating draw, ai=', ai); } catch (e) { }

            if (ai === 0 || ai === 1) {
                window.VizTitle.draw(p, manager, ai, progress);
                return;
            }

            if (ai === 4) {
                window.Amber_AvgTemp.draw(p, manager, ai, progress);
                return;
            }

            if (ai == 5) {
                window.Amber_Precipitation.draw(p, manager, ai, progress);
                return;
            }

            if (ai == 6) {
                window.lexeigh_sea_level.draw(p, manager, ai, progress);
                return;
            }

            if (ai === 7) {
                window.VizMountain.draw(p, manager, ai, progress);
                return;
            }

            if (ai === 8) {
                window.sonoma_heatmap.draw(p, manager, ai, progress);
                return;
            }

            if (ai === 9) {
                window.sonoma_3d.draw(p, manager, ai, progress);
                return;
            }
        }
    };
})();
