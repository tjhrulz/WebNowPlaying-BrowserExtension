//This is a generic handler for unsupported sites.
//This will only run if given permissions on all sites.
//Note: Having an image is not guaranteed
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var possibleArtist = "";

var element = null;
var elements = [];


//Proposed solution for dynamic instancing of content:
//Came up with for Pandora and improved to make it more dynamic

//Basically it adds to every element a function to call on time update
//This then accumulates sources that have updated until the current element is requested
//If the last returned element is in the updated list then it is returned
//If it is not then whatever element was updated the most recently is returned
//If the list is empty then it returns the last used element
//If no element has been used in the past then it returns the first video element in that page
//If there is no video element then it returns the first audio element in that page
//If these is no elements at all then it returns null
//At that point in time the accumlated elements are purged from the list

//Adds an audio or video source to a list of elements
function addToChangedList(source)
{
	elements.push(source);
}

function updateCurrentElement()
{
	//If any elements have been updated since last check
	if (elements.length > 0)
	{
		//If last used element does not exist in array select a new one
		if (elements.indexOf(element) < 0)
		{
			//Update element to the element that came in most recently
			//@TODO make this ignore elements that are muted or have no sound
			//@TODO prioritize elements in the list that had a state or src change more recently to break ties
			element = elements[elements.length - 1];
		}
	}
	//No elements have been updated, only try to change element if it is null
	else if (element === null || element === undefined)
	{
		//Check all audio elements and set element to the first one with any length
		for (var i = 0; i < document.getElementsByTagName("audio").length; i++)
		{
			if (document.getElementsByTagName("audio")[i].duration > 0)
			{
				element = document.getElementsByTagName("audio")[i];
				break;
			}
		}
		//If no suitable audio element was found try to check for video elements
		if (element === null)
		{
			//@TODO check if there is a way to see if a video has audio
			for (var i = 0; i < document.getElementsByTagName("video").length; i++)
			{
				if (document.getElementsByTagName("video")[i].duration > 0)
				{
					element = document.getElementsByTagName("video")[i];
					break;
				}
			}
		}
	}

	//Clear array of updated elements
	elements = [];
}

function setupElementEvents()
{
	for (var i = 0; i < document.getElementsByTagName("video").length; i++)
	{
		if (document.getElementsByTagName("video")[i].ontimeupdate === null)
		{
			document.getElementsByTagName("video")[i].ontimeupdate = function()
			{
				addToChangedList(this);
			};
		}
	}
	for (var i = 0; i < document.getElementsByTagName("audio").length; i++)
	{
		//@TODO may have to not check if null in case someone else has a time update event already (Although in those cases I may break their site)
		if (document.getElementsByTagName("audio")[i].ontimeupdate === null)
		{
			document.getElementsByTagName("audio")[i].ontimeupdate = function()
			{
				addToChangedList(this);
			};
		}
	}
}

function setup()
{
	var genericInfoHandler = createNewMusicInfo();
	//@TODO possibly monitor all audio and video tags in a page for changes

	genericInfoHandler.player = function()
	{
		return document.domain;
	};

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	genericInfoHandler.readyCheck = function()
	{
		//Most elements will already have events attached but this will add it to any new elements
		setupElementEvents();
		return element !== undefined && element !== null && element.duration > 0;
	};

	genericInfoHandler.state = function()
	{
		return element.paused ? 2 : 1;
	};
	genericInfoHandler.title = function()
	{
		var title = "";
		//@TODO Send all of these to the artist guesser?
		if (document.querySelector('meta[property="og:title"]') !== null)
		{
			title = document.querySelector('meta[property="og:title"]').content;
		}
		else if (document.querySelector('meta[name="title"]') !== null)
		{
			title = document.querySelector('meta[name="title"]').content;
		}
		else
		{
			title = document.title;

			//@TODO Possibly strip stupid chars like ◼ ❙❙ ❚❚ ► ▮▮ ▶ ▷ ❘ ❘ ▷
		}

		//Try to inteligently parse title to see if it contains the artist info
		//This errors on the side of not getting the artist to prevent messing up the title
		//ie it does not just look for the word by in the title
		var temp = title.toLowerCase();
		if (temp.includes(", by"))
		{
			//@TODO I probably could make this a function that takes a search string in the future

			//Find cutoff points
			var cutStart = temp.indexOf(", by");
			var cutEnd = temp.indexOf(", by") + 4; //+4 because I am lazy and ", by" is 4 chars
			temp = temp.substring(cutEnd);
			//Skip the space the the beginning if their is one
			if (temp.charAt(0) === " ")
			{
				cutEnd++;
			}

			possibleArtist = title.substring(cutEnd);
			title = title.substring(0, cutStart);
		}
		else if (temp.includes("by:"))
		{
			//Find cutoff points
			var cutStart = temp.indexOf("by:");
			var cutEnd = temp.indexOf("by:") + 3; //+3 because I am lazy and "by:" is 3 chars
			temp = temp.substring(cutEnd);
			//Skip the space the the beginning if their is one
			if (temp.charAt(0) === " ")
			{
				cutEnd++;
			}

			possibleArtist = title.substring(cutEnd);
			title = title.substring(0, cutStart);
		}
		//Possible additions that may be too aggressive "|" "-"


		return title;
	};
	genericInfoHandler.artist = function()
	{
		if (possibleArtist.length > 0)
		{
			return possibleArtist;
		}

		var temp = document.domain;
		temp = temp.substring(0, temp.lastIndexOf("."));
		temp = temp.substring(temp.lastIndexOf(".") + 1);
		temp = temp.charAt(0).toUpperCase() + temp.slice(1);

		if (temp == "")
		{
			temp = "Localhost";
		}
		return temp;
	};
	genericInfoHandler.album = function()
	{
		var temp = document.domain;
		temp = temp.substring(0, temp.lastIndexOf("."));
		temp = temp.substring(temp.lastIndexOf(".") + 1);
		temp = temp.charAt(0).toUpperCase() + temp.slice(1);

		if (temp == "")
		{
			temp = "Localhost";
		}
		return temp;
	};
	genericInfoHandler.cover = function()
	{
		if (element.poster !== undefined)
		{
			return element.poster;
		}
		return document.querySelector('meta[property="og:image"]').content;
	};
	genericInfoHandler.duration = function()
	{
		return element.duration;
	};
	genericInfoHandler.position = function()
	{
		return element.currentTime;
	};
	genericInfoHandler.volume = function()
	{
		if (!element.muted)
		{
			return element.volume;
		}
		return 0;
	};
	genericInfoHandler.rating = null;
	genericInfoHandler.repeat = function()
	{
		return element.loop ? 2 : 0;
	};
	genericInfoHandler.shuffle = null;


	var genericEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	genericEventHandler.readyCheck = function()
	{
		return element !== null;
	};

	genericEventHandler.playpause = function()
	{
		if (element.paused)
		{
			element.play();
		}
		else
		{
			element.pause();
		}
	};
	genericEventHandler.next = function()
	{
		element.currentTime = element.duration;
	};
	genericEventHandler.previous = function()
	{
		element.currentTime = 0;
	};
	genericEventHandler.progressSeconds = function(position)
	{
		element.currentTime = position;
	};
	genericEventHandler.volume = function(volume)
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
	genericEventHandler.repeat = function()
	{
		element.loop = !element.loop;
	};
	genericEventHandler.shuffle = null;
	genericEventHandler.toggleThumbsUp = null;
	genericEventHandler.toggleThumbsDown = null;
	genericEventHandler.rating = null;
}

//Setup events on all elements to get when updated (Also called in readyCheck)
setupElementEvents();

//This will update which element is selected to display
setInterval(function()
{
	updateCurrentElement();
}, 1000);


//Standard setup but check settings first
// Use default value color = 'red' and likesColor = true.
chrome.storage.sync.get(
{
	"doGeneric": false,
	"useGenericList": false,
	"whitelistOrBlacklist": 'whitelist',
	"genericList": ["streamable.com", "www.adultswim.com"]
}, function(items)
{
	//If set to use generic
	if (items.doGeneric)
	{
		if (items.useGenericList)
		{
			var isInList = false;
			for (var i = 0; i < items.genericList.length; i++)
			{
				isInList = items.genericList[i].includes(window.location.hostname);
				if (isInList)
				{
					break;
				}
			}
			if (isInList && items.whitelistOrBlacklist == "whitelist" || !isInList && items.whitelistOrBlacklist == "blacklist")
			{
				setup();
				init();
			}
		}
		else
		{
			setup();
			init();
		}
	}
}
);
