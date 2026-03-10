(function () {

    let currentYear = 0;
    let isPlaying = true;

    let showClimate = false;
    let buttonCreated = false;

    window.VizMountain = {

        draw: function (p, manager, ai, progress) {

            // Create button to show El Nino vs La Nina
            if (!buttonCreated) {

                const visContainer = document.getElementById("vis");

                const btn = document.createElement("button");
                btn.innerHTML = "Show El Nino vs La Nina";
                btn.style.position = "absolute";
                btn.style.top = "60px";
                btn.style.right = "70px";
                btn.style.zIndex = "1000";

                btn.onclick = function () {
                    showClimate = !showClimate;
                };

                visContainer.appendChild(btn);

                buttonCreated = true;
            }

            const table = manager.snowPackTable;
            const numberOfRows = table.getRowCount();

            const yearStart = [];
            const snowPack = [];
            const laNina = [];

            for (let i = 0; i < numberOfRows; i++) {
                yearStart[i] = table.getNum(i, 0);
                snowPack[i] = table.getNum(i, 2);
                laNina[i] = table.getString(i, 4) === "true";
            }

            const maxSnowPack = Math.max(...snowPack);

            if (isPlaying) {
                currentYear += 0.02;
                if (currentYear >= numberOfRows) currentYear = 0;
            }

            const yearIndex = Math.floor(currentYear);
            const currentSnow = snowPack[yearIndex];

            p.push();

            const left = manager.offsetX;
            const top = manager.offsetY;
            const w = manager.width;
            const h = manager.height;

            const skyW = w * 0.8;
            const skyH = h * 0.6;
            const skyX = left + (w - skyW) / 2;
            const skyY = top + (h - skyH) / 2;

            p.noStroke();
            p.fill(135, 206, 235);
            p.rect(skyX, skyY, skyW, skyH, 8);

            const peakHeight = skyH * 0.8;
            const peakX = skyX + skyW / 2;
            const peakY = skyY + skyH - peakHeight;

            p.fill(34, 139, 34);
            p.triangle(
                peakX, peakY,
                skyX, skyY + skyH,
                skyX + skyW, skyY + skyH
            );

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

            p.fill(0);
            p.textSize(16);

            p.text(
                "Year: " + yearStart[yearIndex],
                skyX + 10,
                skyY + 20
            );

            if (showClimate) {
                let climateLabel = laNina[yearIndex] ? "La Nina" : "El Nino";
                p.text(
                    "Climate: " + climateLabel,
                    skyX + 10,
                    skyY + 40
                );
            }

            p.pop();
        }
    };

})();