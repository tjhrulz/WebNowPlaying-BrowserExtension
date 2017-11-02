//Adds support for Plex
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var element;
var lastCover = null;

function blobToDataURL(blob)
{
	var a = new FileReader();
	a.onload = function(e)
	{
		lastCover = e.target.result;
	};
	a.readAsDataURL(blob);
}

function setup()
{
	var plexInfoHandler = createNewMusicInfo();

	plexInfoHandler.player = function()
	{
		return "Plex";
	};

	plexInfoHandler.readyCheck = function()
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

		return element !== undefined &&
			element !== null &&
			element.duration > 0;
	};

	plexInfoHandler.state = function()
	{
		return element.paused ? 2 : 1;
	};
	plexInfoHandler.title = function()
	{
		return document.querySelector('*[class*=AudioVideoPlayerControlsMetadata-titlesContainer]').children[0].innerText;
	};
	plexInfoHandler.artist = function()
	{
		return document.querySelector('*[class*=AudioVideoPlayerControlsMetadata-titlesContainer]').children[1].children[0].innerText;
	};
	plexInfoHandler.album = function()
	{
		return document.querySelector('*[class*=AudioVideoPlayerControlsMetadata-titlesContainer]').children[1].children[2].innerText;
	};
	plexInfoHandler.cover = function()
	{
		//Plex cover is really low res, and due to their obfuscation and the fact that users can use a pin code
		//There is little I can do about it, and even if I could the highest res is only 187x187
		//Also fuck plex for putting this behind a blob

		var cover = document.querySelector('*[class*=AudioVideoPlayerControlsMetadata-cardContainer]').children[0].children[0].children[0].children[0].children[0].style.backgroundImage;
		cover = cover.substring(cover.indexOf("(") + 2, cover.indexOf(")") - 1);

		var xhr = new XMLHttpRequest();
		xhr.open('GET', cover, true);
		xhr.responseType = 'blob';
		xhr.onload = function(e)
		{
			if (this.status == 200)
			{
				var myBlob = this.response;
				blobToDataURL(myBlob);
			}
		};
		xhr.send();
		//Last cover is updated in blob to data url
		return lastCover;
	};
	plexInfoHandler.duration = function()
	{
		return element.duration;
	};
	plexInfoHandler.position = function()
	{
		return element.currentTime;
	};
	plexInfoHandler.volume = function()
	{
		return element.volume;
	};
	plexInfoHandler.rating = function()
	{
		return document.querySelector('*[class*=StarRating-slider]').children[1].children[0].getAttribute("aria-valuenow");
	};
	plexInfoHandler.repeat = function()
	{
		if (document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[0].className.includes("Active"))
		{
			if (document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[0].children[0].className.includes("one"))
			{
				return 2;
			}
			return 1;
		}
		return 0;
	};
	plexInfoHandler.shuffle = function()
	{
		if (document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[4].className.includes("Active"))
		{
			return 1;
		}
		return 0;
	};


	var plexEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	plexEventHandler.readyCheck = function()
	{
		return element !== undefined &&
			element !== null &&
			element.duration > 0;
	};

	plexEventHandler.playpause = function()
	{
		var a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[2];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	plexEventHandler.next = function()
	{
		var a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[3];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	plexEventHandler.previous = function()
	{
		var a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[1];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	plexEventHandler.progressSeconds = function(position)
	{
		element.currentTime = position;
	};
	plexEventHandler.volume = function(volume)
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
	plexEventHandler.repeat = function()
	{
		var a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[0];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	plexEventHandler.shuffle = function()
	{
		var a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[4];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	plexEventHandler.toggleThumbsUp = function()
	{
		var rating = 5;
		//If already rated 5 stars
		if (document.querySelector('*[class*=StarRating-slider]').children[1].children[0].getAttribute("aria-valuenow") == 5)
		{
			rating = 3;
		}
		//So we click at star midpoint
		rating -= 0.5;

		var loc = document.querySelector('*[class*=StarRating-slider]').children[0].getBoundingClientRect();
		var a = document.querySelector('*[class*=StarRating-slider]').children[0];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1,
			screenX + loc.left + loc.width * (rating / 5), screenY + loc.top + loc.height / 2,
			loc.left + loc.width * (rating / 5), loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1,
			screenX + loc.left + loc.width * (rating / 5), screenY + loc.top + loc.height / 2,
			loc.left + loc.width * (rating / 5), loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	plexEventHandler.toggleThumbsDown = function()
	{
		var rating = 1;
		//If already rated 1 stars
		if (document.querySelector('*[class*=StarRating-slider]').children[1].children[0].getAttribute("aria-valuenow") == 1)
		{
			rating = 3;
		}
		//So we click at star midpoint
		rating -= 0.5;

		var loc = document.querySelector('*[class*=StarRating-slider]').children[0].getBoundingClientRect();
		var a = document.querySelector('*[class*=StarRating-slider]').children[0];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1,
			screenX + loc.left + loc.width * (rating / 5), screenY + loc.top + loc.height / 2,
			loc.left + loc.width * (rating / 5), loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1,
			screenX + loc.left + loc.width * (rating / 5), screenY + loc.top + loc.height / 2,
			loc.left + loc.width * (rating / 5), loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	plexEventHandler.rating = function(rating)
	{
		//Plex does not allow reseting ratings as far is I know
		if (rating == 0)
		{
			rating = 3;
		}
		//So we click at star midpoint
		rating -= 0.5;

		var loc = document.querySelector('*[class*=StarRating-slider]').children[0].getBoundingClientRect();
		var a = document.querySelector('*[class*=StarRating-slider]').children[0];
		var e = document.createEvent('MouseEvents');

		e.initMouseEvent('mousedown', true, true, window, 1,
			screenX + loc.left + loc.width * (rating / 5), screenY + loc.top + loc.height / 2,
			loc.left + loc.width * (rating / 5), loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
		e.initMouseEvent('mouseup', true, true, window, 1,
			screenX + loc.left + loc.width * (rating / 5), screenY + loc.top + loc.height / 2,
			loc.left + loc.width * (rating / 5), loc.top + loc.height / 2,
			false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
}

setup();
init();
