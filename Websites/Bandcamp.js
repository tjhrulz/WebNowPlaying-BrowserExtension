// Adds support for Bandcamp
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

function setup()
{
	var bandcampInfoHandler = createNewMusicInfo();

	bandcampInfoHandler.player = function()
	{
		return "Bandcamp";
	};

	bandcampInfoHandler.readyCheck = function()
	{
		return !!document.querySelector('#trackInfoInner');
	};

	bandcampInfoHandler.state = function()
	{
		return document.querySelector('#trackInfoInner .playbutton').className.includes('playing') ? 1 : 2;
	};
	bandcampInfoHandler.title = function()
	{
		return document.querySelector('#trackInfoInner .track_info .title').innerText;
	};
	bandcampInfoHandler.artist = function()
	{
		return document.querySelector('#name-section [itemprop="byArtist"] > a').innerText;
	};
	bandcampInfoHandler.album = function()
	{
		return document.querySelector('#name-section .trackTitle').innerText;
	};
	bandcampInfoHandler.cover = function()
	{
		return document.querySelector('#tralbumArt .popupImage > img').src.replace('_16', '_0');
	};
	bandcampInfoHandler.duration = function()
	{
		return document.querySelector('audio[src]').duration;
	};
	bandcampInfoHandler.position = function()
	{
		return document.querySelector('audio[src]').currentTime;
	};

	var bandcampEventHandler = createNewMusicEventHandler();

	bandcampEventHandler.readyCheck = bandcampInfoHandler.readyCheck;

	bandcampEventHandler.playpause = function()
	{
        document.querySelector('#trackInfoInner .playbutton').click();
	};
	bandcampEventHandler.next = function()
	{
		document.querySelector('#trackInfoInner .nextbutton').click();
	};
	bandcampEventHandler.previous = function()
	{
		document.querySelector('#trackInfoInner .prevbutton').click();
	};
	bandcampEventHandler.progressSeconds = function(position)
	{
		return document.querySelector('audio[src]').currentTime = position;
	};
}


setup();
init();
