//Adds support for Apple Music
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

function setup()
{
	var appleMusicInfoHandler = createNewMusicInfo();

	appleMusicInfoHandler.player = function()
	{
		return "Apple Music";
	};

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	appleMusicInfoHandler.readyCheck = function()
	{
		return document.getElementsByTagName("audio").length > 0 && document.getElementById("playback-name").innerText != "";
	};

	appleMusicInfoHandler.state = function()
	{
		return document.getElementsByTagName("audio")[0].paused ? 2 : 1;
	};
	appleMusicInfoHandler.title = function()
	{
		return document.getElementById("playback-name").innerText;
	};
	appleMusicInfoHandler.artist = function()
	{
		return document.getElementById("playback-sub-copy").children[0].children[0].children[0].children[0].children[0].innerText;
	};
	appleMusicInfoHandler.album = function()
	{
		return document.getElementById("playback-sub-copy").children[0].children[0].children[0].children[0].children[1].innerText;
	};
	appleMusicInfoHandler.cover = function()
	{
        var tempCover = document.getElementsByClassName("media-artwork-v2__image")[2].srcset.substr(document.getElementsByClassName("media-artwork-v2__image")[2].srcset.lastIndexOf(",")+2)
		return tempCover.substr(0, tempCover.indexOf(".jpg")) + ".jpg/2000x2000.jpg";
	};
	appleMusicInfoHandler.duration = function()
	{
		return document.getElementsByTagName("audio")[0].duration;
	};
	appleMusicInfoHandler.position = function()
	{
		return document.getElementsByTagName("audio")[0].currentTime;
	};
	appleMusicInfoHandler.volume = function()
	{
        return document.getElementsByTagName("audio")[0].volume;
	};
	appleMusicInfoHandler.rating = null;
	appleMusicInfoHandler.repeat = function()
	{
        if(document.querySelector('[class*="playback-controls"]').children[0].children[2].getAttribute("aria-checked") == "true")
        {
            //If icon matches repeat just this song
            if (document.querySelector('[class*="playback-controls"]').children[0].children[2].children[0].children[0].getAttribute("d") == "M17,7l0,-1.032c0,-0.259 0.176,-0.468 0.392,-0.468c0.066,0 0.131,0.02 0.189,0.058l2.716,1.782c0.19,0.125 0.259,0.409 0.154,0.635c-0.035,0.078 -0.089,0.142 -0.154,0.185l-2.716,1.782c-0.19,0.125 -0.428,0.042 -0.532,-0.184c-0.032,-0.07 -0.049,-0.147 -0.049,-0.226l0,-1.032l-5.092,0c-0.61,0 -1.055,0.1 -1.41,0.29c-0.309,0.165 -0.543,0.399 -0.708,0.708c-0.159,0.297 -0.255,0.658 -0.282,1.125c-0.004,0.06 -0.011,0.154 -0.024,0.281c-0.071,0.34 -0.372,0.596 -0.734,0.596c-0.414,0 -0.75,-0.336 -0.75,-0.75l0,-0.25c0,-0.866 0.162,-1.139 0.467,-1.709c0.306,-0.571 0.753,-1.018 1.324,-1.324c0.57,-0.305 1.251,-0.467 2.117,-0.467l5.092,0Zm-4,8l0,1.006c0,0.083 -0.017,0.165 -0.049,0.238c-0.104,0.239 -0.342,0.326 -0.532,0.195l-2.716,-1.881c-0.065,-0.045 -0.119,-0.113 -0.154,-0.195c-0.105,-0.239 -0.036,-0.539 0.154,-0.671l2.716,-1.881c0.058,-0.04 0.123,-0.061 0.189,-0.061c0.216,0 0.392,0.221 0.392,0.494l0,1.256l5.092,0c0.61,0 1.055,-0.1 1.41,-0.29c0.309,-0.165 0.543,-0.399 0.708,-0.708c0.159,-0.297 0.255,-0.658 0.282,-1.125c0.004,-0.06 0.011,-0.154 0.024,-0.281c0.071,-0.34 0.372,-0.596 0.734,-0.596c0.414,0 0.75,0.336 0.75,0.75l0,0.25c0,0.866 -0.162,1.139 -0.467,1.709c-0.306,0.571 -0.753,1.018 -1.324,1.324c-0.57,0.305 -1.251,0.467 -2.117,0.467l-5.092,0Zm10.5,-12c0.414,0 0.5,0.336 0.5,0.75l0,3.5c0,0.414 -0.336,0.75 -0.75,0.75c-0.414,0 -0.75,-0.336 -0.75,-0.75l0,-2.616l-0.384,0.346c-0.141,0.098 -0.272,0.15 -0.395,0.155c-0.165,0.007 -0.355,-0.069 -0.471,-0.186c-0.131,-0.131 -0.184,-0.304 -0.141,-0.503c0.03,-0.142 0.16,-0.291 0.391,-0.446c0.497,-0.569 0.846,-0.902 1.047,-1c0.227,-0.111 0.591,0 0.953,0Z")
            {
                return 2;
            }
            //Else it is just normal repeat
            return 1;
        }
		return 0;
	};
	appleMusicInfoHandler.shuffle = function()
	{
        if(document.querySelector('[class*="playback-controls"]').children[0].children[0].getAttribute("aria-checked") == "true")
        {
            return 1;
        }
		return 0;
	};


	var appleMusicEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	appleMusicEventHandler.readyCheck = function()
	{
		return document.getElementsByTagName("audio").length > 0 && document.getElementById("playback-name").innerText != "";
	};

	appleMusicEventHandler.playpause = function()
	{
		if (document.getElementsByTagName("audio")[0].paused)
		{
			document.getElementsByTagName("audio")[0].play();
		}
		else
		{
			document.getElementsByTagName("audio")[0].pause();
		}
	};
	appleMusicEventHandler.next = function()
	{
		document.querySelector('[class*="playback-controls"]').children[0].children[1].children[2].click();
	};
	appleMusicEventHandler.previous = function()
	{
		document.querySelector('[class*="playback-controls"]').children[0].children[1].children[0].click();
	};
	appleMusicEventHandler.progressSeconds = function(position)
	{
		document.getElementsByTagName("audio")[0].currentTime = position;
	};
	appleMusicEventHandler.volume = function(volume)
	{
		document.getElementsByTagName("audio")[0].volume = volume;
	};
	appleMusicEventHandler.repeat = function()
	{
		document.querySelector('[class*="playback-controls"]').children[0].children[2].click();
	};
	appleMusicEventHandler.shuffle = function()
	{
		document.querySelector('[class*="playback-controls"]').children[0].children[0].click();
	};
	appleMusicEventHandler.toggleThumbsUp = null;
	appleMusicEventHandler.toggleThumbsDown = null;
	appleMusicEventHandler.rating = null;
}

setup();
init();