//Adds support for Deezer

var lastAlbumURL = "";
var lastKnownAlbum = "";

function setup()
{
	var deezerInfoHandler = createNewMusicInfo();

	deezerInfoHandler.player = function()
	{
		return "Deezer";
	};

	deezerInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("player-track-link").length > 0;
	};

	deezerInfoHandler.state = function()
	{
		return document.getElementsByClassName("control-play")[0].children[0].className.baseVal.includes("pause") ? 1 : 2;
	};
	deezerInfoHandler.title = function()
	{
		return document.getElementsByClassName("player-track-title")[0].innerText;
	};
	deezerInfoHandler.artist = function()
	{
		var artist = document.getElementsByClassName("player-track-artist")[0].innerText;
		return artist.substring(artist.indexOf(" ") + 1);
	};
	deezerInfoHandler.album = function()
	{
		//Check if album URL has changed
		if (lastAlbumURL !== document.getElementsByClassName("player-track-link")[0].href)
		{
			//If changed set to new URL and update album name
			lastAlbumURL = document.getElementsByClassName("player-track-link")[0].href;

			var ajaxReq = new XMLHttpRequest();
			ajaxReq.onreadystatechange = function()
			{
				if (ajaxReq.readyState == 4)
				{
					lastKnownAlbum = ajaxReq.response.querySelector('meta[name="twitter:title"]').content;
				}
			};
			ajaxReq.responseType = "document";

			ajaxReq.open('get', document.getElementsByClassName("player-track-link")[0].href);
			ajaxReq.send();
		}

		return lastKnownAlbum;
	};
	deezerInfoHandler.cover = function()
	{
		return document.getElementById("player-cover").children[0].src.replace("250x250", "1200x1200");
	};
	deezerInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("progress-length")[0].innerText;
	};
	deezerInfoHandler.positionString = function()
	{
		return document.getElementsByClassName("progress-time")[0].innerText;
	};
	deezerInfoHandler.volume = function()
	{
		return parseInt(document.getElementsByClassName("volume-bar")[0].style.width) / 100;
	};
	deezerInfoHandler.rating = function()
	{
		//Check if heart is active
		if (document.getElementsByClassName("svg-icon-love-outline")[0].className.baseVal.includes("active"))
		{
			return 5;
		}

		return 0;
	};
	deezerInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("control-repeat")[0].children[0].className.baseVal.includes("active"))
		{
			if (document.getElementsByClassName("control-repeat")[0].children[0].className.baseVal.includes("one"))
			{
				return 2;
			}
			return 1;
		}
		return 0;
	};
	deezerInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("svg-icon-shuffle")[0].className.baseVal.includes("active"))
		{
			return 1;
		}
		return 0;
	};


	var deezerEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	deezerEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("player-track-link").length > 0;
	};

	deezerEventHandler.playpause = function()
	{
		document.getElementsByClassName("control-play")[0].click();
	};
	deezerEventHandler.next = function()
	{
		document.getElementsByClassName("control-next")[0].click();
	};
	deezerEventHandler.previous = function()
	{
		document.getElementsByClassName("control-prev")[0].click();
	};
	deezerEventHandler.progress = function(progress)
	{
		var loc = document.getElementsByClassName("progress progress-background")[0].getBoundingClientRect();
		progress = progress * loc.width;

		var a = document.getElementsByClassName("progress-seek")[0];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('click', true, true, window, 1,
			screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
			loc.left + progress, loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	deezerEventHandler.volume = function(volume)
	{
		ws.send("Error: Sorry Deezer's mouse event to trigger the volume slider does not work if I do it programatically");

		//if (document.getElementsByClassName("volumeSlider").length == 0)
		//{
		//	var loc = document.getElementsByClassName("player-controls")[0].getBoundingClientRect();
		//
		//	var a = document.getElementsByClassName("player-controls")[0];
		//	var e = document.createEvent('MouseEvents');
		//	e.initMouseEvent('mouseover', true, true, window, 0,
		//		screenX + loc.left + loc.width / 2, screenY + loc.top / 2,
		//		loc.left + loc.width / 2, loc.top / 2,
		//		false, false, false, false, 0, null);
		//	a.dispatchEvent(e);
		//
		//	var loc = document.getElementsByClassName("volume")[0].getBoundingClientRect();
		//
		//	var a = document.getElementsByClassName("volume")[0];
		//	var e = document.createEvent('MouseEvents');
		//	e.initMouseEvent('mouseover', true, true, window, 0,
		//		screenX + loc.left + loc.width / 2, screenY + loc.top / 2,
		//		loc.left + loc.width / 2, loc.top / 2,
		//		false, false, false, false, 0, null);
		//	a.dispatchEvent(e);
		//}
		//
		//var volumeReadyTest = setInterval(function()
		//{
		//	if (window.getComputedStyle(document.getElementsByClassName("volume-progress")[0]).display !== "none")
		//	{
		//		clearInterval(volumeReadyTest);
		//		var loc = document.getElementsByClassName("volume-progress")[0].getBoundingClientRect();
		//		volume = volume * loc.height;
		//
		//		var a = document.getElementsByClassName("volume-progress")[0];
		//		var e = document.createEvent('MouseEvents');
		//		e.initMouseEvent('click', true, true, window, 1,
		//			screenX + loc.left + loc.width / 2, screenY + loc.top + volume,
		//			loc.left + loc.width / 2, loc.top + volume,
		//			false, false, false, false, 0, null);
		//		a.dispatchEvent(e);
		//
		//		var a = document.getElementsByClassName("volume")[0];
		//		var e = document.createEvent('MouseEvents');
		//		e.initMouseEvent('mouseleave', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		//		a.dispatchEvent(e);
		//	}
		//}, 33);
	};
	deezerEventHandler.repeat = function()
	{
		document.getElementsByClassName("control-repeat")[0].click();
	};
	deezerEventHandler.shuffle = function()
	{
		document.getElementsByClassName("control-shuffle")[0].click();
	};
	deezerEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("player-actions")[0].children[0].children[0].click();
	};
	deezerEventHandler.rating = function(rating)
	{
		if (rating > 3)
		{
			//If thumbs up is not active
			if (!document.getElementsByClassName("svg-icon-love-outline")[0].className.baseVal.includes("active"))
			{
				document.getElementsByClassName("player-actions")[0].children[0].children[0].click();
			}
		}
		else
		{
			if (document.getElementsByClassName("svg-icon-love-outline")[0].className.baseVal.includes("active"))
			{
				document.getElementsByClassName("player-actions")[0].children[0].children[0].click();
			}
		}
	};
}


setup();
init();
