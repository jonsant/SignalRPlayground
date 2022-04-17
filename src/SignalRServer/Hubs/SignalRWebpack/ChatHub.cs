using Microsoft.AspNetCore.SignalR;

namespace SignalRTest.Hubs.SignalRWebpack
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> logger;

        public ChatHub(ILogger<ChatHub> logger)
        {
            this.logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            logger.LogInformation("Connection Established");
        }

        [HubMethodName("SendMessageToAll")]
        public async Task NewMessage(long username, string message)
        {
            await Clients.All.SendAsync("messageReceived", username, message);
            logger.LogInformation("Message sent by {user}: {msg}", username, message);
        }
    }
}
