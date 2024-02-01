﻿using Backend.Entities;
using Backend.Helpers;
using Backend.Repositories;
using Backend.Services;
using Backend.Models.Account;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs;

public class NotificationHub : ApplicationHub
{
    private readonly IMapper _mapper;
    private readonly IAccountService _accountService;
    private readonly IMessageService _messageService;
    private readonly IAccountRepository _accountRepository;
    private readonly INotificationService _notificationService;
    private readonly IMatchedProfilesService _matchedProfilesService;

    public NotificationHub(
        IMapper mapper,
        IAccountService accountService,
        IAccountRepository accountRepository,
        INotificationService notificationService,
        IMatchedProfilesService matchedProfilesService,
        IMessageService messageService
    ) {
        _mapper = mapper;
        _accountService = accountService;
        _accountRepository = accountRepository;
        _notificationService = notificationService;
        _matchedProfilesService = matchedProfilesService;
        _messageService = messageService;
    }

    public override Task OnConnectedAsync()
    {
        var currUserId = CurrentAccountId;

        _connectedNotificationClients.AddOrUpdate(
            currUserId,
            new List<string>() { Context.ConnectionId },
            (_, existingList) =>
            {
                existingList.Add(Context.ConnectionId);
                return existingList;
            }
        );

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        var userId = CurrentAccountId;

        if (_connectedNotificationClients.TryGetValue(userId, out var connectionIds))
        {
            connectionIds.Remove(Context.ConnectionId);

            if (connectionIds.Count == 0)
            {
                _connectedNotificationClients.TryRemove(userId, out _);
            }
        }

        return base.OnDisconnectedAsync(exception);
    }

    public async Task LikeProfile(string likedAccountId)
    {
        if (!Guid.TryParse(likedAccountId, out var parsedLikedAccountId))
        {
            throw new AppException("Provided invalid id");
        }

        var currUserId = CurrentAccountId;

        _accountService.LikeAccount(currUserId, parsedLikedAccountId);
        var acc = _accountRepository.Get(currUserId);
        var likedAcc = _accountRepository.Get(parsedLikedAccountId);
        likedAcc.FameRating += 5;

        var newNotify = _notificationService.AddProfileLiked(acc.Username, parsedLikedAccountId);

        await sendLikeProfileEvent(currUserId);

        await sendAddNotification(parsedLikedAccountId, newNotify);

        bool isProfilesMatched = _matchedProfilesService.IsTwoProfileMatched(currUserId, parsedLikedAccountId);
        if (isProfilesMatched)
        {
            likedAcc.FameRating += 5;
            acc.FameRating += 5;
            var matchedNotify = _notificationService.AddProfileMatched(acc.Username, parsedLikedAccountId);
            _messageService.CreateChat(currUserId, parsedLikedAccountId);
            await profilesMatched(parsedLikedAccountId);
            await sendAddNotification(parsedLikedAccountId, matchedNotify);
        }

        _accountRepository.Update(likedAcc);
        _accountRepository.Update(acc);
    }

    public async Task DislikeProfile(string unlikedProfileId)
    {
        if (!Guid.TryParse(unlikedProfileId, out var parsedUnlikedProfileId))
        {
            throw new AppException("Provided invalid id");
        }

        var currUserId = CurrentAccountId;
        bool isProfilesWasMatched = _matchedProfilesService.IsTwoProfileMatched(currUserId, parsedUnlikedProfileId);
        _accountService.DislikeAccount(currUserId, parsedUnlikedProfileId);
        var acc = _accountRepository.Get(currUserId);
        var unlikedAcc = _accountRepository.Get(parsedUnlikedProfileId);
        unlikedAcc.FameRating -= 5;

        var newNotify = _notificationService.AddProfileUnliked(acc.Username, parsedUnlikedProfileId);

        await sendDislikeProfileEvent(currUserId);

        await sendAddNotification(parsedUnlikedProfileId, newNotify);

        if (isProfilesWasMatched)
        {
            acc.FameRating -= 5;
            unlikedAcc.FameRating -= 5;
            _messageService.DeleteChat(currUserId, parsedUnlikedProfileId);
            await profilesUnmatched(parsedUnlikedProfileId);
        }

        _accountRepository.Update(acc);
        _accountRepository.Update(unlikedAcc);
    }

    public void UnfavoriteProfile(string unfavoriteProfileId)
    {
        if (!Guid.TryParse(unfavoriteProfileId, out var parsedUnfavoriteProfileId))
        {
            throw new AppException("Provided invalid id");
        }

        _accountRepository.AddUnfavoriteProfile(new UnfavoriteProfile() 
        { 
            DislikedById = CurrentAccountId, 
            UnfavoriteAccountId = parsedUnfavoriteProfileId
        });
    }

    public async Task ProfileView(string viewedProfileId)
    {
        if (!Guid.TryParse(viewedProfileId, out var parsedViewedProfileId))
        {
            throw new AppException("Provided invalid id");
        }

        var currUserId = CurrentAccountId;
        if (currUserId == parsedViewedProfileId) { return; }

        var acc = _accountRepository.Get(currUserId);
        _accountService.AddProfileView(currUserId, parsedViewedProfileId);
        var viewedAcc = _accountRepository.Get(parsedViewedProfileId);
        viewedAcc.FameRating++;

        var newNotify = _notificationService.AddProfileViewed(acc.Username, parsedViewedProfileId);

        await updateProfileViewsCache(
            _mapper.Map(acc, new AccountsResponse()),
            _mapper.Map(viewedAcc, new AccountsResponse())
        );
        await sendAddNotification(parsedViewedProfileId, newNotify);

        _accountRepository.Update(viewedAcc);
    }

    public async Task NotifyMessageReceived(string interlocutorId, Notification notification)
    {
        if (!Guid.TryParse(interlocutorId, out var parsedInterlocutorId))
        {
            throw new AppException("Provided invalid id");
        }

        await sendAddNotification(parsedInterlocutorId, notification);
    }

    public async Task DeleteNotification(string notificationId)
    {
        if (!Guid.TryParse(notificationId, out var parsedNotificationId))
        {
            throw new AppException("Provided invalid id");
        }

        _notificationService.DeleteNotification(parsedNotificationId);

        await sendDeleteNotification(CurrentAccountId, parsedNotificationId);
    }

    private async Task updateProfileViewsCache(AccountsResponse acc, AccountsResponse viewedAcc)
    {
        // update current user cache 
        if (_connectedNotificationClients.TryGetValue(acc.Id, out var currUserIds))
        {
            foreach (var connectionId in currUserIds)
            {
                await Clients.Client(connectionId).SendAsync("AddViewedProfile", viewedAcc);
            }
        }

        // update viewed profile's cache 
        if (_connectedNotificationClients.TryGetValue(viewedAcc.Id, out var viewedProfileIds))
        {
            foreach (var connectionId in viewedProfileIds)
            {
                await Clients.Client(connectionId).SendAsync("AddProfileMeViewed", acc);
            }
        }
    }

    private async Task sendLikeProfileEvent(Guid toUserId)
    {
        if (_connectedNotificationClients.TryGetValue(toUserId, out var connectionIds))
        {
            foreach (var connectionId in connectionIds)
            {
                await Clients.Client(connectionId).SendAsync("LikeProfile");
            }
        }
    }

    private async Task sendDislikeProfileEvent(Guid toUserId)
    {
        if (_connectedNotificationClients.TryGetValue(toUserId, out var connectionIds))
        {
            foreach (var connectionId in connectionIds)
            {
                await Clients.Client(connectionId).SendAsync("DislikeProfile");
            }
        }
    }

    private async Task sendDeleteNotification(Guid toUserId, Guid notificationId)
    {
        if (_connectedNotificationClients.TryGetValue(toUserId, out var connectionIds))
        {
            foreach (var connectionId in connectionIds)
            {
                await Clients.Client(connectionId).SendAsync("ReduceNotificationsCount");

                await Clients.Client(connectionId).SendAsync("DeleteNotification", notificationId);
            }
        }
    }

    private async Task sendAddNotification(Guid toUserId, Notification notification)
    {
        if (_connectedNotificationClients.TryGetValue(toUserId, out var connectionIds))
        {
            foreach (var connectionId in connectionIds)
            {
                await Clients.Client(connectionId).SendAsync("IncreaseNotificationsCount");

                await Clients.Client(connectionId).SendAsync("AddNotification",
                    notification.Id.ToString(), notification.Text, notification.Date.ToString());
            }
        }
    }

    private async Task profilesUnmatched(Guid parsedUnlikedProfileId)
    {
        await Clients.Client(Context.ConnectionId).SendAsync("ProfilesUnmatched");

        if (_connectedNotificationClients.TryGetValue(parsedUnlikedProfileId, out var connectionIds))
        {
            foreach (var connectionId in connectionIds)
            {
                await Clients.Client(connectionId).SendAsync("ProfilesUnmatched");
            }
        }
    }

    private async Task profilesMatched(Guid parsedLikedProfileId)
    {
        await Clients.Client(Context.ConnectionId).SendAsync("ProfilesMatched");

        if (_connectedNotificationClients.TryGetValue(parsedLikedProfileId, out var connectionIds))
        {
            foreach (var connectionId in connectionIds)
            {
                await Clients.Client(connectionId).SendAsync("ProfilesMatched");
            }
        }
    }
}
