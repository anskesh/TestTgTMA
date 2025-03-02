let tg = window.Telegram.WebApp;

tryResizeView();
applySafeArea();

function tryResizeView (){
    if (tg !== null) {
        if (tg.version < "8.0")
            return;
        
        if (tg.platform == "android" || tg.platform == "ios") {
            tg.requestFullscreen();
        }
        else {
            tg.exitFullscreen();
        }
    }
}

function applySafeArea(){
    const top_safe_area_padding = parseFloat(getProperty("--tg-safe-area-inset-top")) || 0;
    const content_inset_padding = parseFloat(getProperty("--tg-content-safe-area-inset-top")) || 0;
    const top_custom_padding = parseFloat(getProperty("--top-custom-padding")) || 0;

    const bottom_safe_area_padding = parseFloat(getProperty("--tg-safe-area-inset-bottom")) || 0;
    const bottom_custom_padding = parseFloat(getProperty("--bottom-custom-padding")) || 0;
    
    let top_padding = top_custom_padding + top_safe_area_padding;

    if (tg.isFullscreen)
        top_padding += content_inset_padding;
    
    if (top_padding == top_custom_padding)
        top_padding += top_custom_padding;
   
    let bottom_padding = bottom_custom_padding + bottom_safe_area_padding;

    setProperty("--top-safe-area", rem(bottom_padding));
    setProperty("--bottom-safe-area", rem(top_padding));
}

window.getTelegramPlatform = function () {
    return tg ? tg.platform : "notfound";
}

window.openTelegramLink = function (channelId, messageId){
    let url = `https://t.me/c/${channelId}/${messageId}`;
    tg?.openTelegramLink(url);
}