// viz_title.js
// Draw title-style screens for early active indexes (0 and 1)
(function () {
    window.VizTitle = {
        draw: function (p, manager, ai, progress) {
            var cx = (manager.offsetX || 0) + (manager.width || 600) / 2;
            var cy = (manager.offsetY || 0) + (manager.height || 520) / 3;

            // title screen
            if (ai === 0) {
                p.push();
                p.noStroke();
                p.fill(255);
                var w = 420;
                var h = 120;
                p.rect(cx - w / 2, cy - h / 2, w, h, 6);
                p.fill(0);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(48);
                p.text('Washington Climate Trends', cx, cy);
                p.pop();
            } else if (ai === 1) {
                p.image(manager.abstractImg, cx - 100, cy - 100, 500, 500);
            }
        }
    };
})();
