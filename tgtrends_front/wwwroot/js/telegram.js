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
    let top_safe_property = "--top-safe-area";
    let bottom_safe_property = "--bottom-safe-area";

    let top_padding_property = "--top-padding";
    let top_fullSize_padding_property = "--top-fullsize-padding";
    let bottom_padding_property = "--bottom-padding";

    let safeArea = tg.safeAreaInset;
    
    let top_fullSize_padding = parseFloat(getProperty(top_fullSize_padding_property)) || 0;
    let top_padding = parseFloat(getProperty(top_padding_property)) || 0;
    let bottom_padding = parseFloat(getProperty(bottom_padding_property)) || 0;
    
    let top_safe_padding = top_padding + safeArea.top;

    if (tg.isFullscreen)
        top_safe_padding += top_fullSize_padding;
   
    let bottom_safe_padding = bottom_padding + safeArea.bottom;

    setProperty(bottom_safe_property, rem(bottom_safe_padding));
    setProperty(top_safe_property, rem(top_safe_padding));
}

window.getTelegramPlatform = function () {
    return tg ? tg.platform : "notfound";
}

window.openTelegramLink = function (channelId, messageId){
    let url = `https://t.me/c/${channelId}/${messageId}`;
    tg?.openTelegramLink(url);
}