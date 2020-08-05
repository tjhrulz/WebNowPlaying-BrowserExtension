// Adds support for Twitch
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

function setup() {
	var twitchInfoHandler = createNewMusicInfo();

	twitchInfoHandler.player = function()
	{
		return "Twitch";
	};
	twitchInfoHandler.readyCheck = function()
	{
		return document.querySelector('h2.tw-ellipsis').innerText.length > 0;
	};

	twitchInfoHandler.state = function()
	{
		return (document.querySelector('.player-controls__left-control-group > div:nth-child(1) > button:nth-child(1)').attributes["data-a-player-state"].value == "playing") ? 1 : 2;
	};
	twitchInfoHandler.title = function()
	{
		return document.querySelector('h2.tw-ellipsis').innerText;
	};
	twitchInfoHandler.artist = function()
	{
		return document.querySelector('h1.tw-c-text-base').innerText;
	};
	twitchInfoHandler.cover = function()
	{
		return document.querySelector('.tw-avatar--size-64 > img:nth-child(1)').src;
	};
	twitchInfoHandler.duration = function()
	{
		return document.querySelector('.live-time').innerText;
	};
	twitchInfoHandler.position = function()
	{
		return document.querySelector('.live-time').innerText;
	};

	var twitchEventHandler = createNewMusicEventHandler();

	twitchEventHandler.readyCheck = twitchInfoHandler.readyCheck;

	twitchEventHandler.playpause = function()
	{
        document.querySelector('.player-controls__left-control-group > div:nth-child(1) > button:nth-child(1)').click()
	};
	twitchEventHandler.progressSeconds = function(position)
	{
		return document.querySelector('.live-time').innerText = position;
	};
}

setup()
init()