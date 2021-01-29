//Adds support for the new youtube layout
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastImgVideoID = "";
var lastAlbumVideoID = "";
var currIMG = "";
var currCategory = "";
var wasMadeVisable = false;

function setupNew()
{
	var youtubeInfoHandler = createNewMusicInfo();

	youtubeInfoHandler.player = function()
	{
		return "Youtube";
	};

	youtubeInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("ytd-video-primary-info-renderer title").length > 0 &&
			document.getElementsByClassName("ytd-video-primary-info-renderer title")[0].innerText.length > 0;
	};

	youtubeInfoHandler.state = function()
	{
		var state = document.getElementsByClassName("html5-main-video")[0].paused ? 2 : 1;
		if (document.getElementsByClassName("ytp-play-button")[0].getAttribute("aria-label") === null)
		{
			state = 3;
		}
		//It is possible for the video to be "playing" but not started
		if (state == 1 && document.getElementsByClassName("html5-main-video")[0].played.length <= 0)
		{
			state = 2;
		}
		return state;
	};
	youtubeInfoHandler.title = function()
	{
		return document.getElementsByClassName("ytd-video-primary-info-renderer title")[0].innerText;
	};
	youtubeInfoHandler.artist = function()
	{
		return document.querySelector(".ytd-video-secondary-info-renderer .ytd-channel-name").children[0].children[0].children[0].innerText;
	};
	youtubeInfoHandler.album = function()
	{

		//If using a playlist just use the title of that
		if (document.getElementsByClassName("ytd-playlist-panel-renderer title")[0].innerText !== "")
		{
			return document.getElementsByClassName("ytd-playlist-panel-renderer title")[0].innerText;
		}

		//If playing a video with a hashtag use that
		if (document.getElementsByClassName("super-title")[0].children.length > 0)
		{
			return document.getElementsByClassName("super-title")[0].children[0].innerText;
		}

		//Check if the secondary info has a category and is visible
		if (document.getElementsByClassName("sticky ytd-video-secondary-info-renderer")[0].innerText.length > 0 &&
			document.getElementsByClassName("sticky ytd-video-secondary-info-renderer")[0].children[1].children.length > 0)
		{
			//Check if we made the category visable, if we did undo that
			if (wasMadeVisable)
			{
				document.getElementsByClassName("less-button ytd-video-secondary-info-renderer")[0].click();
				wasMadeVisable = false;
			}
			//Return category if visible else
			currCategory = document.getElementsByClassName("sticky ytd-video-secondary-info-renderer")[0].children[1].children[0].children[1].children[0].innerText;
			return currCategory;
		}

		//If the category is not visable make it
		var videoID = window.location.href.substring(window.location.href.indexOf("v=") + 2, window.location.href.indexOf("v=") + 2 + 11);
		if (lastAlbumVideoID !== videoID &&
			document.getElementById("more") !== null)
		{
			//If it is the first time open the info box and find the category
			document.getElementsByClassName("more-button ytd-video-secondary-info-renderer")[0].click();
			lastAlbumVideoID = videoID;
			wasMadeVisable = true;
		}
		//Return no album/last category
		return currCategory;
	};
	youtubeInfoHandler.cover = function()
	{
		var videoID = window.location.href.substring(window.location.href.indexOf("v=") + 2, window.location.href.indexOf("v=") + 2 + 11);

		if (lastImgVideoID !== videoID && videoID !== "ttps://www.")
		{
			lastImgVideoID = videoID;
			var img = document.createElement('img');
			img.setAttribute('src', "https://i.ytimg.com/vi/" + videoID + "/maxresdefault.jpg?");
			img.addEventListener('load', function()
			{
				if (img.height > 90)
				{
					currIMG = "https://i.ytimg.com/vi/" + videoID + "/maxresdefault.jpg?";
				}
				else
				{
					currIMG = "https://i.ytimg.com/vi/" + videoID + "/mqdefault.jpg?";
				}
			});
			img.addEventListener('error', function()
			{
				currIMG = "https://i.ytimg.com/vi/" + videoID + "/mqdefault.jpg?";
			});
		}

		return currIMG;
	};
	youtubeInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("ytp-time-duration")[0].innerText;
	};
	youtubeInfoHandler.position = function()
	{
		return document.getElementsByClassName("html5-main-video")[0].currentTime;
	};
	youtubeInfoHandler.volume = function()
	{
		return document.getElementsByClassName("html5-main-video")[0].volume;
	};
	youtubeInfoHandler.rating = function()
	{
		//Check if thumbs button is active
		if (document.getElementById("menu-container").children[0].children[0].children[0].children[0].children[0].children[0].children[0].getAttribute("aria-pressed") == "true")
		{
			return 5;
		}
		if (document.getElementById("menu-container").children[0].children[0].children[0].children[1].children[0].children[0].children[0].getAttribute("aria-pressed") == "true")
		{
			return 1;
		}
		return 0;
	};
	youtubeInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("html5-main-video")[0].loop == true)
		{
			return 2;
		}
		if (document.getElementById('playlist-action-menu').innerHTML !== "")
		{
			return (document.getElementById("playlist-actions").children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].ariaPressed === "true") ? 1 : 0;
		}
		return 0;
	};
	youtubeInfoHandler.shuffle = function()
	{
		if(document.getElementById('playlist-action-menu').innerHTML !== "")
		{
			return (document.getElementById("playlist-actions").children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].ariaPressed === "true") ? 1 : 0;
		}
		return 0;
	};


	var youtubeEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	youtubeEventHandler.readyCheck = null;

	youtubeEventHandler.playpause = function()
	{
		document.getElementsByClassName("ytp-play-button")[0].click();
	};
	//@TODO implement tab handling
	youtubeEventHandler.next = function()
	{
		document.getElementsByClassName("ytp-next-button")[0].click();
	};
	youtubeEventHandler.previous = function()
	{
		if (document.getElementsByClassName("ytp-prev-button")[0].getAttribute("aria-disabled") == "false")
		{
			document.getElementsByClassName("ytp-prev-button")[0].click();
		}
	};
	youtubeEventHandler.progressSeconds = function(position)
	{
		document.getElementsByClassName("html5-main-video")[0].currentTime = position;
	};
	youtubeEventHandler.volume = function(volume)
	{
		if (document.getElementsByClassName("html5-main-video")[0].muted && volume > 0)
		{
			document.getElementsByClassName("html5-main-video")[0].muted = false;
		}
		else if (volume == 0)
		{
			document.getElementsByClassName("html5-main-video")[0].muted = true;
		}
		document.getElementsByClassName("html5-main-video")[0].volume = volume;
	};
	youtubeEventHandler.repeat = function()
	{
		//If no repeat button on the page then use video's loop element to loop the video
		if (document.getElementById("playlist-action-menu").innerHTML === "")
		{
			document.getElementsByClassName("html5-main-video")[0].loop = !document.getElementsByClassName("html5-main-video")[0].loop;
		}

		else
		{
			if(document.getElementsByClassName("html5-main-video")[0].loop === true)
			{
				document.getElementsByClassName("html5-main-video")[0].loop = false;
				if(document.getElementById("playlist-actions").children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].ariaPressed === "true")
				{
					document.getElementById("playlist-actions").children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].click();
				}
			}
			else if(document.getElementById("playlist-actions").children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].ariaPressed === "true")
			{
				document.getElementById("playlist-actions").children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].click();
				document.getElementsByClassName("html5-main-video")[0].loop = true;
			}
			else
			{
				document.getElementById("playlist-actions").children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].click();
			}
		}
	};
	youtubeEventHandler.shuffle = function()
	{
		if(document.getElementById("playlist-action-menu").innerHTML !== "")
		{
			document.getElementById("playlist-actions").children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].click();
		}
	};
	youtubeEventHandler.toggleThumbsUp = function()
	{
		document.getElementById("menu-container").children[0].children[0].children[0].children[0].children[0].children[0].click();
	};
	youtubeEventHandler.toggleThumbsDown = function()
	{
		document.getElementById("menu-container").children[0].children[0].children[0].children[1].children[0].children[0].click();
	};
	youtubeEventHandler.rating = function(rating)
	{
		//Still just as lovely
		var thumbsUp = document.getElementsByClassName("like-button-renderer")[0].children[0].children[0].getAttribute("class").includes("hid");
		var thumbsDown = document.getElementsByClassName("like-button-renderer")[0].children[2].children[0].getAttribute("class").includes("hid");
		if (rating > 3)
		{
			if (!thumbsUp)
			{
				document.getElementsByClassName("like-button-renderer")[0].children[0].children[0].click();
			}
		}
		else if (rating < 3)
		{
			if (!thumbsDown)
			{

				document.getElementsByClassName("like-button-renderer")[0].children[2].children[0].click();
			}
		}
		else
		{
			if (thumbsUp)
			{
				document.getElementsByClassName("like-button-renderer")[0].children[1].children[0].click();
			}
			else if (thumbsDown)
			{
				document.getElementsByClassName("like-button-renderer")[0].children[3].children[0].click();
			}
		}
	};
}