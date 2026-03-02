(function () {
    window.VizMountain = {

        draw: function (p, manager, ai, progress) {
            p.push();

            var left = manager.offsetX || 0;
            var top = manager.offsetY || 0;
            var w = manager.width || 600;
            var h = manager.height || 400;

            var skyW = w * 0.8;
            var skyH = h * 0.6;
            var skyX = left + (w - skyW) / 2;
            var skyY = top + (h - skyH) / 2;

            // dummy heights for now
            var heights = [
                0.05, 0.1, 0.2, 0.35, 0.55,
                0.75, 0.95, 0.8, 0.6,
                0.4, 0.25, 0.15, 0.08, 0.05
            ];

            var steps = heights.length - 1;

            // Draw sky
            p.noStroke();
            p.fill(135, 206, 235);
            p.rect(skyX, skyY, skyW, skyH, 8);


            // Draw mountain
            p.fill(90, 140, 180);
            p.beginShape();

            for (var i = 0; i <= steps; i++) {
                var x = skyX + (i / steps) * skyW;
                var baseY = skyY + skyH;
                var peakHeight = heights[i] * (skyH * 0.9);
                var y = baseY - peakHeight;

                p.vertex(x, y);
            }

            // Close at bottom of box
            p.vertex(skyX + skyW, skyY + skyH);
            p.vertex(skyX, skyY + skyH);
            p.endShape(p.CLOSE);

            p.pop();
        }
    };
})();