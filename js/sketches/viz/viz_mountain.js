(function () {
    window.VizMountain = {

        draw: function (p, manager, ai, progress) {
            let table = manager.snowPackTable;
            console.log("table", table)

            const numberOfRows = table.getRowCount();
            console.log("number of Rows ", numberOfRows)
            let seasonStart = []
            let seasonEnd = []
            let snowPack = []

            console.log("season start, ", seasonStart)

            for (let i = 0; i < numberOfRows; i++) {
                seasonStart[i] = table.getNum(i, 0);
                seasonEnd[i] = table.getNum(i, 1);
                snowPack[i] = table.getNum(i, 2);
            }

            let maxSnowPack = Math.max(...snowPack);
            let mountainMaxHeight = 200 + maxSnowPack
            console.log("mountain max heigh ", mountainMaxHeight)

            console.log("max snow pack ", maxSnowPack);

            p.push();

            var left = manager.offsetX;
            var top = manager.offsetY;
            var w = manager.width;
            var h = manager.height;

            var skyW = w * 0.8;
            var skyH = h * 0.6;
            var skyX = left + (w - skyW) / 2;
            var skyY = top + (h - skyH) / 2;

            // Draw sky
            p.noStroke();
            p.fill(135, 206, 235);
            p.rect(skyX, skyY, skyW, skyH, 8);


            // Calculate peak height
            let peakHeight = mountainMaxHeight * 0.3;
            let peakX = skyX + skyW / 2;
            let peakY = skyY + skyH - peakHeight;

            // Draw mountain as a green triangle
            p.fill(34, 139, 34);
            p.noStroke();
            p.triangle(
                peakX, peakY,
                skyX, skyY + skyH,
                skyX + skyW, skyY + skyH
            );

            // snow cap height (example)
            let snowCapHeight = snowPack[2] * 0.3

            // Snow line Y position
            let snowLineY = peakY + snowCapHeight;

            // Calculate current snow width based on snowCapHeight
            let totalBaseWidth = skyW;
            let currentWidth = (snowCapHeight / peakHeight) * totalBaseWidth;

            let snowLeftX = peakX - currentWidth / 2;
            let snowRightX = peakX + currentWidth / 2;

            // Draw snow capw as a white triangle
            p.fill(255);
            p.noStroke();
            p.triangle(
                peakX, peakY,
                snowLeftX, snowLineY,
                snowRightX, snowLineY
            );

            // Close at bottom of box
            p.vertex(skyX + skyW, skyY + skyH);
            p.vertex(skyX, skyY + skyH);
            p.endShape(p.CLOSE);

            p.pop();
        }
    };
})();