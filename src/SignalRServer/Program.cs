using SignalRTest.Hubs.SignalRWebpack;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddLogging();
builder.Services.AddCors(options => options.AddPolicy("CorsPolicy", builder =>
{
    builder
    //.AllowAnyOrigin()
    .WithOrigins( "https://192.168.0.110")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .SetIsOriginAllowed((host) => true)
    .AllowCredentials();
}));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("CorsPolicy");
app.MapGet("/", () => "Hello World!");
app.MapHub<ChatHub>("/hub");

app.Run();
