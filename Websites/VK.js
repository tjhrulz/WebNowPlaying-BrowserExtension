var _progress = 0;
var _duration = 0;
var _cover = "";
var _volume = 0;
var _artist = "";
var _title = "";
var _album = "";
var _isPlaying = false;

function setup()
{	
	var vkInfoHandler = createNewMusicInfo();
	vkInfoHandler.player = function()
	{
		return "Vkontakte";
	};

	vkInfoHandler.readyCheck = function()
	{
		var checkVKAudio = document.getElementsByClassName("top_audio_player")[0].className.includes("top_audio_player_enabled");
		return checkVKAudio;
	};

	vkInfoHandler.state = function()
	{
		return true;
	};

	vkInfoHandler.title = function()
	{
		_title = window.eval(`getAudioPlayer().getCurrentAudio()[3]`)
		return _title;
	};

	vkInfoHandler.artist = function()
	{
		_artist = window.eval(`getAudioPlayer().getCurrentAudio()[4]`)
		return _artist;
	};

	vkInfoHandler.album = function()
	{
		 _album = window.eval(`getAudioPlayer().getCurrentAudio()[11]`);
		 return _album;
	};

	vkInfoHandler.cover = function()
	{
		_cover = window.eval(`getAudioPlayer().getCurrentAudio()[14]`)
		return _cover;
	};


	vkInfoHandler.duration = function()
	{	
		_duration = parseInt(window.eval(`getAudioPlayer().getCurrentAudio()[5]`))
		return _duration;
	};

	vkInfoHandler.position = function()
	{ 
		_progress = parseFloat(window.eval(`getAudioPlayer().getCurrentProgress()`))*_duration;
		return _progress;
	};

	vkInfoHandler.volume = function()
	{
		_volume = window.eval(`getAudioPlayer().getVolume()`)
        return _volume;
	};

	vkInfoHandler.rating = null;
	vkInfoHandler.repeat = null;
	vkInfoHandler.shuffle = null;

	var vkEventHandler = createNewMusicEventHandler();

	vkEventHandler.readyCheck = function()
	{
		var checkVKAudio = document.getElementsByClassName("top_audio_player")[0].className.includes("top_audio_player_enabled");
		return checkVKAudio;
	};

	vkEventHandler.playpause = function()
	{
		_isPlaying = window.eval(`getAudioPlayer().isPlaying()`)
		if(!_isPlaying)
		{
			window.eval(`getAudioPlayer().play()`)
		}else
		{
			window.eval(`getAudioPlayer().pause()`)
		}
	};

	vkEventHandler.next = function()
	{
		window.eval(`getAudioPlayer().playNext()`)
	};
	vkEventHandler.previous = function()
	{
		window.eval(`getAudioPlayer().playPrev()`)
	};
	
	vkEventHandler.repeat = null;
	vkEventHandler.shuffle = null;

	vkEventHandler.progressSeconds = null;
	vkEventHandler.volume = null;
	
	vkEventHandler.toggleThumbsUp = null;
	vkEventHandler.toggleThumbsDown = null;
	vkEventHandler.rating = null;
}

setup();
init();