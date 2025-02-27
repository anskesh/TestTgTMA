using tgtrends_front.DTO;

namespace tgtrends_front.Data;

public class MessageData
{
    public long ID { get; private set; }

    public string Text { get; private set; }
    public string? ImgUrl { get; private set; }
    public int LikesCount { get; private set; }
    public int CommentsCount { get; private set; }
    
    public ChannelData ChannelData { get; private set; }

    public MessageData()
    {
        Text = "В Кирове цыганка наебала фармацевта на 5 тысяч прямо в аптеке.\n                    Купив лекарства, \n                    она внезапно заявила, что на девушке порча, и попросила для доказательства написать текст и посыпать его пылью. \nПока фармацевт отвлеклась, «ведьма» начертила мылом крест. Пыль насыпали — крест проявился! За снятие порчи пришлось отвалить 5000 рублей. \nЦыганка исчезла, а фармацевт потом увидела запись с камер, где магия раскрылась.";
        ImgUrl = "https://yaroslavsky.mos.ru/upload/medialibrary/2eb/6dh99g2851e2mtgb0wf1zo6hc5opna3t/photo_2022_05_16_18_50_38.jpg";
        LikesCount = 1300;
        CommentsCount = 933;
    }

    public MessageData(ChannelMessageDto message, string? image, ChannelData channel)
    {
        ID = message.MessageID;
        Text = message.Message;

        ImgUrl = image;
        ChannelData = channel;
    }
}