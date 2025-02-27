using System.Net.Http.Json;
using System.Text.Json;
using tgtrends_front.DTO;

namespace tgtrends_front.Services;

public class ApiClient
{
    private const string BaseUrl = "https://sandbox-rp.ru/api";
    private readonly HttpClient _httpClient;

    public ApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<TgUserDto> GetUserAsync(long userId)
    {
        string url = $"{BaseUrl}/users/{userId}/get_user";
        return await GetAsync<TgUserDto>(url);
    }

    public async Task<TgChannelDto> GetChannelAsync(long channelId)
    {
        string url = $"{BaseUrl}/channels/{channelId}/getchannel";
        return await GetAsync<TgChannelDto>(url);
    }

    public async Task<byte[]?> GetChannelImageAsync(long channelId)
    {
        string url = $"{BaseUrl}/channels/{channelId}/image";
        try
        {
            return await _httpClient.GetByteArrayAsync(url);
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"{e.StatusCode} error while loading channel image.");
            return null;
        }
    }

    public async Task<List<ChannelMessageDto>> GetChannelMessagesAsync(long channelId = 1343028414)
    {
        string url = $"{BaseUrl}/messages/channel/{channelId}";
        return await GetAsync<List<ChannelMessageDto>>(url);
    }

    public async Task<byte[]?> GetMessageImageAsync(long channelId, long messageId)
    {
        string url = $"{BaseUrl}/messages/{messageId}/channel/{channelId}/image";
        try
        {
            return await _httpClient.GetByteArrayAsync(url);
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"{e.StatusCode} error while loading message image.");
            return null;
        }
    }

    public async Task<List<TgChannelDto>> GetAllChannelsAsync()
    {
        string url = $"{BaseUrl}/channels/get_all";
        return await GetAsync<List<TgChannelDto>>(url);
    }

    public async Task<ResultContainerDto> SubscribeToChannelAsync(long userId, string channelName)
    {
        string url = $"{BaseUrl}/users/channel/subscribe";
        var formData = new Dictionary<string, string>
        {
            { "userId", userId.ToString() },
            { "channelName", channelName }
        };
        return await PostAsync<ResultContainerDto>(url, formData);
    }

    public async Task<bool> AddUserAsync(long userId)
    {
        string url = $"{BaseUrl}/users/add";
        var formData = new Dictionary<string, string> { { "userId", userId.ToString() } };
        return await PostAsync<bool>(url, formData);
    }

    public async Task<ResultContainerDto> AddNewChannelAsync(string channelName)
    {
        string url = $"{BaseUrl}/channels/add/";
        var formData = new Dictionary<string, string> { { "channelName", channelName } };
        return await PostAsync<ResultContainerDto>(url, formData);
    }

    private async Task<T> GetAsync<T>(string url)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<T>(url);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"GET request error ({url}): {ex.Message}");
            return default;
        }
    }

    private async Task<T> PostAsync<T>(string url, Dictionary<string, string> formData)
    {
        try
        {
            var content = new FormUrlEncodedContent(formData);
            HttpResponseMessage response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"POST request error ({url}): {response.ReasonPhrase}");
                return default;
            }

            string responseString = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка POST запроса ({url}): {ex.Message}");
            return default;
        }
    }
}