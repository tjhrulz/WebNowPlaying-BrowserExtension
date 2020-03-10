//Adds support for VIBE
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastKnownTag = "";
var currTime
var totalTime

function setup()
{
	var VIBEInfoHandler = createNewMusicInfo();

	VIBEInfoHandler.player = function()
	{
		return "VIBE";
	};

	VIBEInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("menu_item item_library").length > 0;
	};

	VIBEInfoHandler.state = function()
	{
		return document.getElementsByClassName("btn_now")[0].className.includes("play") ? 1 : 2;
	};
	VIBEInfoHandler.title = function()
	{
		//Avoid using the titles from WebNowPlaying.js wherever possible
		//This is done so we know when we need to reset the tag used for the album
		/*global currTitle:true*/
		if (currTitle !== document.getElementsByClassName("link")[0].innerText)
		{
			lastKnownTag = "";
		}
		return document.getElementsByClassName("link")[0].innerText;
	};
	VIBEInfoHandler.artist = function()
	{
		return document.getElementsByClassName("link_artist")[0].innerText;
	};
	/*VIBEInfoHandler.album = function()
	{
		if (document.getElementsByClassName("sc-button-play playButton sc-button sc-button-xlarge sc-button-pause").length > 0)
		{
			var tag = document.getElementsByClassName("sc-button-play playButton sc-button sc-button-xlarge sc-button-pause")[0].parentElement.parentElement.children[2].children;
			lastKnownTag = tag[tag.length - 1].innerText;
			return tag[tag.length - 1].innerText;
		}
		if (document.getElementsByClassName("queueItemView m-active").length > 0)
		{
			return document.getElementsByClassName("queueItemView m-active")[0].children[2].children[0].children[1].title.replace("From ", "");
		}
		return lastKnownTag;
	};*/
	VIBEInfoHandler.cover = function()
	{
		var currCover = document.getElementsByClassName("thumb_cover")[0].children[0].src;
		return currCover.substring(0, currCover.indexOf("&"));
	};
	VIBEInfoHandler.durationString = function()
	{
		var totalTime = document.getElementsByClassName("remain")[0].innerText;
		//return totalTime.substring(17);
		return totalTime.substring(totalTime.indexOf(":") - 2, totalTime.indexOf(":") + 3);
	};
	VIBEInfoHandler.positionString = function()
	{
		var currTime = document.getElementsByClassName("now")[0].innerText;
		//return currTime.substring(15);
		return currTime.substring(currTime.indexOf(":") - 2, currTime.indexOf(":") + 3);
	};
	/*VIBEInfoHandler.volume = function()
	{
		return parseInt(document.getElementsByClassName("volume__sliderProgress")[0].style.height) / document.getElementsByClassName("volume__sliderBackground")[0].getBoundingClientRect().height;
	};*/
	VIBEInfoHandler.rating = function()
	{
		if (document.getElementsByClassName("btn_like")[0].className.includes("on"))
		{
			return 5;
		}
		return 0;
	};
	VIBEInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("btn_repeat")[0].className.includes("once"))
		{
			return 2;
		}
		if (document.getElementsByClassName("btn_repeat")[0].className.includes("all"))
		{
			return 1;
		}
		return 0;
	};
	VIBEInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("btn_shuffle")[0].className.includes("on"))
		{
			return 1;
		}
		return 0;
	};


	var VIBEEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	VIBEEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("menu_item item_library").length > 0;
	};

	VIBEEventHandler.playpause = function()
	{
		document.getElementsByClassName("btn_now")[0].click();
	};
	VIBEEventHandler.next = function()
	{
		document.getElementsByClassName("btn_play_next")[0].click();
	};
	VIBEEventHandler.previous = function()
	{
		document.getElementsByClassName("btn_play_prev")[0].click();
	};
	/*VIBEEventHandler.progress = function(progress)
	{
		var loc = document.getElementsByClassName("playbackTimeline__progressWrapper")[0].getBoundingClientRect();
		progress *= loc.width;

		var a = document.getElementsByClassName("playbackTimeline__progressWrapper")[0];
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
	VIBEEventHandler.volume = function(volume)
	{
		var a = document.getElementsByClassName("volume")[0];
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('mouseover', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mousemove', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);

		var counter = 0;
		var volumeReadyTest = setInterval(function()
		{
			if (document.getElementsByClassName("volume expanded hover").length > 0)
			{
				clearInterval(volumeReadyTest);
				var loc = document.getElementsByClassName("volume__sliderBackground")[0].getBoundingClientRect();
				volume *= loc.height;

				a = document.getElementsByClassName("volume__sliderBackground")[0];
				e = document.createEvent('MouseEvents');
				//As much as I hate hard coded stuff for some reason the click is always of by 5, no idea where it comes from but it is always exactly 5
				e.initMouseEvent('mousedown', true, true, window, 1,
					screenX + loc.left + loc.width / 2, screenY + loc.bottom - volume + 5,
					loc.left + loc.width / 2, loc.bottom - volume + 5,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);
				e.initMouseEvent('mouseup', true, true, window, 1,
					screenX + loc.left + loc.width / 2, screenY + loc.bottom - volume + 5,
					loc.left + loc.width / 2, loc.bottom - volume + 5,
					false, false, false, false, 0, null);
				a.dispatchEvent(e);

				a = document.getElementsByClassName("volume")[0];
				e = document.createEvent('MouseEvents');
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
	};*/
	VIBEEventHandler.repeat = function()
	{
		document.getElementsByClassName("btn_repeat")[0].click();
	};
	VIBEEventHandler.shuffle = function()
	{
		document.getElementsByClassName("btn_shuffle")[0].click();
	};
	VIBEEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("btn_like")[0].click();
	};
	VIBEEventHandler.toggleThumbsDown = null;
	VIBEEventHandler.rating = null;
	//};
}

setup();
init();
