using Backend.Authorization;
using Backend.Helpers;
using Backend.Repositories;
using Backend.Services;
using Backend.Hubs;
using MiniORM;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
{
    var services = builder.Services;
    
    services.AddControllers();
    services.AddSignalR();

    // configure strongly typed settings object
    services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

    // configure DI for application services
    services.AddTransient<IDBContext>(_ => new DbContext(connString));
    services.AddScoped<IAccountService, AccountService>();
    services.AddScoped<IAccountRepository, AccountRepository>();
    services.AddScoped<IJwtUtils, JwtUtils>();
    services.AddScoped<IEmailService, EmailService>();
    services.AddScoped<IMessageService, MessageService>();
    services.AddScoped<IMessageRepository, MessageRepository>();
    services.AddScoped<INotificationService, NotificationService>();
    services.AddScoped<INotificationRepository, NotificationRepository>();
    services.AddScoped<IMatchedProfilesService, MatchedProfilesService>();
    services.AddScoped<IMatchedProfilesRepository, MatchedProfilesRepository>();
    services.AddScoped<IBlockedProfileService, BlockedProfileService>();
    services.AddScoped<IBlockedProfileRepository, BlockedProfileRepository>();
    services.AddScoped<IEventService, EventService>();
    services.AddScoped<IEventRepository, EventRepository>();
    services.AddSingleton<IPasswordHasher, PasswordHasher>();
    services.AddSingleton<IMapper, Mapper>();
    services.AddHttpClient();

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// global cors policy
var allowedOrigins = new[] { builder.Configuration.GetSection("AppSettings")["FrontendHost"] };

app.UseCors(x => x
    .WithOrigins(allowedOrigins)
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());

// global error handler
app.UseMiddleware<ErrorHandlerMiddleware>();
// custom jwt auth middleware
app.UseMiddleware<JwtMiddleware>();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
            Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});

app.MapControllers();

app.MapHub<MessageHub>("/hub/message");
app.MapHub<NotificationHub>("hub/notification");

app.Run();
