//Adds support for Yandex Music
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastAlbumURL = "";
var lastKnownAlbum = "";

function setup()
{
	var yandexMusicInfoHandler = createNewMusicInfo();

	yandexMusicInfoHandler.player = function()
	{
		return "Yandex Music";
	};

	yandexMusicInfoHandler.readyCheck = function()
	{
		return document.getElementsByClassName("track__title").length > 0;
	};

	yandexMusicInfoHandler.state = function()
	{
		return document.getElementsByClassName("player-controls__btn_pause")[0] ? 1 : 2;
	};

	yandexMusicInfoHandler.title = function()
	{
		return document.getElementsByClassName("track__title")[0].innerText;
	};

	yandexMusicInfoHandler.artist = function()
	{
		return document.getElementsByClassName("track__artists")[0].innerText;
	};

	yandexMusicInfoHandler.album = function()
	{
		if (lastAlbumURL !== document.getElementsByClassName("track__title")[0].href)
		{
			lastAlbumURL = document.getElementsByClassName("track__title")[0].href;

			var ajaxReq = new XMLHttpRequest();
			ajaxReq.onreadystatechange = function()
			{
				if (ajaxReq.readyState == 4)
				{
					var jsonAlbum = JSON.parse(ajaxReq.response);
					lastKnownAlbum = jsonAlbum.title;
				}
			};
			ajaxReq.open("GET", "https://music.yandex.ru/handlers/album.jsx?album=" + lastAlbumURL.substr(lastAlbumURL.search("/album/") + 7, lastAlbumURL.length).substr(0, lastAlbumURL.substr(lastAlbumURL.search("/album/") + 7, lastAlbumURL.length).search("/")));
			ajaxReq.send();
		}

		return lastKnownAlbum;
	};

	yandexMusicInfoHandler.cover = function()
	{
		return document.getElementsByClassName('track_type_player')[0].getElementsByClassName('entity-cover__image')[0].src.replace("50x50", "1000x1000");
	};

	yandexMusicInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("progress__right")[0].innerText;
	};

	yandexMusicInfoHandler.positionString = function()
	{
		return document.getElementsByClassName("progress__left")[0].innerText;
	};

	yandexMusicInfoHandler.volume = function()
	{
		return parseInt(document.getElementsByClassName("volume__bar")[0].children[0].children[0].children[0].style.height) / 100;
	};

	yandexMusicInfoHandler.rating = function()
	{
		if (document.getElementsByClassName("player-controls__track-controls")[0].children[0].classList.contains("d-like_on"))
		{
			return 5;
		}
		else if (document.getElementsByClassName("d-icon_circle-crossed_on").length > 0)
		{
			return 1;
		}
		return 0;
	};

	yandexMusicInfoHandler.repeat = function()
	{
		if (document.getElementsByClassName("player-controls__btn_repeat_state2").length > 0)
		{
			return 1;
		}
		else if (document.getElementsByClassName("player-controls__btn_repeat_state1").length > 0)
		{
			return 2;
		}

		return 0;
	};

	yandexMusicInfoHandler.shuffle = function()
	{
		if (document.getElementsByClassName("d-icon_shuffle-gold").length > 0)
		{
			return 1;
		}
		
		return 0;
	}

	var yandexMusicEventHandler = createNewMusicEventHandler();

	yandexMusicEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("track__title").length > 0;
	};

	yandexMusicEventHandler.playpause = function()
	{
		document.getElementsByClassName("player-controls__btn_play")[0].click();
	};

	yandexMusicEventHandler.next = function()
	{
		document.getElementsByClassName("player-controls__btn_next")[0].click();
	};

	yandexMusicEventHandler.previous = function()
	{
		document.getElementsByClassName("player-controls__btn_prev")[0].click();
	};

	yandexMusicEventHandler.progressSeconds = function(position)
	{
		//Add HTML element <script>
		var scriptHTML = document.createElement('script');
		scriptHTML.classList.add("embedded-script-progress");
		//use externalAPI site to rewind songs and delete <script> 
		scriptHTML.innerText = "externalAPI.setPosition(" + position + ");document.getElementsByClassName(\"embedded-script-progress\")[0].remove();";
		document.head.appendChild(scriptHTML);
	};

	yandexMusicEventHandler.volume = function(volume)
	{
		var scriptHTML = document.createElement('script');
		scriptHTML.classList.add("embedded-script-volume");
		scriptHTML.innerText = "externalAPI.setVolume(" + volume + ");document.getElementsByClassName(\"embedded-script-volume\")[0].remove();";
		document.head.appendChild(scriptHTML);
	};

	yandexMusicEventHandler.repeat = function()
	{
		document.getElementsByClassName("player-controls__btn_repeat")[0].click();
	};

	yandexMusicEventHandler.shuffle = function()
	{
		document.getElementsByClassName("player-controls__btn_shuffle")[0].click();
	};

	yandexMusicEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("player-controls__track-controls")[0].children[0].click();
	};

	yandexMusicEventHandler.toggleThumbsDown = function()
	{
		document.getElementsByClassName("player-controls__track-controls")[0].children[3].click();
	};

	yandexMusicEventHandler.rating = function(rating)
	{
		if (rating > 3)
		{
			document.getElementsByClassName("player-controls__track-controls")[0].children[0].click();
		}
		else 
		{
			document.getElementsByClassName("player-controls__track-controls")[0].children[3].click();
		}
	};
}

setup();
init();
