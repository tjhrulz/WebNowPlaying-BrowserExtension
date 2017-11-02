//Adds support for Pocket Casts
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/


function setup()
{
	var pocketInfoHandler = createNewMusicInfo();

	pocketInfoHandler.player = function()
	{
		return "Pocket Casts";
	};

	pocketInfoHandler.readyCheck = function()
	{
		return document.getElementsByTagName("audio").length > 0 &&
			document.getElementsByTagName("audio")[0].duration > 0 &&
			document.getElementsByClassName("player_episode").length > 0;
	};

	pocketInfoHandler.state = function()
	{
		return document.getElementsByTagName("audio")[0].paused ? 2 : 1;
	};
	pocketInfoHandler.title = function()
	{
		return document.getElementsByClassName("player_episode")[0].innerText;
	};
	pocketInfoHandler.artist = function()
	{
		return document.getElementsByClassName("player_podcast_title")[0].innerText;
	};
	pocketInfoHandler.album = function()
	{
		return "Podcast";
	};
	pocketInfoHandler.cover = function()
	{
		var cover = document.getElementsByClassName("player_artwork")[0].children[0].getAttribute("data-fallback-src");

		if (cover === null || cover.length == 0)
		{
			cover = document.getElementsByClassName("player_artwork")[0].children[0].src;
		}

		return cover;
	};
	pocketInfoHandler.duration = function()
	{
		return document.getElementsByTagName("audio")[0].duration;
	};
	pocketInfoHandler.position = function()
	{
		return document.getElementsByTagName("audio")[0].currentTime;
	};
	pocketInfoHandler.volume = function()
	{
		return document.getElementsByTagName("audio")[0].volume;
	};


	var pocketEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	pocketEventHandler.readyCheck = function()
	{
		return document.getElementsByTagName("audio").length > 0 &&
			document.getElementsByTagName("audio")[0].duration > 0 &&
			document.getElementsByClassName("player_episode").length > 0;
	};

	pocketEventHandler.playpause = function()
	{
		document.getElementsByClassName("play_pause_button")[0].click();
	};
	pocketEventHandler.next = function()
	{
		document.getElementsByClassName("skip_forward_button")[0].click();
	};
	pocketEventHandler.previous = function()
	{
		document.getElementsByClassName("skip_back_button")[0].click();
	};
	pocketEventHandler.progressSeconds = function(position)
	{
		document.getElementsByTagName("audio")[0].currentTime = position;
	};
	pocketEventHandler.volume = function(volume)
	{
		if (document.getElementsByTagName("audio")[0].muted && volume > 0)
		{
			document.getElementsByTagName("audio")[0].muted = false;
		}
		else if (volume == 0)
		{
			document.getElementsByTagName("audio")[0].muted = true;
		}
		document.getElementsByTagName("audio")[0].volume = volume;
	};
}


setup();
init();
