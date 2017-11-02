//Adds support forthe old Youtube layout
/*global createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastVideoID = false;
var currIMG = "";

function setupOld()
{
	var youtubeInfoHandler = createNewMusicInfo();

	youtubeInfoHandler.player = function()
	{
		return "Youtube";
	};

	youtubeInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("watch-title").length > 0 &&
			document.getElementsByClassName("watch-title")[0].innerText.length > 0;
	};

	youtubeInfoHandler.state = function()
	{
		var state = document.getElementsByClassName("html5-main-video")[0].paused ? 2 : 1;
		if (document.getElementsByClassName("ytp-play-button")[0].getAttribute("aria-label") === null)
		{
			state = 3;
		}
		//It is possible for the video to be "playing" but not started
		if (state == 1 && document.getElementsByClassName("html5-main-video")[0].played.length <= 0)
		{
			state = 2;
		}
		return state;
	};
	youtubeInfoHandler.title = function()
	{
		return document.getElementsByClassName("watch-title")[0].innerText;
	};
	youtubeInfoHandler.artist = function()
	{
		return document.getElementsByClassName("yt-user-info")[0].children[0].innerText;
	};
	youtubeInfoHandler.album = function()
	{
		//If using a playlist just use the title of that
		if (document.getElementsByClassName("playlist-title").length > 0)
		{
			return document.getElementsByClassName("playlist-title")[0].innerText;
		}
		//Return category if nothing else
		return document.getElementsByClassName("watch-info-tag-list")[0].children[0].children[0].innerText;
	};
	youtubeInfoHandler.cover = function()
	{
		var videoID = window.location.href.substring(window.location.href.indexOf("v=") + 2, window.location.href.indexOf("v=") + 2 + 11);

		if (lastVideoID !== videoID)
		{
			lastVideoID = videoID;
			var img = document.createElement('img');
			img.setAttribute('src', "https://i.ytimg.com/vi/" + videoID + "/maxresdefault.jpg?");
			img.addEventListener('load', function()
			{
				if (img.height > 90)
				{
					currIMG = "https://i.ytimg.com/vi/" + videoID + "/maxresdefault.jpg?";
				}
				else
				{
					currIMG = "https://i.ytimg.com/vi/" + videoID + "/mqdefault.jpg?";
				}
			});
			img.addEventListener('error', function()
			{
				currIMG = "https://i.ytimg.com/vi/" + videoID + "/mqdefault.jpg?";
			});
		}

		return currIMG;
	};
	youtubeInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("ytp-time-duration")[0].innerText;
	};
	youtubeInfoHandler.position = function()
	{
		return document.getElementsByClassName("html5-main-video")[0].currentTime;
	};
	youtubeInfoHandler.volume = function()
	{
		return document.getElementsByClassName("html5-main-video")[0].volume;
	};
	youtubeInfoHandler.rating = function()
	{
		//Check if thumbs button is active
		if (document.getElementsByClassName("like-button-renderer")[0].children[0].children[0].getAttribute("class").includes("hid"))
		{
			return 5;
		}
		if (document.getElementsByClassName("like-button-renderer")[0].children[2].children[0].getAttribute("class").includes("hid"))
		{
			return 1;
		}
		return 0;
	};
	youtubeInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("playlist-nav-controls")[0].children.length > 0)
		{
			return document.getElementsByClassName("playlist-nav-controls")[0].children[0].getAttribute("class").includes("toggled") ? 1 : 0;
		}
		return 0;
	};
	youtubeInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("playlist-nav-controls")[0].children.length > 0)
		{
			return document.getElementsByClassName("playlist-nav-controls")[0].children[1].getAttribute("class").includes("toggled") ? 1 : 0;
		}
		return 0;
	};


	var youtubeEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	youtubeEventHandler.readyCheck = null;

	youtubeEventHandler.playpause = function()
	{
		document.getElementsByClassName("ytp-play-button")[0].click();
	};
	//@TODO implement tab handling
	youtubeEventHandler.next = function()
	{
		document.getElementsByClassName("ytp-next-button")[0].click();
	};
	youtubeEventHandler.previous = function()
	{
		if (document.getElementsByClassName("ytp-prev-button")[0].getAttribute("aria-disabled") == "false")
		{
			document.getElementsByClassName("ytp-prev-button")[0].click();
		}
	};
	youtubeEventHandler.progressSeconds = function(position)
	{
		document.getElementsByClassName("html5-main-video")[0].currentTime = position;
	};
	youtubeEventHandler.volume = function(volume)
	{
		if (document.getElementsByClassName("html5-main-video")[0].muted && volume > 0)
		{
			document.getElementsByClassName("html5-main-video")[0].muted = false;
		}
		else if (volume == 0)
		{
			document.getElementsByClassName("html5-main-video")[0].muted = true;
		}
		document.getElementsByClassName("html5-main-video")[0].volume = volume;
	};
	youtubeEventHandler.repeat = function()
	{
		if (document.getElementsByClassName("playlist-nav-controls")[0].children.length > 0)
		{
			document.getElementsByClassName("playlist-nav-controls")[0].children[0].click();
		}
	};
	youtubeEventHandler.shuffle = function()
	{
		if (document.getElementsByClassName("playlist-nav-controls")[0].children.length > 0)
		{
			document.getElementsByClassName("playlist-nav-controls")[0].children[1].click();
		}
	};
	youtubeEventHandler.toggleThumbsUp = function()
	{
		//Google actually uses two different thumbs up buttons so check which one to click
		if (document.getElementsByClassName("like-button-renderer")[0].children[0].children[0].getAttribute("class").includes("hid"))
		{
			document.getElementsByClassName("like-button-renderer")[0].children[1].children[0].click();
		}
		else
		{
			document.getElementsByClassName("like-button-renderer")[0].children[0].children[0].click();
		}
	};
	youtubeEventHandler.toggleThumbsDown = function()
	{
		//Google actually uses two different thumbs down buttons so check which one to click
		if (document.getElementsByClassName("like-button-renderer")[0].children[2].children[0].getAttribute("class").includes("hid"))
		{
			document.getElementsByClassName("like-button-renderer")[0].children[3].children[0].click();
		}
		else
		{
			document.getElementsByClassName("like-button-renderer")[0].children[2].children[0].click();
		}
	};
	youtubeEventHandler.rating = function(rating)
	{

		//Still just as lovely
		var thumbsUp = document.getElementsByClassName("like-button-renderer")[0].children[0].children[0].getAttribute("class").includes("hid");
		var thumbsDown = document.getElementsByClassName("like-button-renderer")[0].children[2].children[0].getAttribute("class").includes("hid");
		if (rating > 3)
		{
			if (!thumbsUp)
			{
				document.getElementsByClassName("like-button-renderer")[0].children[0].children[0].click();
			}
		}
		else if (rating < 3)
		{
			if (!thumbsDown)
			{

				document.getElementsByClassName("like-button-renderer")[0].children[2].children[0].click();
			}
		}
		else
		{
			if (thumbsUp)
			{
				document.getElementsByClassName("like-button-renderer")[0].children[1].children[0].click();
			}
			else if (thumbsDown)
			{
				document.getElementsByClassName("like-button-renderer")[0].children[3].children[0].click();
			}
		}
	};
}
