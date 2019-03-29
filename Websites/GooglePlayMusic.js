//Adds support for Google Play Music
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var element;

function setup()
{
	var gpmInfoHandler = createNewMusicInfo();

	gpmInfoHandler.player = function()
	{
		return "Google Play Music";
	};

	gpmInfoHandler.readyCheck = function()
	{
		if (document.getElementsByTagName('audio').length > 0)
		{
			for (var i = 0; i < document.getElementsByTagName('audio').length; i++)
			{
				if (document.getElementsByTagName('audio')[i].duration > 0)
				{
					element = document.getElementsByTagName('audio')[i];
					break;
				}
			}
		}

		return document.getElementById("currently-playing-title") !== null &&
			document.getElementById("currently-playing-title").innerText.length > 0 &&
			document.getElementsByTagName('audio').length > 0 &&
			element !== undefined;
	};

	gpmInfoHandler.state = function()
	{
		return element.paused ? 2 : 1;
	};
	gpmInfoHandler.title = function()
	{
		return document.getElementById("currently-playing-title").innerText;
	};
	gpmInfoHandler.artist = function()
	{
		return document.getElementById("player-artist").innerText;

	};
	gpmInfoHandler.album = function()
	{
		if (document.getElementsByClassName("player-album").length > 0)
		{
			return document.getElementsByClassName("player-album")[0].innerText;
		}
		return "Podcast";
	};
	gpmInfoHandler.cover = function()
	{
		var albumArtTemp = document.getElementById("playerBarArt").src;
		return albumArtTemp.substring(0, albumArtTemp.indexOf("=s90-c-e100"));
	};
	gpmInfoHandler.durationString = function()
	{
		return document.getElementById("time_container_duration").innerText;
	};
	gpmInfoHandler.positionString = function()
	{
		//GPM audio source seems to preload the next song, so only use current time from it if needed.
		if (!document.hidden)
		{
			return document.getElementById("time_container_current").innerText;
		}
		return convertTimeToString(element.currentTime);
	};
	gpmInfoHandler.volume = function()
	{
		return element.volume;
	};
	gpmInfoHandler.rating = function()
	{

		//Check if thumbs has two paths, if it does not then it is active
		if (document.getElementsByClassName("rating-container materialThumbs")[0].children[0].children[0].children[0].children[0].children.length < 2)
		{
			return 5;
		}
		if (document.getElementsByClassName("rating-container materialThumbs")[0].children[1].children[0].children[0].children[0].children.length < 2)
		{
			return 1;
		}

		return 0;
	};
	gpmInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("material-player-middle")[0].children[1].className.includes("active"))
		{
			//Hacky way to check if repeat all
			if (document.getElementsByClassName("material-player-middle")[0].children[1].children[0].children[0].children[0].children[0].getAttribute("d") ==
				"M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z")
			{
				return 2;
			}
			return 1;
		}
		return 0;
	};
	gpmInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("material-player-middle")[0].children[5].className.includes("active"))
		{
			return 1;
		}
		return 0;
	};


	var gpmEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	gpmEventHandler.readyCheck = function()
	{
		return document.getElementById("currently-playing-title") !== null &&
			document.getElementById("currently-playing-title").innerText.length > 0 &&
			document.getElementsByTagName('audio').length > 0 &&
			element !== null;
	};

	gpmEventHandler.playpause = function()
	{
		document.getElementById("player-bar-play-pause").click();
	};
	gpmEventHandler.next = function()
	{
		document.getElementsByClassName("material-player-middle")[0].children[4].click();
	};
	gpmEventHandler.previous = function()
	{
		document.getElementsByClassName("material-player-middle")[0].children[2].click();
	};
	gpmEventHandler.progressSeconds = function(position)
	{
		element.currentTime = position;
	};
	gpmEventHandler.volume = function(volume)
	{
		if (element.muted && volume > 0)
		{
			element.muted = false;
		}
		else if (volume == 0)
		{
			element.muted = true;
		}
		element.volume = volume;
	};
	gpmEventHandler.repeat = function()
	{
		document.getElementsByClassName("material-player-middle")[0].children[1].click();
	};
	gpmEventHandler.shuffle = function()
	{
		document.getElementsByClassName("material-player-middle")[0].children[5].click();
	};
	gpmEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("rating-container materialThumbs")[0].children[0].click();
	};
	gpmEventHandler.toggleThumbsDown = function()
	{
		document.getElementsByClassName("rating-container materialThumbs")[0].children[1].click();
	};
	gpmEventHandler.rating = function(rating)
	{
		//Check if thumbs has two paths, if it does not then it is active
		if (rating > 3)
		{
			//If thumbs up is not active
			if (document.getElementsByClassName("rating-container materialThumbs")[0].children[0].children[0].children[0].children[0].children.length == 2)
			{
				document.getElementsByClassName("rating-container materialThumbs")[0].children[0].click();
			}
		}
		else if (rating < 3 && rating > 0)
		{
			//If thumbs down is not active active
			if (document.getElementsByClassName("rating-container materialThumbs")[0].children[1].children[0].children[0].children[0].children.length == 2)
			{
				document.getElementsByClassName("rating-container materialThumbs")[0].children[1].click();
			}
		}
		else
		{
			if (document.getElementsByClassName("rating-container materialThumbs")[0].children[0].children[0].children[0].children[0].children.length < 2)
			{
				document.getElementsByClassName("rating-container materialThumbs")[0].children[0].click();
			}
			if (document.getElementsByClassName("rating-container materialThumbs")[0].children[1].children[0].children[0].children[0].children.length < 2)
			{
				document.getElementsByClassName("rating-container materialThumbs")[0].children[1].click();
			}
		}
	};
}


setup();
init();
