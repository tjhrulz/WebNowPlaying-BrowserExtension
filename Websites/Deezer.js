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
		//Deezer does this dumb thing where they use tables for everything.
		//And the tables are in a different order and different padding depending on what buttons are active
		//I was going to hard code it depending on cell count but it has a stupid kareoke mode that can show up on some songs
		//So how this works is we look for the "don't recomend" icon, if we find it we go to the previous cell we were on
		//If not then the last cell we checked is the heart button

		for (var i = 0; i < document.getElementsByClassName("track-actions")[0].children[0].children.length; i++)
		{
			if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].children[0].getAttribute("d") === "M2.836 9.871a5 5 0 0 0 7.036-7.036l-.018.019L2.836 9.87zm-.707-.707l7.017-7.018.018-.017a5 5 0 0 0-7.036 7.036zM6 12A6 6 0 1 1 6 0a6 6 0 0 1 0 12z")
			{
				//We matched the don't recommend button so use the cell before this
				if (document.getElementsByClassName("track-actions")[0].children[0].children[i - 1].children[0].children[0].className.baseVal.includes("active"))
				{
					return 5;
				}
				return 0;
			}
		}
		//We matched the don't recommend button so use the cell before this
		if (document.getElementsByClassName("track-actions")[0].children[0].children[document.getElementsByClassName("track-actions")[0].children[0].children.length - 1].children[0].children[0].className.baseVal.includes("active"))
		{
			return 5;
		}
		return 0;
	};
	deezerInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[0].children[0].children[0].className.baseVal.includes("active"))
		{
			if (document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[0].children[0].children[0].className.baseVal.includes("one"))
			{
				return 2;
			}
			return 1;
		}
		return 0;
	};
	deezerInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[1].children[0].children[0].className.baseVal.includes("active"))
		{
			return 1;
		}
		//Return shuffle true if using flow or a radio station
		else if (document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[1].children[0].disabled)
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
		document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[0].children[0].click();
	};
	deezerEventHandler.shuffle = function()
	{
		document.getElementsByClassName("player-options")[0].children[0].children[0].children[0].children[1].children[0].click();
	};

	//Yup Deezers rating is still dumb
	deezerEventHandler.toggleThumbsUp = function()
	{
		for (var i = 0; i < document.getElementsByClassName("track-actions")[0].children[0].children.length; i++)
		{
			if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].children[0].getAttribute("d") === "M2.836 9.871a5 5 0 0 0 7.036-7.036l-.018.019L2.836 9.87zm-.707-.707l7.017-7.018.018-.017a5 5 0 0 0-7.036 7.036zM6 12A6 6 0 1 1 6 0a6 6 0 0 1 0 12z")
			{
				document.getElementsByClassName("track-actions")[0].children[0].children[i - 1].children[0].click();
			}
		}
		//We matched the don't recommend button so use the cell before this
		if (document.getElementsByClassName("track-actions")[0].children[0].children[document.getElementsByClassName("track-actions")[0].children[0].children.length - 1].children[0].children[0].className.baseVal.includes("active"))
		{
			document.getElementsByClassName("track-actions")[0].children[0].children[document.getElementsByClassName("track-actions")[0].children[0].children.length - 1].children[0].click();
		}
	};
	deezerEventHandler.toggleThumbsDown = function()
	{
		for (var i = 0; i < document.getElementsByClassName("track-actions")[0].children[0].children.length; i++)
		{
			if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].children[0].getAttribute("d") === "M2.836 9.871a5 5 0 0 0 7.036-7.036l-.018.019L2.836 9.87zm-.707-.707l7.017-7.018.018-.017a5 5 0 0 0-7.036 7.036zM6 12A6 6 0 1 1 6 0a6 6 0 0 1 0 12z")
			{
				document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].click();
			}
		}
	};
	deezerEventHandler.rating = function(rating)
	{
		var dislikeLoc = -1;
		var likeLoc = -1;

		//Easiest way to do this without doing a bunch of repeated code
		for (var i = 0; i < document.getElementsByClassName("track-actions")[0].children[0].children.length; i++)
		{
			if (document.getElementsByClassName("track-actions")[0].children[0].children[i].children[0].children[0].children[0].getAttribute("d") === "M2.836 9.871a5 5 0 0 0 7.036-7.036l-.018.019L2.836 9.87zm-.707-.707l7.017-7.018.018-.017a5 5 0 0 0-7.036 7.036zM6 12A6 6 0 1 1 6 0a6 6 0 0 1 0 12z")
			{
				dislikeLoc = i;
			}
		}
		if (dislikeLoc > 0)
		{
			likeLoc = dislikeLoc - 1;
		}
		else
		{
			likeLoc = document.getElementsByClassName("track-actions")[0].children[0].children.length;
		}


		if (rating > 3)
		{
			//If thumbs up is not active
			if (!document.getElementsByClassName("track-actions")[0].children[0].children[likeLoc].children[0].children[0].className.baseVal.includes("active"))
			{
				document.getElementsByClassName("track-actions")[0].children[0].children[likeLoc].children[0].click();
			}
		}
		else if (rating < 3 && rating > 0)
		{
			//Thumbs down is always false so just do it
			document.getElementsByClassName("track-actions")[0].children[0].children[dislikeLoc].children[0].click();
		}
		else
		{
			if (document.getElementsByClassName("track-actions")[0].children[0].children[likeLoc].children[0].children[0].className.baseVal.includes("active"))
			{
				document.getElementsByClassName("track-actions")[0].children[0].children[likeLoc].children[0].click();
			}
		}
	};
}


setup();
init();
