function rem(px){
    return px / 16 + "rem";
}

function setProperty(name, value){
    document.documentElement.style.setProperty(name, value);
}

function getProperty(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

window.messagesPreloaded = function () {
    applySafeArea();

    let loading = document.getElementById("loading");
    percentage = 100;
    updateProgress();
    
    setTimeout(() => {
        loading.style.opacity = "0";
        setTimeout(() => {
            loading.style.display = "none";
        }, 200)
    }, 250);
}

window.getElementHeight = (element) => {
    return element ? element.scrollHeight : 0;
}

window.scrollHandler = {
    init: function (sliderSelector, messageSelector, dotNetHelper) {
        let startY = 0;
        let currentY = 0;
        let index = 0;
        let isTouching = false;
        let container = document.querySelector(sliderSelector);
        const SWIPE_THRESHOLD = 50;

        if (!container) return;

        container.addEventListener("touchstart", (e) => {
            isTouching = true;
            startY = e.touches[0].clientY;
            currentY = startY;
        });

        container.addEventListener("touchmove", (e) => {
            if (!isTouching) return;
            let deltaY = e.touches[0].clientY - currentY;
            container.scrollTop -= deltaY;
            currentY = e.touches[0].clientY;
        });

        container.addEventListener("touchend", () => {
            isTouching = false;
            let diff = startY - currentY;

            if (Math.abs(diff) > SWIPE_THRESHOLD) {
                if (diff > 0) index++;
                else index--;
            }

            snapToIndex(index, dotNetHelper);
        });

        let isScrolling = false;
        
        container.addEventListener("wheel", (e) => {
            if (isScrolling) return;
            isScrolling = true;

            if (e.deltaY > 0) index++;
            else index--;

            snapToIndex(index, dotNetHelper);

            setTimeout(() => isScrolling = false, 500);
        });

        function snapToIndex(i, dotNetHelper) {
            const posts = document.querySelectorAll(messageSelector);

            if (i < 0) i = 0;
            if (i >= posts.length) i = posts.length - 1;
            index = i;

            if (posts[i]) {
                smoothScrollTo(posts[i]);
                dotNetHelper.invokeMethodAsync("OnScrollIndexChanged", i);
            }
        }

        function smoothScrollTo(element, duration = 300) {
            let start = window.scrollY || container.scrollTop;
            let end = element.getBoundingClientRect().top + start;
            let startTime = performance.now();

            function scrollStep(timestamp) {
                let progress = (timestamp - startTime) / duration;
                if (progress > 1) progress = 1;

                let easeInOut = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                container.scrollTo(0, start + (end - start) * easeInOut);

                if (progress < 1) {
                    requestAnimationFrame(scrollStep);
                }
            }

            requestAnimationFrame(scrollStep);
        }
    }
};


