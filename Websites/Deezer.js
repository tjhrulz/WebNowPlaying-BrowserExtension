//Adds support for Deezer
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

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
		return document.getElementsByClassName("track-link").length > 0;
	};

	deezerInfoHandler.state = function()
	{
		return document.getElementsByClassName("player-controls")[0].children[0].children[2].children[0].children[0].className.baseVal.includes("pause") ? 1 : 2;
	};
	deezerInfoHandler.title = function()
	{
		return document.getElementsByClassName("track-link")[0].innerText;
	};
	deezerInfoHandler.artist = function()
	{
		return document.getElementsByClassName("track-link")[1].innerText;
	};
	deezerInfoHandler.album = function()
	{
		//Check if album URL has changed
		if (lastAlbumURL !== document.getElementsByClassName("track-link")[0].href)
		{
			//If changed set to new URL and update album name
			lastAlbumURL = document.getElementsByClassName("track-link")[0].href;

			var ajaxReq = new XMLHttpRequest();
			ajaxReq.onreadystatechange = function()
			{
				if (ajaxReq.readyState == 4)
				{
					lastKnownAlbum = ajaxReq.response.querySelector('meta[name="twitter:title"]').content;
				}
			};
			ajaxReq.responseType = "document";

			ajaxReq.open('get', document.getElementsByClassName("track-link")[0].href);
			ajaxReq.send();
		}

		return lastKnownAlbum;
	};
	deezerInfoHandler.cover = function()
	{
		return document.getElementsByClassName("queuelist")[0].children[0].children[0].children[0].src.replace("28x28", "1200x1200");
	};
	deezerInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("slider-counter-max")[0].innerText;
	};
	deezerInfoHandler.positionString = function()
	{
		return document.getElementsByClassName("slider-counter-current")[0].innerText;
	};
	//Deezer has a dumb new volume system
	deezerInfoHandler.volume = null;
	deezerInfoHandler.rating = function()
	{
		for (var i = 0; i < document.getElementsByClassName("track-actions")[0].children[0].children.length; i++)
		{
			if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].tagName === "svg" &&
				document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].className.baseVal.includes("love"))
			{
				if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].className.baseVal.includes("active"))
				{
					return 5;
				}
			}
		}
		return 0;
	};
	deezerInfoHandler.repeat = function()
	{
		var childCount = document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].childElementCount;
		if (document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[childCount - 4].children[0].children[0].className.baseVal.includes("active"))
		{
			if (document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[childCount - 4].children[0].children[0].className.baseVal.includes("one"))
			{
				return 2;
			}
			return 1;
		}
		return 0;
	};
	deezerInfoHandler.shuffle = function()
	{
		var childCount = document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].childElementCount;
		if (document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[childCount - 3].children[0].children[0].className.baseVal.includes("active"))
		{
			return 1;
		}
		//Return shuffle true if using flow or a radio station
		else if (document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[childCount - 3].children[0].disabled)
		{
			return 1;
		}
		return 0;
	};


	var deezerEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	deezerEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("track-link").length > 0;
	};

	deezerEventHandler.playpause = function()
	{
		document.getElementsByClassName("player-controls")[0].children[0].children[2].children[0].click();
	};
	deezerEventHandler.next = function()
	{
		document.getElementsByClassName("player-controls")[0].children[0].children[4].children[0].children[0].click();
	};
	deezerEventHandler.previous = function()
	{
		document.getElementsByClassName("player-controls")[0].children[0].children[0].children[0].children[0].click();
	};
	deezerEventHandler.progress = null;
	//Deezer has the dumbest progress bar I have ever seen, this will the the track bar to be active and show the tooltip
	//But it will not change the progress, if any one else wants to figure out this shit feel free
	//deezerEventHandler.progress = function(progress)
	//{
	//	//Deezer does another dumb thing where
	//
	//	var loc = document.getElementsByClassName("track-seekbar")[0].children[0].getBoundingClientRect();
	//
	//	var a = document.getElementsByClassName("track-seekbar")[0].children[0];
	//	var e = document.createEvent('MouseEvents');
	//
	//	e.initMouseEvent('mouseover', true, true, window, 1,
	//		screenX + loc.left + loc.width / 2, screenY + loc.top + loc.height / 2,
	//		loc.left + loc.width / 2, loc.top + loc.height / 2,
	//		false, false, false, false, 0, null);
	//	a.dispatchEvent(e);
	//
	//	loc = document.getElementsByClassName("track-seekbar")[0].children[0].children[1].children[2].getBoundingClientRect();
	//	progress *= loc.width;
	//	a = document.getElementsByClassName("track-seekbar")[0].children[0].children[1].children[2];
	//	e = document.createEvent('MouseEvents');
	//
	//	e.initMouseEvent('mouseover', true, true, window, 0,
	//		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
	//		loc.left + progress, loc.top + loc.height / 2,
	//		false, false, false, false, 0, null);
	//	a.dispatchEvent(e);
	//	e.initMouseEvent('mousedown', true, true, window, 1,
	//		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
	//		loc.left + progress, loc.top + loc.height / 2,
	//		false, false, false, false, 0, null);
	//	a.dispatchEvent(e);
	//	e.initMouseEvent('mousemove', true, true, window, 0,
	//		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
	//		loc.left + progress, loc.top + loc.height / 2,
	//		false, false, false, false, 0, null);
	//	a.dispatchEvent(e);
	//	e.initMouseEvent('mouseup', true, true, window, 1,
	//		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
	//		loc.left + progress, loc.top + loc.height / 2,
	//		false, false, false, false, 0, null);
	//	a.dispatchEvent(e);
	//	e.initMouseEvent('click', true, true, window, 1,
	//		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
	//		loc.left + progress, loc.top + loc.height / 2,
	//		false, false, false, false, 0, null);
	//	a.dispatchEvent(e);
	//};
	deezerEventHandler.volume = null;
	deezerEventHandler.repeat = function()
	{
		var childCount = document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].childElementCount;
		document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[childCount - 4].children[0].click();
	};
	deezerEventHandler.shuffle = function()
	{
		var childCount = document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].childElementCount;
		document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[childCount - 3].children[0].click();
	};

	//Yup Deezers rating is still dumb
	deezerEventHandler.toggleThumbsUp = function()
	{
		for (var i = 0; i < document.getElementsByClassName("track-actions")[0].children[0].children.length; i++)
		{
			if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].tagName === "svg" &&
				document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].className.baseVal.includes("love"))
			{
				document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].click();
			}
		}
	};
	deezerEventHandler.toggleThumbsDown  = null;
	deezerEventHandler.rating = function(rating)
	{
		for (var i = 0; i < document.getElementsByClassName("track-actions")[0].children[0].children.length; i++)
		{
			if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].tagName === "svg" &&
				document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].className.baseVal.includes("love"))
			{
				//We are rating this high
				if (rating > 3)
				{
					//If thumbs up is not active and now needs to be
					if (!document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].className.baseVal.includes("active"))
					{
						document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].click();
					}
				}
				//We are not rating this high
				else
				{
					//If thumbs up is active deactivate it
					if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].className.baseVal.includes("active"))
					{
						document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].click();
					}
				}
			}
		}
	};
}


setup();
init();
