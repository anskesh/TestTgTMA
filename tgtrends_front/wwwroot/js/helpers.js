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
        let isAnimating = false;
        
        let container = document.querySelector(sliderSelector);
        
        const SWIPE_THRESHOLD = 30;

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
            e.preventDefault();
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
            e.preventDefault();
            
            if (isScrolling) return;
            isScrolling = true;

            if (e.deltaY > 0) index++;
            else index--;

            snapToIndex(index, dotNetHelper, 400);

            setTimeout(() => isScrolling = false, 500);
        });

        function snapToIndex(i, dotNetHelper, duration = 200) {
            let posts = document.querySelectorAll(messageSelector);

            if (i < 0) i = 0;
            if (i >= posts.length) i = posts.length - 1;
            index = i;

            if (posts[i]) {
                smoothScrollTo(posts[i], duration);
                dotNetHelper.invokeMethodAsync("OnScrollIndexChanged", i);
            }
        }

        function smoothScrollTo(element, duration) {
            if (isAnimating) return;
            isAnimating = true;

            let start = container.scrollTop;
            let end = element.offsetTop;
            let startTime = performance.now();

            function animateScroll(timestamp) {
                let progress = (timestamp - startTime) / duration;
                if (progress > 1) progress = 1;

                let easeOutQuad = 1 - (1 - progress) * (1 - progress);

                container.scrollTop = start + (end - start) * easeOutQuad;

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    isAnimating = false;
                }
            }

            requestAnimationFrame(animateScroll);
        }
    }
};



