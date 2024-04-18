async function hoverIMG() {
    const page = (await import("../extras/page.js")).default;
    
    var images = document.getElementsByClassName("cover");

    for (var i = 0; i < images.length; i++) {
        (function() {
            var originalHeight = images[i].offsetHeight;
            var originalWidth = images[i].offsetWidth;
            var parentDivClass;
            var parentDivClassMainPage;

            images[i].addEventListener("mouseover", function() {
                parentDivClassMainPage = this.parentNode.parentNode.parentNode.className;
                parentDivClass = this.parentNode.className;

                if (page(/^\/search\/(anime|manga)$/) &&
                    (!parentDivClassMainPage.includes("top"))) {
                    this.style.zIndex = "9";
                    this.style.transform = "scale(1.3)";

                    // Получаем текстовый элемент
                    var titleElement = this.nextElementSibling;
                    // Изменяем позиционирование и размеры текстового элемента
                    titleElement.style.position = "absolute";
                    titleElement.style.bottom = "0";
                    titleElement.style.left = "0";
                    titleElement.style.transition = "all 0.3s ease";
                    titleElement.style.transform = "translateY(100%)";

                }

                if (page(/^\/(anime|manga)\/\d+\/[\w\d-_]+(\/)?$/) &&
                    (parentDivClass.includes("media-preview-card") ||
                    parentDivClass.includes("character") ||
                    parentDivClass.includes("staff"))
                ) {
                    this.style.zIndex = "99";
                    this.style.position = "absolute";
                    this.style.width = originalWidth * 2 + "px";
                    this.style.height = originalHeight * 2 + "px";
                } 
            });

            images[i].addEventListener("mouseout", function() {
                if (page(/^\/search\/(anime|manga)$/)) {
                    this.style.zIndex = "";
                    this.style.transform = "scale(1)";

                    var titleElement = this.nextElementSibling;
                    titleElement.style.position = "relative";
                    titleElement.style.bottom = "";
                    titleElement.style.left = "";
                    titleElement.style.transform = "";

                    titleElement.style.background = "";
                    titleElement.style.borderRadius = "";
                    titleElement.style.padding = "";
                } else {
                    this.style.transform = "scale(1)";
                }

                if (page(/^\/(anime|manga)\/\d+\/[\w\d-_]+(\/)?$/) &&
                    (parentDivClass.includes("media-preview-card") ||
                    parentDivClass.includes("character") ||
                    parentDivClass.includes("staff"))
                ) {
                    this.style.zIndex = "auto";
                    this.style.position = "relative";
                    this.style.width = originalWidth + "px";
                    this.style.height = originalHeight + "px";
                }
            });
        })(i);
    }
}

export default hoverIMG;