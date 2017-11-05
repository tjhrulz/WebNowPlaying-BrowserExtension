//Adds support for the new youtube layout
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastImgVideoID = false;
var currIMG = "";

function setupTV()
{
	var youtubeInfoHandler = createNewMusicInfo();

	youtubeInfoHandler.player = function()
	{
		return "Youtube TV";
	};

	youtubeInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("player-video-title").length > 0 &&
			document.getElementsByClassName("player-video-title")[0].innerText.length > 0;
	};

	youtubeInfoHandler.state = function()
	{
		var state = document.getElementsByClassName("html5-main-video")[0].paused ? 2 : 1;
		//if (document.getElementsByClassName("ytp-play-button")[0].getAttribute("aria-label") === null)
		//{
		//	state = 3;
		//}
		//It is possible for the video to be "playing" but not started
		if (state == 1 && document.getElementsByClassName("html5-main-video")[0].played.length <= 0)
		{
			state = 2;
		}
		return state;
	};
	youtubeInfoHandler.title = function()
	{
		return document.getElementsByClassName("player-video-title")[0].innerText;
	};
	youtubeInfoHandler.artist = function()
	{
		return document.getElementsByClassName("username")[0].innerText;
	};
	youtubeInfoHandler.album = function()
	{
		//If using a playlist just use the title of that
		if (document.getElementsByClassName("set-context").length > 0)
		{
			return document.getElementsByClassName("set-context")[0].innerText;
		}

		//Otherwise youtube tv has no other context normally
		return "";
	};
	youtubeInfoHandler.cover = function()
	{
		var videoID = window.location.href.substring(window.location.href.indexOf("v=") + 2, window.location.href.indexOf("v=") + 2 + 11);

		if (lastImgVideoID !== videoID)
		{
			lastImgVideoID = videoID;
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
	youtubeInfoHandler.duration = function()
	{
		return document.getElementsByClassName("html5-main-video")[0].duration;
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
		//Youtube TV's rating system is pretty dumb so I decided not to implement it
		return 0;
	};
	youtubeInfoHandler.repeat = function()
	{
		//Youtube TV has no repeat function so I made my own using video looping
		return document.getElementsByClassName("html5-main-video")[0].loop ? 1 : 0;
	};
	youtubeInfoHandler.shuffle = function()
	{
		//Youtube TV has no shuffle
		return 0;
	};


	var youtubeEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	youtubeEventHandler.readyCheck = null;

	youtubeEventHandler.playpause = function()
	{
		if (document.getElementsByClassName("html5-main-video")[0].paused)
		{
			document.getElementsByClassName("html5-main-video")[0].play();
		}
		else
		{
			document.getElementsByClassName("html5-main-video")[0].pause();
		}
	};
	//@TODO implement tab handling
	youtubeEventHandler.next = function()
	{
		var a = document.getElementsByClassName("icon-player-next button")[0];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	youtubeEventHandler.previous = function()
	{
		var a = document.getElementsByClassName("icon-player-prev button")[0];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
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
		var repeat = !document.getElementsByClassName("html5-main-video")[0].loop;
		document.getElementsByClassName("html5-main-video")[0].loop = repeat;
	};
	youtubeEventHandler.shuffle = null;
}
