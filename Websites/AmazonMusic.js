//Adds support for Amazon Music
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastVolume = null;

//Amazon's new volume for some stupid reason only goes up to 93.75, They should be grateful I was even willing to support it
var AMAZONVOLUMESCALE = 93;

function setup()
{
	var amzmInfoHandler = createNewMusicInfo();

	amzmInfoHandler.player = function()
	{
		return "Amazon Music";
	};

	amzmInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("trackTitle").length > 1;
	};

	amzmInfoHandler.state = function()
	{
		return document.getElementsByClassName("playerIconPause").length > 0 ? 1 : 2;
	};
	amzmInfoHandler.title = function()
	{
		return document.getElementsByClassName("trackTitle")[0].innerText;
	};
	amzmInfoHandler.artist = function()
	{
		return document.getElementsByClassName("trackArtist")[0].innerText;
	};
	amzmInfoHandler.album = function()
	{
		return document.getElementsByClassName("trackSourceLink")[0].children[0].children[0].innerText;
	};
	amzmInfoHandler.cover = function()
	{
		var cover = document.getElementsByClassName("largeAlbumArtContainer")[0].children[0].style.backgroundImage;
		if (cover.indexOf("placeholder-album") < 0)
		{
			return cover.replace('url("', "").replace('")', "");
		}
		return null;
	};
	amzmInfoHandler.duration = function()
	{
		//Amazon only gives time to end of the song, so use that to calculate
		var timeFromEndString = document.getElementsByClassName("listViewDuration")[0].innerHTML.replace("-", "");
		var timeFromEndSec = parseInt(timeFromEndString.substring(timeFromEndString.indexOf(":") + 1)) + parseInt(timeFromEndString.substring(0, timeFromEndString.indexOf(":"))) * 60;
		var timeFromEndPercent = parseFloat(document.getElementsByClassName("sliderTrack scrubberTrack")[0].children[2].style.width.replace("%", ""));

		return Math.round(timeFromEndSec / timeFromEndPercent * 100);
	};
	amzmInfoHandler.position = function()
	{
		//Amazon only gives time to end of the song, so use that to calculate
		var timeFromEndString = document.getElementsByClassName("listViewDuration")[0].innerHTML.replace("-", "");
		var timeFromEndSec = parseInt(timeFromEndString.substring(timeFromEndString.indexOf(":") + 1)) + parseInt(timeFromEndString.substring(0, timeFromEndString.indexOf(":"))) * 60;
		var timeFromEndPercent = parseFloat(document.getElementsByClassName("sliderTrack scrubberTrack")[0].children[2].style.width.replace("%", ""));

		return Math.round(timeFromEndSec / timeFromEndPercent * parseFloat(document.getElementsByClassName("scrubberTrack")[0].children[0].style.width.replace("%", "")));
	};
	amzmInfoHandler.volume = function()
	{
		if (document.getElementsByClassName("volumeSlider").length > 0)
		{
			lastVolume = parseInt(document.getElementsByClassName("volumeSlider")[0].children[0].children[2].style.height) / AMAZONVOLUMESCALE;
		}
		//If we dont have a volume to return then return null
		else if (lastVolume === null)
		{
			//Quickly open the volume record the result and close it
			document.getElementsByClassName("volume")[0].click();
			setTimeout(function()
			{
				lastVolume = parseInt(document.getElementsByClassName("volumeSlider")[0].children[0].children[2].style.height) / AMAZONVOLUMESCALE;
				document.getElementsByClassName("volume")[0].click();
			}, 40);
		}

		//Can be null if timeout has not fired yet
		return lastVolume;
	};
	amzmInfoHandler.repeat = function()
	{
		return document.getElementsByClassName("repeatButton")[0].getAttribute("aria-checked") == "true" ? 1 : 0;
	};
	amzmInfoHandler.shuffle = function()
	{
		return document.getElementsByClassName("shuffleButton")[0].getAttribute("aria-checked") == "true" ? 1 : 0;
	};


	var amzmEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	amzmEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("trackTitle").length > 1;
	};

	amzmEventHandler.playpause = function()
	{
		document.getElementsByClassName("playButton")[0].click();
	};
	amzmEventHandler.next = function()
	{
		document.getElementsByClassName("nextButton")[0].click();
	};
	amzmEventHandler.previous = function()
	{
		document.getElementsByClassName("previousButton")[0].click();
	};
	amzmEventHandler.progress = function(progress)
	{
		var loc = document.getElementsByClassName("sliderTrack scrubberTrack")[0].getBoundingClientRect();
		progress *= loc.width;

		var a = document.getElementsByClassName("sliderTrack scrubberTrack")[0];
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
	amzmEventHandler.volume = function(volume)
	{
		////Amazon's volume is flipped
		volume = 1 - volume;

		if (document.getElementsByClassName("volumeSlider").length == 0)
		{
			document.getElementsByClassName("volume")[0].click();
		}

		var volumeReadyTest = setInterval(function()
		{
			if (document.getElementsByClassName("sliderTrack volumeTrack").length > 0)
			{
				clearInterval(volumeReadyTest);
				var loc = document.getElementsByClassName("sliderTrack volumeTrack")[0].getBoundingClientRect();
				volume *= loc.height;

				var a = document.getElementsByClassName("sliderTrack volumeTrack")[0];
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('mousedown', true, true, window, 1,
					screenX + loc.left + loc.width / 2, screenY + loc.top + volume,
					loc.left + loc.width / 2, loc.top + volume,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);

				//Amazon is dumb and does not read on mouse up but rather on mouse move :shrug:
				e.initMouseEvent('mousemove', true, true, window, 0,
					screenX + loc.left + loc.width / 2, screenY + loc.top + volume,
					loc.left + loc.width / 2, loc.top + volume,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);
				e.initMouseEvent('mouseup', true, true, window, 1,
					screenX + loc.left + loc.width / 2, screenY + loc.top + volume,
					loc.left + loc.width / 2, loc.top + volume,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);

				document.getElementsByClassName("volume")[0].click();
			}
		}, 33);
	};
	amzmEventHandler.repeat = function()
	{
		document.getElementsByClassName("repeatButton")[0].click();
	};
	amzmEventHandler.shuffle = function()
	{
		document.getElementsByClassName("shuffleButton")[0].click();
	};
}


setup();
init();
