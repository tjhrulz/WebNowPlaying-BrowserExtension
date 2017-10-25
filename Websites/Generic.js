//This is a generic handler for unsupported sites.
//This will only run if given permissions on all sites.
//Note: Having an image is not guaranteed

var possibleArtist = "";

function setup(element)
{
	var genericInfoHandler = createNewMusicInfo();
	//@TODO possibly monitor all audio and video tags in a page for changes

	genericInfoHandler.player = function()
	{
		return "Generic";
	};

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	genericInfoHandler.readyCheck = function()
	{
		return element !== null && element.duration > 0;
	};

	genericInfoHandler.state = function()
	{
		return element.paused ? 2 : 1;
	};
	genericInfoHandler.title = function()
	{
		var title = "";
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
			temp = "Localhost"
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
			temp = "Localhost"
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

if (document.getElementsByTagName("audio").length > 0)
{
	setup(document.getElementsByTagName("audio")[0]);
	init();
}
else if (document.getElementsByTagName("video").length > 0)
{
	setup(document.getElementsByTagName("video")[0]);
	init();
}


//Proposed solution for dynamic instancing of content:
//Came up with for Pandora, however on the web I would have to account for both video and audio
//Also there is the possibility of content fighting, I may want to have some sort of accumulator list
//Then I would just pick from the list whichever content had a state/duration change the most recently
//Also I wonder if I can check if a video has audio so I can ignore animations (Although most people use source for that these days)
//for (i = 0; i < document.getElementsByTagName("video").length; i++)
//{
//	if (document.getElementsByTagName("video")[i].ontimeupdate === null)
//	{
//		document.getElementsByTagName("video")[i].ontimeupdate = function()
//		{
//			currElement = this;
//		}
//	}
//}
