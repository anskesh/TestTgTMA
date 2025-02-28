window.messagesPreloaded = function () {
    let loading = document.getElementById("loading");

    loading.style.opacity = "0";
    setTimeout(() => {
        loading.style.display = "none";
    }, 100);
}

window.getElementHeight = (element) => {
    return element ? element.scrollHeight : 0;
}

window.scrollHandler = {
    init: function (sliderSelector, messageSelector, dotNetHelper) {
        const slider = document.querySelector("." + sliderSelector);
        if (!slider) return;
        
        let lastIndex = -1;
        
        slider.addEventListener('scroll', function (event) {
            const messages = slider.querySelectorAll("." + messageSelector);
            const sliderHeight = slider.clientHeight;
            
            messages.forEach((message, index) => {
                const rect = message.getBoundingClientRect();
                const isVisible = rect.top > 0 && rect.top < sliderHeight;
                
                if (isVisible && lastIndex !== index) {
                    lastIndex = index;
                    dotNetHelper.invokeMethodAsync("OnScrollIndexChanged", index);
                }
            })
        })
    }
}

window.customScroll = {
    init: function (elementId, sensitivity) {
        const slider = document.getElementById(elementId);
        if (!slider) return;

        let startY = 0;
        let scrollTop = 0;

        slider.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            scrollTop = slider.scrollTop;
        });

        slider.addEventListener('touchmove', (e) => {
            const deltaY = (e.touches[0].clientY - startY) * sensitivity;
            slider.scrollTop = scrollTop - deltaY;
            e.preventDefault();
        });
    }
};
