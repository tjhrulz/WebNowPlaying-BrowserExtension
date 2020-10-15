//Adds support for twitch
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

function setup()
{
	var twitchInfoHandler = createNewMusicInfo();

	twitchInfoHandler.player = function()
	{
		return "Twitch";
	};

	twitchInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("video-player__default-player").length > 0 && document.getElementsByTagName('video').length > 0;
	};

	twitchInfoHandler.state = function()
	{
		return document.getElementsByTagName("video")[0].paused ? 2 : 1;
	};
	twitchInfoHandler.title = function()
	{
		return document.querySelector("h2.tw-ellipsis").title;
	};
	twitchInfoHandler.artist = function()
	{
		return document.querySelector("h1.tw-c-text-base").innerText;
	};
	twitchInfoHandler.album = function()
	{
		return document.querySelector("span.tw-font-size-5").innerText;
	};
	twitchInfoHandler.cover = function()
	{
		return document.querySelector(".tw-avatar--size-64 > img:nth-child(1)").src.replace("70x70", "600x600");
	};
	twitchInfoHandler.duration = function()
	{
		//If the duration is 1073741824 then it is a live video and we should just return the current time
		//I may want to cache this so we always get 100 since some time will pass between calls
		if(document.getElementsByTagName("video")[0].duration == "1073741824")
		{
			return document.getElementsByTagName("video")[0].currentTime
		}
		return document.getElementsByTagName("video")[0].duration;
	};
	twitchInfoHandler.position = function()
	{
		return document.getElementsByTagName("video")[0].currentTime;
	};
	twitchInfoHandler.volume = function()
	{
		return document.getElementsByTagName("video")[0].volume;
	};
	twitchInfoHandler.rating = function()
	{
		if(document.getElementsByClassName("follow-btn__follow-btn")[0].className.includes("following"))
		{
			return 5;
		}
		return 0;
	};
	twitchInfoHandler.repeat = function()
	{
		return 0;
	};
	twitchInfoHandler.shuffle = function()
	{
		return 0;
	};


	var twitchEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	twitchEventHandler.readyCheck = null;

	twitchEventHandler.playpause = function()
	{
		if (document.getElementsByTagName("video")[0].paused)
		{
			document.getElementsByTagName("video")[0].play();
		}
		else
		{
			document.getElementsByTagName("video")[0].pause();
		}
	};
	//@TODO implement tab handling
	twitchEventHandler.next = function()
	{
		//If we are not live
		if(document.getElementsByTagName("video")[0].duration != "1073741824")
		{
			document.getElementsByTagName("video")[0].currentTime = document.getElementsByTagName("video")[0].duration;
		}
	};
	twitchEventHandler.previous = function()
	{
		//If we are not live
		if(document.getElementsByTagName("video")[0].duration != "1073741824")
		{
			document.getElementsByTagName("video")[0].currentTime = 0;
		}
	};
	twitchEventHandler.progressSeconds = function(position)
	{
		//If we are not live
		if(document.getElementsByTagName("video")[0].duration != "1073741824")
		{
			document.getElementsByTagName("video")[0].currentTime = position;
		}
	};
	twitchEventHandler.volume = function(volume)
	{
		//Twitch bugs out when you mute it so we wont do that
		document.getElementsByTagName("video")[0].volume = volume;
	};
	twitchEventHandler.repeat = null;
	twitchEventHandler.shuffle = null;
	twitchEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("follow-btn__follow-btn")[0].children[0].children[0].click();
	};
	twitchEventHandler.toggleThumbsDown = null;
	twitchEventHandler.rating = function(rating)
	{
		if (rating > 3)
		{
			if(!document.getElementsByClassName("follow-btn__follow-btn")[0].className.includes("following"))
			{
				document.getElementsByClassName("follow-btn__follow-btn")[0].children[0].children[0].click();
			}
		}
		else
		{
			if(document.getElementsByClassName("follow-btn__follow-btn")[0].className.includes("following"))
			{
				document.getElementsByClassName("follow-btn__follow-btn")[0].children[0].children[0].click();
			}
		}
	};
}


setup();
init();