(function () {

    let currentYear = 0;
    let isPlaying = true;

    let showClimate = false;
    let buttonCreated = false;
    let btn = null;

    window.VizMountain = {

        draw: function (p, manager, ai, progress) {

            if (!manager || !manager.snowPackTable) return;
            const table = manager.snowPackTable;
            const numberOfRows = table.getRowCount();
            if (numberOfRows === 0) return;

            // Determine if the mountain is visible
            const mountainVisible = manager.width > 0 && manager.height > 0; 

            // Create button only once, but append only if mountain is visible
            if (!buttonCreated) {
                btn = document.createElement("button");
                btn.innerHTML = "Show El Nino vs La Nina";
                btn.style.marginTop = "10px"; // optional: spacing from text

                btn.onclick = function () {
                    showClimate = !showClimate;
                };

                // Append button to the text section instead of #vis
                const textSection = document.querySelector('section.step[data-active-index="7"]'); 
                if (textSection) {
                    textSection.appendChild(btn);
                }

                buttonCreated = true;
            }

            // Append or remove button based on mountain visibility
            if (btn) {
                const visContainer = document.getElementById("vis");
                if (mountainVisible && !btn.parentElement) {
                    visContainer.appendChild(btn);
                } else if (!mountainVisible && btn.parentElement) {
                    btn.parentElement.removeChild(btn);
                }
            }

            // Populate arrays safely
            const yearStart = [];
            const snowPack = [];
            const laNina = [];

            for (let i = 0; i < numberOfRows; i++) {
                const row = table.getRow(i);

                const yearVal = row.arr[0];
                const snowVal = row.arr[2];
                let climateVal = "";
                if (row.arr.length > 4 && row.arr[4] != null) climateVal = row.arr[4];

                yearStart[i] = yearVal !== undefined ? yearVal : 0;
                snowPack[i] = snowVal !== undefined ? snowVal : 0;
                laNina[i] = (climateVal.toString().toLowerCase() === "true");
            }

            const maxSnowPack = Math.max(...snowPack, 1);

            if (isPlaying) {
                currentYear += 0.02;
                if (currentYear >= numberOfRows) currentYear = 0;
            }

            const yearIndex = Math.floor(currentYear);
            if (yearIndex >= yearStart.length) return;

            const currentSnow = snowPack[yearIndex] || 0;

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
            p.triangle(peakX, peakY, skyX, skyY + skyH, skyX + skyW, skyY + skyH);

            const snowCapHeight = (currentSnow / maxSnowPack) * peakHeight;
            const snowLineY = peakY + snowCapHeight;

            const totalBaseWidth = skyW;
            const currentWidth = (snowCapHeight / peakHeight) * totalBaseWidth;

            const snowLeftX = peakX - currentWidth / 2;
            const snowRightX = peakX + currentWidth / 2;

            p.fill(255);
            p.triangle(peakX, peakY, snowLeftX, snowLineY, snowRightX, snowLineY);

            p.fill(0);
            p.textSize(16);
            p.text("Year: " + String(yearStart[yearIndex]), skyX + 10, skyY + 20);

            if (showClimate) {
                const climateLabel = laNina[yearIndex] ? "La Nina" : "El Nino";
                p.text("Climate: " + String(climateLabel), skyX + 10, skyY + 40);
            }

            p.pop();
        }
    };

})();