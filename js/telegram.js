let tg = window.Telegram.WebApp;
tryResizeView();

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

window.getTelegramPlatform = function () {
    return tg?.platfrom;
}

window.openTelegramLink = function (channelId, messageId){
    let url = `https://t.me/c/${channelId}/${messageId}`;
    tg?.openTelegramLink(url);
}