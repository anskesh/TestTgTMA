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
        const slider = document.querySelector(sliderSelector);
        if (!slider) return;
        
        let lastIndex = -1;
        
        slider.addEventListener('scroll', function (event) {
            const messages = slider.querySelectorAll(messageSelector);
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
