//Adds support for Soundcloud
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastKnownTag = "";

function setup()
{
	var soundcloudInfoHandler = createNewMusicInfo();

	soundcloudInfoHandler.player = function()
	{
		return "Soundcloud";
	};

	soundcloudInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("playbackSoundBadge__title").length > 0;
	};

	soundcloudInfoHandler.state = function()
	{
		return document.getElementsByClassName("playControl")[0].className.includes("playing") ? 1 : 2;
	};
	soundcloudInfoHandler.title = function()
	{
		//Avoid using the titles from WebNowPlaying.js wherever possible
		//This is done so we know when we need to reset the tag used for the album
		/*global currTitle:true*/
		if (currTitle !== document.getElementsByClassName("playbackSoundBadge__titleLink")[0].title)
		{
			lastKnownTag = "";
		}
		return document.getElementsByClassName("playbackSoundBadge__titleLink")[0].title;
	};
	soundcloudInfoHandler.artist = function()
	{
		return document.getElementsByClassName("playbackSoundBadge__lightLink")[0].innerText;
	};
	soundcloudInfoHandler.album = function()
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
	};
	soundcloudInfoHandler.cover = function()
	{
		var currCover = document.getElementsByClassName("playbackSoundBadge__avatar sc-media-image")[0].children[0].children[0].style.backgroundImage;
		return currCover.substring(currCover.indexOf("(") + 2, currCover.indexOf(")") - 1).replace("50x50", "500x500").replace("120x120", "500x500");
	};
	soundcloudInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("playbackTimeline__duration")[0].children[1].innerText;
	};
	soundcloudInfoHandler.positionString = function()
	{
		return document.getElementsByClassName("playbackTimeline__timePassed")[0].children[1].innerText;
	};
	soundcloudInfoHandler.volume = function()
	{
		return parseInt(document.getElementsByClassName("volume__sliderProgress")[0].style.height) / document.getElementsByClassName("volume__sliderBackground")[0].getBoundingClientRect().height;
	};
	soundcloudInfoHandler.rating = function()
	{
		if (document.getElementsByClassName("playbackSoundBadge__like")[0].className.includes("selected"))
		{
			return 5;
		}
		return 0;
	};
	soundcloudInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("m-one").length > 0)
		{
			return 2;
		}
		if (document.getElementsByClassName("m-all").length > 0)
		{
			return 1;
		}
		return 0;
	};
	soundcloudInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("m-shuffling").length > 0)
		{
			return 1;
		}
		return 0;
	};


	var soundcloudEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	soundcloudEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("playbackSoundBadge__title").length > 0;
	};

	soundcloudEventHandler.playpause = function()
	{
		document.getElementsByClassName("playControl")[0].click();
	};
	soundcloudEventHandler.next = function()
	{
		document.getElementsByClassName("skipControl__next")[0].click();
	};
	soundcloudEventHandler.previous = function()
	{
		document.getElementsByClassName("skipControl__previous")[0].click();
	};
	soundcloudEventHandler.progress = function(progress)
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
	soundcloudEventHandler.volume = function(volume)
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
	};
	soundcloudEventHandler.repeat = function()
	{
		document.getElementsByClassName("repeatControl")[0].click();
	};
	soundcloudEventHandler.shuffle = function()
	{
		document.getElementsByClassName("shuffleControl")[0].click();
	};
	soundcloudEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("playbackSoundBadge__like")[0].click();
	};
	soundcloudEventHandler.toggleThumbsDown = null;
	soundcloudEventHandler.rating = function(rating)
	{
		//Check if thumbs has two paths, if it does not then it is active
		if (rating > 3)
		{
			//If thumbs up is not active
			if (!document.getElementsByClassName("playbackSoundBadge__like")[0].className.includes("selected"))
			{
				document.getElementsByClassName("playbackSoundBadge__like")[0].click();
			}
		}
		else
		{
			if (document.getElementsByClassName("playbackSoundBadge__like")[0].className.includes("selected"))
			{
				document.getElementsByClassName("playbackSoundBadge__like")[0].click();
			}
		}
	};
}


setup();
init();
