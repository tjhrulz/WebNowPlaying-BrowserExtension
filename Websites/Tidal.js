//Adds support for Tidal
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var element = null;

function setup()
{
	var tidalInfoHandler = createNewMusicInfo();

	tidalInfoHandler.player = function()
	{
		return "Tidal";
	};

	tidalInfoHandler.readyCheck = function()
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

		return element !== null &&
			document.querySelector('[class^="mediaInformation"]').children.length > 0 &&
			document.querySelector('[class^="mediaInformation"]').children[0].innerText.length > 0;
	};

	tidalInfoHandler.state = function()
	{
		return element.paused ? 2 : 1;
	};
	tidalInfoHandler.title = function()
	{
		return document.querySelector('[class^="mediaInformation"]').children[0].innerText;
	};
	tidalInfoHandler.artist = function()
	{
		return document.querySelector('[class^="mediaInformation"]').children[1].innerText;
	};
	tidalInfoHandler.album = function()
	{
		return document.querySelector('[class^="mediaInformation"]').children[2].children[1].innerText;
	};
	tidalInfoHandler.cover = function()
	{
		//Capture small src image
		var tempIMG = document.querySelector('[class^="mediaImagery"]').children[0].src;
		//Remove size and replace it with max size before returning
		return tempIMG.substring(0, tempIMG.lastIndexOf("/")) + "/1280x1280.jpg";
	};
	tidalInfoHandler.duration = function()
	{
		return element.duration;
	};
	tidalInfoHandler.position = function()
	{
		return element.currentTime;
	};
	tidalInfoHandler.volume = function()
	{
		return parseInt(document.querySelector('[class^="volumeSlider"]').getAttribute("aria-valuenow")) / 100;
	};
	tidalInfoHandler.rating = function()
	{
		if (document.querySelector('[class^="mediaActions"]').children[1].className.includes("favorite"))
		{
			return 5;
		}
		return 0;
	};
	tidalInfoHandler.repeat = function()
	{
		if (document.querySelector('[class^="repeatStateIcon"]').className.baseVal.includes("all"))
		{
			return 1;
		}
		if (document.querySelector('[class^="repeatStateIcon"]').className.baseVal.includes("once"))
		{
			return 2;
		}
		return 0;
	};
	tidalInfoHandler.shuffle = function()
	{
		//Icon for shuffle button is goofy, they seem to have an oversite in their code and it only has a class when active
		if (document.querySelector('[class^="shuffleIconActive"]') !== null)
		{
			return 1;
		}
		return 0;
	};


	var tidalEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	tidalEventHandler.readyCheck = function()
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

		return element !== null &&
			document.querySelector('[class^="mediaInformation"]').children.length > 0 &&
			document.querySelector('[class^="mediaInformation"]').children[0].innerText.length > 0;
	};

	tidalEventHandler.playpause = function()
	{
		document.querySelector('[class^="playbackToggle"]').click();
	};
	tidalEventHandler.next = function()
	{
		document.querySelector('[class^="playbackControls"]').children[3].click();
	};
	tidalEventHandler.previous = function()
	{
		document.querySelector('[class^="playbackControls"]').children[1].click();
	};
	tidalEventHandler.progressSeconds = function(position)
	{
		element.currentTime = position;
	};
	tidalEventHandler.volume = function(volume)
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
	tidalEventHandler.repeat = function()
	{
		document.querySelector('[class^="playbackControls"]').children[4].click();
	};
	tidalEventHandler.shuffle = function()
	{
		document.querySelector('[class^="playbackControls"]').children[0].click();
	};
	tidalEventHandler.toggleThumbsUp = function()
	{
		document.querySelector('[class^="mediaActions"]').children[1].click();
	};
	tidalEventHandler.toggleThumbsDown = null;
	tidalEventHandler.rating = function(rating)
	{
		//Check if thumbs has two paths, if it does not then it is active
		if (rating > 3)
		{
			//If thumbs up is not active
			if (!document.querySelector('[class^="mediaActions"]').children[1].className.includes("favorite"))
			{
				document.querySelector('[class^="mediaActions"]').children[1].click();
			}
		}
		else
		{
			if (document.querySelector('[class^="mediaActions"]').children[1].className.includes("favorite"))
			{
				document.querySelector('[class^="mediaActions"]').children[1].click();
			}
		}
	};
}


setup();
init();
