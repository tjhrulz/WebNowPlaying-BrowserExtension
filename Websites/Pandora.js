//Adds support for Pandora
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastKnownAlbum = "";
var currAudioElement = null;

function setup()
{
	var pandoraInfoHandler = createNewMusicInfo();

	pandoraInfoHandler.player = function()
	{
		return "Pandora";
	};

	pandoraInfoHandler.readyCheck = function()
	{
		//Makes sure the current music element used is up to date
		for (var i = 0; i < document.getElementsByTagName("audio").length; i++)
		{
			if (document.getElementsByTagName("audio")[i].ontimeupdate === null)
			{
				//Yes I know this is a hacky way to do this but it works and is rather quite efficient
				document.getElementsByTagName("audio")[i].ontimeupdate = function()
				{
					currAudioElement = this;
				};
			}
		}

		return document.getElementsByClassName("Tuner__Audio__TrackDetail__title").length > 0 &&
			currAudioElement !== null;
	};

	pandoraInfoHandler.state = function()
	{
		//If pandora asked if you are still listening it is paused
		if (document.getElementsByClassName("StillListeningBody").length > 0)
		{
			return 2;
		}
		return document.getElementsByClassName("PlayButton__Icon")[0].children[0].getAttribute("d").includes("22.5v-21l16.5") ? 2 : 1;
	};
	pandoraInfoHandler.title = function()
	{
		//Avoid using the titles from WebNowPlaying.js wherever possible
		//This is done so we know when we need to reset the tag used for the album
		/*global currTitle:true*/
		if (currTitle !== document.getElementsByClassName("Tuner__Audio__TrackDetail__title")[0].innerText)
		{
			lastKnownAlbum = "";
		}
		return document.getElementsByClassName("Tuner__Audio__TrackDetail__title")[0].innerText;
	};
	pandoraInfoHandler.artist = function()
	{
		//Avoid using the titles from WebNowPlaying.js wherever possible
		//This is done so we know when we need to reset the tag used for the album
		/*global currAlbum:true*/
		if (currAlbum !== document.getElementsByClassName("Tuner__Audio__TrackDetail__artist")[0].innerText)
		{
			lastKnownAlbum = "";
		}
		return document.getElementsByClassName("Tuner__Audio__TrackDetail__artist")[0].innerText;
	};
	pandoraInfoHandler.album = function()
	{
		if (document.getElementsByClassName("nowPlayingTopInfo__current__albumName").length > 0)
		{
			lastKnownAlbum = document.getElementsByClassName("nowPlayingTopInfo__current__albumName")[0].innerText;
			return lastKnownAlbum;
		}
		//Fallback for it album is not visible, note that it is url formatted so I have to do extra parsing
		//This will only run if the album has changed
		else if (lastKnownAlbum === "")
		{
			//Do all extra passing in advance so string check works across both if I already have the string set correctly
			var albumURL = document.getElementsByClassName("Tuner__Audio__TrackDetail__title")[0].href.replace("://www.pandora.com/artist/", "");
			albumURL = albumURL.substring(albumURL.indexOf("/") + 1);
			return capitalize(albumURL.substring(0, albumURL.indexOf("/")));
		}

		return lastKnownAlbum;
	};
	pandoraInfoHandler.cover = function()
	{
		var cover = document.getElementsByClassName("ImageLoader__cover")[document.getElementsByClassName("ImageLoader__cover").length - 1].src;

		//If cover is default return to use default in Rainmeter
		if (cover === "https://www.pandora.com/web-version/1.58.0/images/album_90.png")
		{
			return "";
		}
		return cover.replace("90W_90H", "500W_500H");
	};
	pandoraInfoHandler.durationString = function()
	{
		if (document.getElementsByClassName("VolumeDurationControl__Duration")[0].children[2].innerText !== "")
		{
			return document.getElementsByClassName("VolumeDurationControl__Duration")[0].children[2].innerText;
		}
		return null;
	};
	pandoraInfoHandler.positionString = function()
	{
		if (document.getElementsByClassName("VolumeDurationControl__Duration")[0].children[0].innerText !== "")
		{
			return document.getElementsByClassName("VolumeDurationControl__Duration")[0].children[0].innerText;
		}
		return null;
	};
	pandoraInfoHandler.volume = function()
	{
		return currAudioElement.volume;
	};
	pandoraInfoHandler.rating = function()
	{
		if (document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length > 0)
		{
			return 5;
		}
		else if (document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length > 0)
		{
			return 1;
		}
		return 0;
	};
	pandoraInfoHandler.repeat = null;
	pandoraInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("ShuffleButton__button__shuffleString").length > 0)
		{
			return document.getElementsByClassName("ShuffleButton__button__shuffleString")[0].innerText.includes("On") ? 1 : 0;
		}
		return null;
	};


	var pandoraEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	pandoraEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("Tuner__Audio__TrackDetail__title").length > 0;
	};

	pandoraEventHandler.playpause = function()
	{
		//Click on still listening pop if it exists
		if (document.getElementsByClassName("StillListeningBody").length > 0)
		{
			document.getElementsByClassName("StillListeningBody")[0].children[2].click();
		}
		document.getElementsByClassName("PlayButton")[0].click();
	};
	pandoraEventHandler.next = function()
	{
		document.getElementsByClassName("SkipButton")[0].click();
	};
	pandoraEventHandler.previous = function()
	{
		document.getElementsByClassName("ReplayButton")[0].click();
	};
	pandoraEventHandler.progressSeconds = function(position)
	{
		currAudioElement.currentTime = position;
	};
	pandoraEventHandler.volume = function(volume)
	{
		if (currAudioElement.muted && volume > 0)
		{
			currAudioElement.muted = false;
		}
		else if (volume == 0)
		{
			currAudioElement.muted = true;
		}
		currAudioElement.volume = volume;
	};
	pandoraEventHandler.repeat = null;
	pandoraEventHandler.shuffle = function()
	{
		//We only can change shuffle state if it is visable
		if (document.getElementsByClassName("ShuffleButton__button__shuffleString").length > 0)
		{
			document.getElementsByClassName("ShuffleButton__button__shuffleString")[0].click();
		}
	};
	pandoraEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("ThumbUpButton ")[0].click();
	};
	pandoraEventHandler.toggleThumbsDown = function()
	{
		document.getElementsByClassName("ThumbDownButton")[0].click();
	};
	pandoraEventHandler.rating = function(rating)
	{
		//Check if thumbs has two paths, if it does not then it is active
		if (rating > 3)
		{
			//If thumbs up is not active
			if (document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length === 0)
			{
				document.getElementsByClassName("ThumbUpButton ")[0].click();
			}
		}
		else if (rating < 3 && rating > 0)
		{
			//If thumbs down is not active active
			if (document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length === 0)
			{
				document.getElementsByClassName("ThumbDownButton")[0].click();
			}
		}
		else
		{
			if (document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length > 0)
			{
				document.getElementsByClassName("ThumbUpButton ")[0].click();
			}
			else if (document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length > 0)
			{
				document.getElementsByClassName("ThumbDownButton")[0].click();
			}
		}
	};
}

setup();
init();
