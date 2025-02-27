window.messagesPreloaded = function () {
    let loading = document.getElementById("loading");

    loading.style.opacity = "0";
    setTimeout(() => {
        loading.style.display = "none";
    }, 100);
}

window.getElementHeight = (element) => {
    return element ? element.offsetHeight : 0;
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
