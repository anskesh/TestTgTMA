namespace tgtrends_front.DTO;

public class TgUserDto
{
    public long ID { get; set; }
    public long TelegramUserId { get; set; }
    public string Username { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<TgChannelDto> TgChannels { get; set; } = new();
    //public List<TgTagDto> Tags { get; set; } = new();
}