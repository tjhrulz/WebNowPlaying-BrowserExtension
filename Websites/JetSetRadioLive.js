//Adds support for Jet Set Radio Live
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

let songInfoEl;
let player;
let cover;

function _wallpaperCanvas(bgUrl, cb)
{
	const img = new Image();
	img.setAttribute('crossOrigin', 'anonymous');
	img.onload = function() {
		const canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;

		const ctx = canvas.getContext('2d');
		ctx.drawImage(this, 0, 0);
		cb(canvas);
	};
	img.src = bgUrl;
}

function generateCover(bg)
{
	if (typeof bg === 'string') {
		_wallpaperCanvas(bg, function(wall){
			const img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');
			img.onload = function() {
				const canvas = document.createElement('canvas');
				canvas.width = this.width;
				canvas.height = this.height;
		
				const ctx = canvas.getContext('2d');
				ctx.drawImage(wall, (canvas.width - wall.width) * 0.5, (canvas.height - wall.height) * 0.5);
				ctx.drawImage(this, 0, 0);
				cover = canvas.toDataURL('image/png');
			};
			img.src = document.querySelector('#graffitiSoulFrame > img').src;
		});
	} else {
		const img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		img.onload = function() {
			const canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
	
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = document.querySelector('#chameleonWallpaper').style.backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(this, 0, 0);
			cover = canvas.toDataURL('image/png');
		};
		img.src = document.querySelector('#graffitiSoulFrame > img').src;
	}
}

// https://stackoverflow.com/a/29939805
function basename(str, sep, ext)
{
	str = str.substr(str.lastIndexOf(sep) + 1);
	if (ext) str = str.substr(0,str.lastIndexOf('.'));
	return str;
}

// Get track info from file name instead of #programInformationText so we can show info while it loads and when paused
function getTrackInfo()
{
	return decodeURIComponent(basename(document.querySelector('#audioPlayer').currentSrc, '/', true)).split(/ - (.+)/);
}

function setup()
{
	var jsrLiveInfoHandler = createNewMusicInfo();

	jsrLiveInfoHandler.player = function()
	{
		return "Jet Set Radio Live";
	};

	jsrLiveInfoHandler.readyCheck = function()
	{
		player = document.querySelector('#audioPlayer');
		songInfoEl = document.querySelector('#programInformationText');
		return songInfoEl && songInfoEl.innerHTML.length > 0;
	};

	jsrLiveInfoHandler.state = function()
	{
		return player.paused ? 2 : 1;
	};
	jsrLiveInfoHandler.title = function()
	{
		const text = songInfoEl.textContent;
		if (text == 'Bump') return 'Bump';

		return getTrackInfo()[1];
	};
	jsrLiveInfoHandler.artist = function()
	{
		const text = songInfoEl.textContent;
		if (text == 'Bump') return 'DJ Professor K';

		return getTrackInfo()[0];
	};
	jsrLiveInfoHandler.cover = function()
	{
		return cover;
	};
	jsrLiveInfoHandler.duration = function()
	{
		return player.duration;
	};
	jsrLiveInfoHandler.position = function()
	{
		return player.currentTime;
	};
	jsrLiveInfoHandler.volume = function()
	{
		return player.volume;
	};
	jsrLiveInfoHandler.shuffle = function()
	{
		const shuffleBtn = document.querySelector('#shuffleButton');
		if (shuffleBtn) {
			return document.querySelector('#shuffleButton').style.opacity == '1' ? 1 : 0;
		}
		return 0;
	};


	var jsrLiveEventHandler = createNewMusicEventHandler();

	jsrLiveEventHandler.readyCheck = jsrLiveInfoHandler.readyCheck;

	jsrLiveEventHandler.playpause = function()
	{
		if (player.paused) {
			document.querySelector('#playTrackButton').dispatchEvent(new Event('mousedown'));
		} else {
			document.querySelector('#pauseTrackButton').dispatchEvent(new Event('mousedown'));
		}
	};
	jsrLiveEventHandler.next = function()
	{
		document.querySelector('#nextTrackButton').dispatchEvent(new Event('mousedown'));
	};
	jsrLiveEventHandler.shuffle = function()
	{
		const shuffleBtn = document.querySelector('#shuffleButton');
		if (shuffleBtn) {
			shuffleBtn.dispatchEvent(new Event('mousedown'));
		}
	};
	jsrLiveEventHandler.progressSeconds = function(position)
	{
		player.currentTime = position;
	};
	jsrLiveEventHandler.volume = function(volume)
	{
		if (player.muted && volume > 0) {
			player.muted = false;
		} else if (volume == 0) {
			player.muted = true;
		}
		player.volume = volume;
	};
}

// Only generate cover when station image changes
document.querySelector('#graffitiSoul').addEventListener('load', generateCover);
// ...and again when the new background is eventually loaded
document.querySelector('#wallpaperImageTop').addEventListener('load', function(evt){
	generateCover(evt.target.src);
});

setup();
init();
