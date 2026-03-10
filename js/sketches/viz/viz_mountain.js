(function () {
    let currentYear = 0;   
    let isPlaying = true;

    window.VizMountain = {

        draw: function (p, manager, ai, progress) {

            const table = manager.snowPackTable;
            const numberOfRows = table.getRowCount();

            const yearStart = [];
            const snowPack = [];

            // Load dataset
            for (let i = 0; i < numberOfRows; i++) {
                yearStart[i] = table.getNum(i, 0);
                snowPack[i] = table.getNum(i, 2);
            }

            const maxSnowPack = Math.max(...snowPack);

            // Animate
            if (isPlaying) {
                currentYear += 0.02;
                if (currentYear >= numberOfRows) currentYear = 0;
            }

            // Use currentYear as index, round to integer
            const yearIndex = Math.floor(currentYear);
            const currentSnow = snowPack[yearIndex];

            // Drawing
            p.push();

            const left = manager.offsetX;
            const top = manager.offsetY;
            const w = manager.width;
            const h = manager.height;

            const skyW = w * 0.8;
            const skyH = h * 0.6;
            const skyX = left + (w - skyW) / 2;
            const skyY = top + (h - skyH) / 2;

            // Sky
            p.noStroke();
            p.fill(135, 206, 235);
            p.rect(skyX, skyY, skyW, skyH, 8);

            // Mountain
            const peakHeight = skyH * 0.8;
            const peakX = skyX + skyW / 2;
            const peakY = skyY + skyH - peakHeight;

            p.fill(34, 139, 34);
            p.triangle(
                peakX, peakY,
                skyX, skyY + skyH,
                skyX + skyW, skyY + skyH
            );

            // Snow cap based on dataset
            const snowCapHeight = (currentSnow / maxSnowPack) * peakHeight;
            const snowLineY = peakY + snowCapHeight;
            const totalBaseWidth = skyW;
            const currentWidth = (snowCapHeight / peakHeight) * totalBaseWidth;
            const snowLeftX = peakX - currentWidth / 2;
            const snowRightX = peakX + currentWidth / 2;

            p.fill(255);
            p.triangle(
                peakX, peakY,
                snowLeftX, snowLineY,
                snowRightX, snowLineY
            );

            // Year label
            p.fill(0);
            p.textSize(16);
            p.text(
                "Year: " + yearStart[yearIndex],
                skyX + 10,
                skyY + 20
            );

            p.pop();
        }
    };

})();