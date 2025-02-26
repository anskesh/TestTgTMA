using tgtrends_front.DTO;

namespace tgtrends_front.Data;

public class ChannelData
{
    public long ID { get; private set; }

    public string Name { get; private set; }
    public string ImgUrl { get; private set; }
    public string LastPostDate { get; private set; }

    public ChannelData()
    {
        Name = "Топор 18+";
        ImgUrl = "https://s9.travelask.ru/uploads/post/000/028/766/main_image/facebook-3703d50448b0b279bd310d3d2ce9f03d.jpg";
        LastPostDate = "20 hours ago";
    }

    public ChannelData(TgChannelDto channel, string image)
    {
        ID = channel.ID;
        Name = channel.ChanelName;
        ImgUrl = image;
        LastPostDate = "20 hours ago";
    }
}