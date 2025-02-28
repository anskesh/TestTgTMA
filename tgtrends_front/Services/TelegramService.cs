using Microsoft.JSInterop;

namespace tgtrends_front.Services;

public class TelegramService
{
    public bool IsMobile => _platform == "android" || _platform == "ios";
    
    private readonly IJSRuntime _jsRuntime;
    private string _platform;

    public TelegramService(IJSRuntime jSRuntime)
    {
        _jsRuntime = jSRuntime;
        GetTelegramPlatform();
    }

    private async Task GetTelegramPlatform()
    {
        _platform = await _jsRuntime.InvokeAsync<string>("getTelegramPlatform");
    }
    
    public async Task GoToPostLink(long channelId, long messageId)
    {
        await _jsRuntime.InvokeVoidAsync("openTelegramLink", channelId, messageId);
    }
}