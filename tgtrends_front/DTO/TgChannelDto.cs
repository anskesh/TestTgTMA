namespace tgtrends_front.DTO;

public class TgChannelDto
{
    public long ID { get; set; }
    public string ChanelName { get; set; }
    public string Description { get; set; } = "";
    
    public string ChannelImagePath { get; set; }
}