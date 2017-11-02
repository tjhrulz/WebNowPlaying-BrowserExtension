//Adds support for Spotify
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastKnownAlbum = "";
var lastKnownAlbumArt = "";

//No longer sent to Rainmeter, now just used to know when to regenerate info
var lastKnownAlbumID = "";

function setup()
{
	var spotifyInfoHandler = createNewMusicInfo();

	spotifyInfoHandler.player = function()
	{
		return "Spotify";
	};

	spotifyInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("track-info__name").length > 0 &&
			document.getElementsByClassName("track-info__name")[0].innerText.length > 0;
	};

	spotifyInfoHandler.state = function()
	{
		return document.getElementsByClassName("spoticon-play-16").length > 0 ? 2 : 1;
	};
	spotifyInfoHandler.title = function()
	{
		return document.getElementsByClassName("track-info__name")[0].innerText;
	};
	spotifyInfoHandler.artist = function()
	{
		return document.getElementsByClassName("track-info__artists")[0].innerText;
	};
	spotifyInfoHandler.album = function()
	{
		if (lastKnownAlbumID !== document.getElementsByClassName("track-info__name")[0].children[0].children[0].href)
		{
			lastKnownAlbumID = document.getElementsByClassName("track-info__name")[0].children[0].children[0].href;
			var ajaxReq = new XMLHttpRequest();
			ajaxReq.onreadystatechange = function()
			{
				if (ajaxReq.readyState == 4)
				{
					lastKnownAlbum = ajaxReq.response.querySelector('meta[property="og:title"]').content;
				}
			};
			ajaxReq.responseType = "document";
			ajaxReq.open('get', document.getElementsByClassName("track-info__name")[0].children[0].children[0].href);
			ajaxReq.send();
		}

		if (lastKnownAlbum === "")
		{
			//Placeholder album
			return document.getElementsByClassName("react-contextmenu-wrapper")[0].children[0].children[0].title;
		}
		return lastKnownAlbum;
	};
	spotifyInfoHandler.cover = function()
	{
		var currCover = document.getElementsByClassName("cover-art-image")[document.getElementsByClassName("cover-art-image").length - 1].style.backgroundImage;
		return currCover.substring(currCover.indexOf("(") + 2, currCover.indexOf(")") - 1);
	};
	spotifyInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("playback-bar__progress-time")[1].innerText;
	};
	spotifyInfoHandler.positionString = function()
	{
		return document.getElementsByClassName("playback-bar__progress-time")[0].innerText;
	};
	spotifyInfoHandler.volume = function()
	{
		return parseFloat(document.getElementsByClassName("progress-bar__fg")[1].style.width) / 100;
	};
	spotifyInfoHandler.rating = function()
	{
		if (document.getElementsByClassName("spoticon-heart-active-16").length > 0 ||
			document.getElementsByClassName("spoticon-added-16").length > 0)
		{
			return 5;
		}
		return 0;
	};
	spotifyInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("spoticon-repeat-16").length > 0)
		{
			return document.getElementsByClassName("spoticon-repeat-16")[0].className.includes("active") ? 1 : 0;
		}
		return 0;
	};
	spotifyInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("spoticon-shuffle-16").length)
		{
			return document.getElementsByClassName("spoticon-shuffle-16")[0].className.includes("active") ? 1 : 0;
		}
		return 0;
	};


	var spotifyEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	spotifyEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("track-info__name").length > 0 &&
			document.getElementsByClassName("track-info__name")[0].innerText.length > 0;
	};

	spotifyEventHandler.playpause = function()
	{
		document.getElementsByClassName("player-controls__buttons")[0].children[2].click();
	};
	spotifyEventHandler.next = function()
	{
		document.getElementsByClassName("spoticon-skip-forward-16")[0].click();
	};
	spotifyEventHandler.previous = function()
	{
		document.getElementsByClassName("spoticon-skip-back-16")[0].click();
	};
	spotifyEventHandler.progress = function(progress)
	{
		var loc = document.getElementsByClassName("playback-bar")[0].children[1].getBoundingClientRect();
		progress *= loc.width;

		var a = document.getElementsByClassName("playback-bar")[0].children[1];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('mousedown', true, true, window, 1,
			screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
			loc.left + progress, loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1,
			screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
			loc.left + progress, loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	spotifyEventHandler.volume = function(volume)
	{
		var loc = document.getElementsByClassName("volume-bar")[0].children[1].getBoundingClientRect();
		volume *= loc.width;

		var a = document.getElementsByClassName("volume-bar")[0].children[1];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('mousedown', true, true, window, 1,
			screenX + loc.left + volume, screenY + loc.top + loc.height / 2,
			loc.left + volume, loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1,
			screenX + loc.left + volume, screenY + loc.top + loc.height / 2,
			loc.left + volume, loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	spotifyEventHandler.repeat = function()
	{
		if (document.getElementsByClassName("spoticon-repeat-16").length > 0)
		{
			document.getElementsByClassName("spoticon-repeat-16")[0].click();
		}
	};
	spotifyEventHandler.shuffle = function()
	{
		if (document.getElementsByClassName("spoticon-shuffle-16").length > 0)
		{
			document.getElementsByClassName("spoticon-shuffle-16")[0].click();
		}
	};
	spotifyEventHandler.toggleThumbsUp = function()
	{
		if (document.getElementsByClassName("spoticon-heart-16").length > 0)
		{
			document.getElementsByClassName("spoticon-heart-16")[0].click();
		}
		else if (document.getElementsByClassName("spoticon-add-16").length > 0)
		{
			document.getElementsByClassName("spoticon-add-16")[0].click();
		}
		else if (document.getElementsByClassName("spoticon-added-16").length > 0)
		{
			document.getElementsByClassName("spoticon-added-16")[0].click();
		}
		else if (document.getElementsByClassName("spoticon-heart-active-16").length > 0)
		{
			document.getElementsByClassName("spoticon-heart-active-16")[0].click();
		}
	};
	spotifyEventHandler.toggleThumbsDown = null;
	spotifyEventHandler.rating = function(rating)
	{
		//Check if thumbs has two paths, if it does not then it is active
		if (rating > 3)
		{
			if (document.getElementsByClassName("spoticon-heart-16").length > 0)
			{
				document.getElementsByClassName("spoticon-heart-16")[0].click();
			}
			else if (document.getElementsByClassName("spoticon-add-16").length > 0)
			{
				document.getElementsByClassName("spoticon-add-16")[0].click();
			}
		}
		//@TODO Possibly add back thumbs down action when the feature is working again
		else
		{
			if (document.getElementsByClassName("spoticon-heart-active-16").length > 0)
			{
				document.getElementsByClassName("spoticon-heart-active-16")[0].click();
			}
			if (document.getElementsByClassName("spoticon-added-16").length > 0)
			{
				document.getElementsByClassName("spoticon-added-16")[0].click();
			}
		}
	};
}


setup();
init();
