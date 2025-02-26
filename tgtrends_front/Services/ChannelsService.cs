using tgtrends_front.Data;
using tgtrends_front.DTO;

namespace tgtrends_front.Services;

public class ChannelsService
{
    public event Action OnMessagesUpdated;
    public List<MessageData> Messages => _messages;
    
    private readonly ApiClient _apiClient;
    private readonly int _preloadedMessagesCount = 5;
    
    private TgUserDto _user;
    private List<TgChannelDto> _tgChannels = new();
    private List<MessageData> _messages = new();
    
    public ChannelsService(ApiClient apiClient)
    {
        _apiClient = apiClient;
        PreloadMessages();
    }

    private async Task PreloadMessages()
    {
        _user = await _apiClient.GetUserAsync(1);
        _tgChannels = _user.TgChannels;
        
        foreach (TgChannelDto channel in _tgChannels)
        {
            ChannelData channelData = new ChannelData(channel, GetImageBase64Async(await _apiClient.GetChannelImageAsync(channel.ID)));
            List<ChannelMessageDto> messages = await _apiClient.GetChannelMessagesAsync(channel.ID);
            
            foreach (var message in messages)
            {
                if (_messages.Count >= _preloadedMessagesCount)
                    return;

                await LoadMessage(channelData, message);
            }
        }
    }

    private async Task LoadMessage(ChannelData channelData, ChannelMessageDto message)
    {
        byte[] imageBytes = await _apiClient.GetMessageImageAsync(channelData.ID, message.MessageID);
        MessageData messageData = new MessageData(message, GetImageBase64Async(imageBytes), channelData);
        _messages.Add(messageData);
        OnMessagesUpdated?.Invoke();
    }

    private string GetImageBase64Async(byte[] imageBytes)
    {
        return imageBytes != null ? $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}" : null;
    }

}