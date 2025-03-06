using Microsoft.JSInterop;
using tgtrends_front.Data;
using tgtrends_front.DTO;

namespace tgtrends_front.Services;


public class ChannelsService
{
    public event Action OnMessagesUpdated;

    public List<MessageData> Messages => _messages;

    private readonly ApiClient _apiClient;
    private readonly IJSRuntime _jsRuntime;
    private readonly int _preloadedMessagesCount = 5;

    private TgUserDto _user;
    private List<ChannelData> _tgChannels = new();
    private List<ChannelMessageDto> _tgMessages = new();

    private List<MessageData> _messages = new();
    private List<int> _loadingIds = new();
    private List<long> _loadingMessagesIds = new();

    public ChannelsService(ApiClient apiClient, IJSRuntime jsRuntime)
    {
        _apiClient = apiClient;
        _jsRuntime = jsRuntime;
        
        PreloadMessages();
    }

    private async Task PreloadMessages()
    {
        _user = await _apiClient.GetUserAsync(1);
        List<TgChannelDto> channels = _user.TgChannels;
        var loadChannelsTasks = new List<Task>();

        foreach (TgChannelDto channel in channels)
        {
            loadChannelsTasks.Add(LoadChannel(channel));
        }

        await Task.WhenAll(loadChannelsTasks);

        Console.WriteLine($"Loaded {channels.Count} channels");

        var loadMessagesTasks = new List<Task>();

        for (int i = 0; i < _preloadedMessagesCount; i++)
        {
            loadMessagesTasks.Add(LoadMoreMessages(i, true));
        }

        await Task.WhenAll(loadMessagesTasks);
        MessagesPreloaded();
    }

    private void MessagesPreloaded()
    {
        _jsRuntime.InvokeVoidAsync("messagesPreloaded");
    }

private async Task LoadChannel(TgChannelDto channel)
    {
        ChannelData channelData = new ChannelData(channel, GetImageBase64Async(await _apiClient.GetChannelImageAsync(channel.ID)));
        List<ChannelMessageDto> messages = await _apiClient.GetChannelMessagesAsync(channel.ID);
        
        _tgChannels.Add(channelData);
        _tgMessages.AddRange(messages);
    }

    public async Task LoadMoreMessages(int currentIndex, bool force = false)
    {
        if (_loadingIds.Contains(currentIndex)) return;
        
        if (!force && currentIndex < _messages.Count - _preloadedMessagesCount)
            return;
        
        Console.WriteLine($"Loading new message {currentIndex}");
        
        if (!force)
            _loadingIds.Add(currentIndex);
        
        int nextGroupIndex = currentIndex % _tgChannels.Count;
        ChannelData channelData = _tgChannels[nextGroupIndex];
        var channelMessages = _tgMessages.Where(x => x.TgChannelID == channelData.ID).ToList();

        foreach (var message in channelMessages)
        {
            bool alreadyAdded = _messages.Any(x => x.ID == message.MessageID) && _loadingMessagesIds.Contains(message.MessageID);
            
            if (!alreadyAdded)
            {
                _loadingMessagesIds.Add(message.MessageID);
                await LoadMessage(channelData, message);
                Console.WriteLine("Loaded new message");
                return;
            }
        }
    }

    private async Task LoadMessage(ChannelData channelData, ChannelMessageDto message)
    {
        byte[]? imageBytes = await _apiClient.GetMessageImageAsync(channelData.ID, message.MessageID);
        MessageData messageData = new MessageData(message, GetImageBase64Async(imageBytes), channelData);
        _messages.Add(messageData);
        OnMessagesUpdated?.Invoke();
    }

    private string? GetImageBase64Async(byte[]? imageBytes)
    {
        return imageBytes != null ? $"data:image/png;base64,{Convert.ToBase64String(imageBytes)}" : null;
    }
}