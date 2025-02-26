namespace tgtrends_front.DTO;

public class ChannelMessageDto
{
    public long ID { get; set; }
        
    public long MessageID { get; set; }
    public long TgChannelID { get; set; }
    public string Message { get; set; }

    public string MediaPath { get; set; }
    public DateTime CreatedAt { get; set; }

    public TgChannelDto TgChannel { get; set; }
}