//Adds support for Tidal

function setup()
{
	var tidalInfoHandler = createNewMusicInfo();

	tidalInfoHandler.player = function()
	{
		return "Tidal";
	};

	tidalInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("now-playing__metadata__title").length > 0 &&
			document.getElementsByClassName("now-playing__metadata__title")[0].innerText.length > 0 &&
			document.getElementsByClassName("info-box__table").length > 0;
	};

	tidalInfoHandler.state = function()
	{
		return document.getElementsByClassName("play-controls__main-button")[0].className.includes("paused") ? 2 : 1;
	};
	tidalInfoHandler.title = function()
	{
		return document.getElementsByClassName("now-playing__metadata__title")[0].innerText;
	};
	tidalInfoHandler.artist = function()
	{
		return document.getElementsByClassName("now-playing__metadata__artist")[0].innerText;
	};
	tidalInfoHandler.album = function()
	{
		return document.getElementsByClassName("info-box__table")[0].children[0].children[2].children[1].innerText.replace("From ", "");
	};
	tidalInfoHandler.cover = function()
	{
		return document.getElementsByClassName("js-footer-player-image")[0].src.replace("320x320", "1280x1280");
	};
	tidalInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("js-duration")[0].innerText;
	};
	tidalInfoHandler.positionString = function()
	{
		return document.getElementsByClassName("js-progress")[0].innerText;
	};
	tidalInfoHandler.volume = function()
	{
		return parseInt(document.getElementsByClassName("ui-slider-handle")[0].style.bottom) / 100;
	};
	tidalInfoHandler.rating = null;
	tidalInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("play-controls__repeat")[0].className.includes("active"))
		{
			if (document.getElementsByClassName("icon-Playback_repeatOnce").length > 0)
			{
				return 2;
			}
			return 1;
		}
		return 0;
	};
	tidalInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("play-controls__shuffle")[0].className.includes("active"))
		{
			return 1;
		}
		return 0;
	};


	var tidalEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	tidalEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("now-playing__metadata__title").length > 0 &&
			document.getElementsByClassName("now-playing__metadata__title")[0].innerText.length > 0 &&
			document.getElementsByClassName("info-box__table").length > 0;
	};

	tidalEventHandler.playpause = function()
	{
		if (document.getElementsByClassName("play-controls__main-button--paused").length > 0)
		{
			//Click play button
			document.getElementsByClassName("play-controls__main-button")[0].children[0].click();
		}
		else
		{
			//Click pause button
			document.getElementsByClassName("play-controls__main-button")[0].children[1].click();
		}
	};
	tidalEventHandler.next = function()
	{
		document.getElementsByClassName("play-controls__next")[0].click();
	};
	tidalEventHandler.previous = function()
	{
		document.getElementsByClassName("play-controls__previous")[0].click();
	};
	tidalEventHandler.progress = function(progress)
	{
		var loc = document.getElementsByClassName("progressbar__interaction-layer")[0].getBoundingClientRect();
		progress = progress * loc.width;

		var a = document.getElementsByClassName("progressbar__interaction-layer")[0];
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
	tidalEventHandler.volume = function(volume)
	{
		var a = document.getElementsByClassName("js-volume-status")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('mouseover', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mousemove', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);

		var counter = 0;
		var volumeReadyTest = setInterval(function()
		{
			if (document.getElementsByClassName("show-slider").length > 0)
			{
				clearInterval(volumeReadyTest);
				var loc = document.getElementsByClassName("volume-slider")[0].getBoundingClientRect();
				volume = volume * loc.height;

				var a = document.getElementsByClassName("volume-slider")[0];
				var e = document.createEvent('MouseEvents');
				//As much as I hate hard coded stuff for some reason the click is always of by 5, no idea where it comes from but it is always exactly 5
				e.initMouseEvent('mousedown', true, true, window, 1,
					screenX + loc.left + loc.width / 2, screenY + loc.bottom - volume + 5,
					loc.left + loc.width / 2, loc.bottom - volume,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);
				e.initMouseEvent('mouseup', true, true, window, 1,
					screenX + loc.left + loc.width / 2, screenY + loc.bottom - volume + 5,
					loc.left + loc.width / 2, loc.bottom - volume,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);

				var a = document.getElementsByClassName("js-volume-status")[0];
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('mouseout', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			}
			else
			{
				counter++;
				if (counter > 10)
				{
					clearInterval(volumeReadyTest);
				}
			}
		}, 25);
	};
	tidalEventHandler.repeat = function()
	{
		document.getElementsByClassName("play-controls__repeat")[0].click();
	};
	tidalEventHandler.shuffle = function()
	{
		document.getElementsByClassName("play-controls__shuffle")[0].click();
	};
	tidalEventHandler.toggleThumbsUp = null;
	tidalEventHandler.toggleThumbsDown = null;
	tidalEventHandler.rating = null;
}


setup();
init();
