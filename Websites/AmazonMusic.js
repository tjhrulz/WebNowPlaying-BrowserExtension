//Adds support for Amazon Music
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

//Amazon does not always have their volume visible and thus we need to cache what the last known value was
//We assume it is 1 since that is the default value and what most people are going to have it at
var lastKnownVolume = 1;

function setup()
{
	var amznInfoHandler = createNewMusicInfo();

	amznInfoHandler.player = function()
	{
		return "Amazon Music";
	};

	amznInfoHandler.readyCheck = function()
	{
		if(document.getElementsByTagName("music-horizontal-item").length > 0 && document.getElementById("transport") !== null)
		{
			return document.getElementsByTagName("music-horizontal-item")[document.getElementsByTagName("music-horizontal-item").length-1].getAttribute("primary-text").length > 0 ? 1 : 0
		}
		return 0;
	};

	amznInfoHandler.state = function()
	{
		//If icon is pause then we are currently playing
		return document.getElementById("transport").children[1].children[2].getAttribute("icon-name").includes("pause") ? 1 : 2;
	};
	amznInfoHandler.title = function()
	{
		return document.getElementById("transport").children[0].children[0].getAttribute("primary-text");
	};
	amznInfoHandler.artist = function()
	{
		return document.getElementById("transport").children[0].children[0].getAttribute("secondary-text");
	};
	amznInfoHandler.album = function()
	{
		return document.getElementById("transport").children[0].children[0].getAttribute("secondary-text-2");
	};
	amznInfoHandler.cover = function()
	{
		return document.getElementById("transport").children[0].children[0].getAttribute("image-src");

	};
	amznInfoHandler.duration = function()
	{
		//Amazon does not give total time, just time into the song and time remaining. So we get the seconds of each and then add them together
		//@NOTE Keep an eye on this in the future, they may add an option to show total time instead of time reamaining like other services
		var timeFromEndString = document.getElementById("transport").lastElementChild.lastElementChild.children[1].innerText.replace("- ", "");
		var timeFromEndSec = parseInt(timeFromEndString.substring(timeFromEndString.indexOf(":") + 1)) + parseInt(timeFromEndString.substring(0, timeFromEndString.indexOf(":"))) * 60;
		var timeFromBeginingString = document.getElementById("transport").lastElementChild.lastElementChild.children[0].innerText
		var timeFromBeginingSec = parseInt(timeFromBeginingString.substring(timeFromBeginingString.indexOf(":") + 1)) + parseInt(timeFromBeginingString.substring(0, timeFromBeginingString.indexOf(":"))) * 60;
		
		return timeFromBeginingSec + timeFromEndSec;
	};
	amznInfoHandler.position = function()
	{
		var timeFromBeginingString = document.getElementById("transport").lastElementChild.lastElementChild.children[0].innerText
		var timeFromBeginingSec = parseInt(timeFromBeginingString.substring(timeFromBeginingString.indexOf(":") + 1)) + parseInt(timeFromBeginingString.substring(0, timeFromBeginingString.indexOf(":"))) * 60;
		
		return timeFromBeginingSec;
	};
	amznInfoHandler.volume = function()
	{
		if(document.getElementById("volume-range") !== null)
		{
			lastKnownVolume = document.getElementById("volume-range").value;
		}
		return lastKnownVolume;
	};
	amznInfoHandler.rating = function()
	{
		//Icon name is add when it is not in library, icon name is done otherwise.
		//If it is in library assume liked
		if (document.getElementById("transport").children[0].children[1].children[0].children[0].getAttribute("icon-name") === "done")
		{
			return 5;
		}
		return 0;
	};
	//The new Amazon Music redesign has multiple encapsulation layers that abstract away my access to lower level elements so I sadly have to use aria labels
	//Because of this repeat and shuffle may not work in all languages
	amznInfoHandler.repeat = function()
	{
		var state = document.getElementById("transport").children[1].children[0].getAttribute("aria-label");
		
		//Amazon labels everything based of the next type, since I have no way to work off besides label this will have to do
		if (state.indexOf("One") != -1)
		{
			return 1;
		}
		else if (state.indexOf("Off") != -1)
		{
			return 2;
		}
		return 0;
	};
	amznInfoHandler.shuffle = function()
	{
		//If the aria label is turn off shuffle then it must be on
		if (document.getElementById("transport").children[1].children[4].getAttribute("aria-label").includes("Off"))
		{
			return 1;
		}
		return 0;
	};


	var amznEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	amznEventHandler.readyCheck = function()
	{
		return document.getElementsByTagName("music-horizontal-item").length > 0 && document.getElementById("transport") !== null;
	};

	amznEventHandler.playpause = function()
	{
		document.getElementById("transport").children[1].children[2].click();
	};
	amznEventHandler.next = function()
	{
		document.getElementById("transport").children[1].children[3].click();
	};
	amznEventHandler.previous = function()
	{
		document.getElementById("transport").children[1].children[1].click();
	};
	//Amazon now uses input type range for both their progress and volume
	amznEventHandler.progress = null;
	amznEventHandler.volume = null;
	amznEventHandler.repeat = function()
	{
		document.getElementById("transport").children[1].children[0].click()
	};
	amznEventHandler.shuffle = function()
	{
		document.getElementById("transport").children[1].children[4].click()
	};
	amznEventHandler.toggleThumbsUp = function()
	{
		document.getElementById("transport").children[0].children[1].children[0].children[0].click();
	};
	amznEventHandler.toggleThumbsDown = null;
	amznEventHandler.rating = function(rating)
	{
		if (rating > 3)
		{
			//If not added to library
			if (document.getElementById("transport").children[0].children[1].children[0].children[0].getAttribute("icon-name") === "add")
			{
				document.getElementById("transport").children[0].children[1].children[0].children[0].click();
			}
		}
		else if (document.getElementById("transport").children[0].children[1].children[0].children[0].getAttribute("icon-name") === "done")
		{
			document.getElementById("transport").children[0].children[1].children[0].children[0].click();
		}
	};
}


setup();
init();
