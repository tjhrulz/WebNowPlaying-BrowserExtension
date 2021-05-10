//Adds support for Tidal
/*global init createNewMusicInfo createNewMusicEventHandler convertTimeToString capitalize*/

var lastKnownVolume = 100;

function setup()
{
	var tidalInfoHandler = createNewMusicInfo();

	tidalInfoHandler.player = function()
	{
		return "Tidal";
	};

	tidalInfoHandler.readyCheck = function()
	{
		return document.getElementById("footerPlayer")  !== null;
		
		//Tidal removed their media component and baked something else in so this no longer works
		//if (document.getElementsByTagName('audio').length > 0)
		//{
		//	for (var i = 0; i < document.getElementsByTagName('audio').length; i++)
		//	{
		//		if (document.getElementsByTagName('audio')[i].duration > 0)
		//		{
		//			element = document.getElementsByTagName('audio')[i];
		//			break;
		//		}
		//	}
		//}
		//
		//return element !== null &&
		//	document.querySelector('[class^="mediaInformation"]').children.length > 0 &&
		//	document.querySelector('[class^="mediaInformation"]').children[0].innerText.length > 0;
	};

	tidalInfoHandler.state = function()
	{
		return document.getElementById("footerPlayer").children[1].children[0].children[2].children[0].children[0].getAttribute("data-test").includes("Pause") ? 1 : 2;
	};
	tidalInfoHandler.title = function()
	{
		return document.getElementById("footerPlayer").children[0].children[1].children[0].children[0].innerText;
	};
	tidalInfoHandler.artist = function()
	{
		return document.getElementById("footerPlayer").children[0].children[1].children[1].innerText;
	};
	tidalInfoHandler.album = function()
	{
		//Sadly while I can get to a page that will tell me the album for the current playing song it is added by JS so I can not take the usual approach
		//So this will sometimes tell you the playlist instead of the album
		//Use textContent because innerText will return an all caps due to CSS styling
		return document.getElementById("footerPlayer").children[0].children[1].children[2].children[1].children[0].textContent;
	};
	tidalInfoHandler.cover = function()
	{
		//Capture small src image
		var tempIMG = document.getElementById("footerPlayer").children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].src;
		//Remove size and replace it with max size before returning
		return tempIMG.substring(0, tempIMG.lastIndexOf("/")) + "/1280x1280.jpg";
	};
	tidalInfoHandler.durationString = function()
	{
		return document.getElementById("progressBar").parentElement.children[2].innerText;
	};
	tidalInfoHandler.positionString = function()
	{
		return document.getElementById("progressBar").parentElement.children[0].innerText;
	};
	tidalInfoHandler.volume = function()
	{
		//Volume is no longer always shown, so if it is visible cache that value
		if(document.querySelector('[class^="nativeRange"]').value !== null)
		{
			lastKnownVolume = document.querySelector('[class^="nativeRange"]').value;
		}
		return lastKnownVolume;
	};
	tidalInfoHandler.rating = function()
	{
		if (document.getElementById("footerPlayer").children[0].children[1].children[0].children[1].children[0].getAttribute("aria-checked") == "true")
		{
			return 5;
		}
		return 0;
	};
	tidalInfoHandler.repeat = function()
	{
		if (document.getElementById("footerPlayer").children[1].children[0].children[4].getAttribute("aria-checked") == "true")
		{
			if(document.getElementById("footerPlayer").children[1].children[0].children[4].children[0].getAttribute("data-test").includes("One"))
			{
				return 2;
			}
			return 1
		}
		return 0;
	};
	tidalInfoHandler.shuffle = function()
	{
		//Icon for shuffle button is goofy, they seem to have an oversite in their code and it only has a class when active
		if (document.getElementById("footerPlayer").children[1].children[0].children[0].getAttribute("aria-checked") == true)
		{
			return 1;
		}
		return 0;
	};


	var tidalEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	tidalEventHandler.readyCheck = function()
	{
		return document.getElementById("footerPlayer")  !== null;
	};

	tidalEventHandler.playpause = function()
	{
		document.getElementById("footerPlayer").children[1].children[0].children[2].children[0].click();
	};
	tidalEventHandler.next = function()
	{
		document.getElementById("footerPlayer").children[1].children[0].children[3].click();
	};
	tidalEventHandler.previous = function()
	{
		document.getElementById("footerPlayer").children[1].children[0].children[1].click();
	};
	//Sadly a likely unintended effect of Tidal using <input> tags is that a quirk of the way the events work cause them not to fire using my usual event hacking
	//I have reverse enineered how both work for the most part and can successfully change them programatically however due to the obfuscation techniques of react
	//I have no way that I know of to get the obfuscation string the react uses on each reload, I know I few people who know a way around this so I may reach out to them
	tidalEventHandler.progress = null;
	//tidalEventHandler.progress = function(progress)
	//{
	//var loc = document.querySelector('[class^="progressBarWrapper"]').children[0].children[2].getBoundingClientRect();
	//position = 0.5;
	//position *= loc.width;
	//var click = new MouseEvent("click", {
	//    bubbles: true,
	//    cancelable: false,
	//    view: window,
	//    detail: 1,
	//    screenX: screenX + loc.left + position,
	//    screenY: screenY + loc.top + loc.height / 2,
	//    clientX: loc.left + position,
	//    clientY: loc.top + loc.height / 2,
	//    ctrlKey: false,
	//    altKey: false,
	//    shiftKey: false,
	//    metaKey: false,
	//    button: 0,
	//    relatedTarget: null
	//});
	//document.querySelector('[class^="progressBarWrapper"]').children[0].children[2].__reactEventHandlers$9b6uaufa1l.onMouseEnter();
	//var mousemove = new MouseEvent("mousemove", {
	//    bubbles: true,
	//    cancelable: false,
	//    view: window,
	//    detail: 1,
	//    screenX: screenX + loc.left + position,
	//    screenY: screenY + loc.top + loc.height / 2,
	//    clientX: loc.left + position,
	//    clientY: loc.top + loc.height / 2,
	//    ctrlKey: false,
	//    altKey: false,
	//    shiftKey: false,
	//    metaKey: false,
	//    button: 0,
	//    relatedTarget: null
	//});
	//var mousemove = new MouseEvent("mousedown", {
	//    bubbles: true,
	//    cancelable: false,
	//    view: window,
	//    detail: 1,
	//    screenX: screenX + loc.left + position,
	//    screenY: screenY + loc.top + loc.height / 2,
	//    clientX: loc.left + position,
	//    clientY: loc.top + loc.height / 2,
	//    ctrlKey: false,
	//    altKey: false,
	//    shiftKey: false,
	//    metaKey: false,
	//    button: 0,
	//    relatedTarget: null
	//});
	//document.querySelector('[class^="progressBarWrapper"]').children[0].children[2].__reactEventHandlers$9b6uaufa1l.onMouseDown();
	////window.addEventListener("mouseup", this.handleMouseUp, {
	////    once: !0
	////})
	//document.querySelector('[class^="progressBarWrapper"]').children[0].children[2].__reactEventHandlers$9b6uaufa1l.onClick(new Event("click", {
	//    altKey: false,
	//    bubbles: true,
	//    button: 0,
	//    buttons: 0,
	//    cancelable: true,
	//    clientX: loc.left + position,
	//    clientY: loc.top + loc.height / 2,
	//    ctrlKey: false,
	//    currentTarget: document.querySelector('[class^="progressBarWrapper"]').children[0].children[2],
	//    defaultPrevented: false,
	//    detail: 1,
	//    dispatchConfig: null,
	//    eventPhase: 3,
	//    getModifierState: null,
	//    isDefaultPrevented: null,
	//    isPropagationStopped: null,
	//    isTrusted: true,
	//    metaKey: false,
	//    movementX: 0,
	//    movementY: 0,
	//    nativeEvent: click,
	//    pageX: loc.left + position,
	//    pageY: loc.top + loc.height / 2,
	//    relatedTarget: null,
	//    screenX: screenX + loc.left + position,
	//    screenY: screenY + loc.top + loc.height / 2,
	//    shiftKey: false,
	//    target: document.querySelector('[class^="progressBarWrapper"]').children[0].children[2],
	//    timeStamp: 13268296.534999998,
	//    type: "click",
	//}));
	//document.querySelector('[class^="progressBarWrapper"]').children[0].children[2].__reactEventHandlers$9b6uaufa1l.onMouseUp();
	//document.querySelector('[class^="progressBarWrapper"]').children[0].children[2].__reactEventHandlers$9b6uaufa1l.onMouseLeave();
	//};
	tidalEventHandler.volume = null;
	//tidalEventHandler.volume = function(volume)
	//{
	//	//Tidal uses the <input> tag that is a "range" type. These seem to be immune to my usual chicanery so I am trying to move to using new ways
	//	//While searching this I saw a suggestion to switch to firing customEvents and using them as a mouse
	//		//Which whoever suggested that was way off base as that was not the correct response since the person said the native events but anyways
	//	//However in doing so I realized that the way I was firing mouse events was not the most correct way
	//	//Also while doing this I figured I would fire the native events in case there was something blocking me and realized the issue is that changing
	//		//the value does not actually fire the onChange event
	//	//So I just reverse enginnered their code with that in mind.
	//	//However the issue is that trying to figure out the obfuscation string dynamically is gonna be difficult (Its whole purpose is to prevent that)
	//	document.querySelector('[class^="volumeSlider"]').children[1].__reactEventHandlers$9b6uaufa1l.onMouseDown()
	//	document.querySelector('[class^="volumeSlider"]').children[1].value = volume * 100;
	//	var t = {target: document.querySelector('[class^="volumeSlider"]').children[1]};
	//	document.querySelector('[class^="volumeSlider"]').children[1].__reactEventHandlers$9b6uaufa1l.onChange(t)
	//	document.querySelector('[class^="volumeSlider"]').children[1].__reactEventHandlers$9b6uaufa1l.onMouseUp();
		//
	//	//In case I ever need it here is the better mouse event code
	//	//var loc = document.querySelector('[class^="volumeSlider"]').children[1].getBoundingClientRect();
	//	//volume = 0.5
	//	//volume *= loc.width;
	//	//var mousedown = new MouseEvent("mousedown", {
	//	//	bubbles: true,
	//	//	cancelable: false,
	//	//	view: window,
	//	//	detail: 1,
	//	//	screenX: screenX + loc.left + volume,
	//	//	screenY: screenY + loc.top + loc.height / 2,
	//	//	clientX: loc.left + volume,
	//	//	clientY: loc.top + loc.height / 2,
	//	//	ctrlKey: false,
	//	//	altKey: false,
	//	//	shiftKey: false,
	//	//	metaKey: false,
	//	//	button: 0,
	//	//	relatedTarget: null
	//	//});
	//	//var mousemove = new MouseEvent("mousemove", {
	//	//	bubbles: true,
	//	//	cancelable: false,
	//	//	view: window,
	//	//	detail: 1,
	//	//	screenX: screenX + loc.left + volume,
	//	//	screenY: screenY + loc.top + loc.height / 2,
	//	//	clientX: loc.left + volume,
	//	//	clientY: loc.top + loc.height / 2,
	//	//	ctrlKey: false,
	//	//	altKey: false,
	//	//	shiftKey: false,
	//	//	metaKey: false,
	//	//	button: 0,
	//	//	relatedTarget: null
	//	//});
	//	//var mouseup = new MouseEvent("mouseup", {
	//	//	bubbles: true,
	//	//	cancelable: false,
	//	//	view: window,
	//	//	detail: 1,
	//	//	screenX: screenX + loc.left + volume,
	//	//	screenY: screenY + loc.top + loc.height / 2,
	//	//	clientX: loc.left + volume,
	//	//	clientY: loc.top + loc.height / 2,
	//	//	ctrlKey: false,
	//	//	altKey: false,
	//	//	shiftKey: false,
	//	//	metaKey: false,
	//	//	button: 0,
	//	//	relatedTarget: null
	//	//});
	//	//document.querySelector('[class^="volumeSlider"]').children[1].dispatchEvent(mousedown);
	//	//document.querySelector('[class^="volumeSlider"]').children[1].dispatchEvent(mousemove);
	//	//document.querySelector('[class^="volumeSlider"]').children[1].dispatchEvent(mouseup);
	//
	//};
	tidalEventHandler.repeat = function()
	{
		document.getElementById("footerPlayer").children[1].children[0].children[4].click();
	};
	tidalEventHandler.shuffle = function()
	{
		document.getElementById("footerPlayer").children[1].children[0].children[0].click();
	};
	tidalEventHandler.toggleThumbsUp = function()
	{
		document.getElementById("footerPlayer").children[0].children[1].children[0].children[1].children[0].click();
	};
	tidalEventHandler.toggleThumbsDown = null;
	tidalEventHandler.rating = function(rating)
	{
		//Check if thumbs has two paths, if it does not then it is active
		if (rating > 3)
		{
			//If thumbs up is not active
			if (document.getElementById("footerPlayer").children[0].children[1].children[0].children[1].children[0].getAttribute("aria-checked") != "true")
			{
				document.getElementById("footerPlayer").children[0].children[1].children[0].children[1].children[0].click();
			}
		}
		else
		{
			//If thumbs up is not active
			if (document.getElementById("footerPlayer").children[0].children[1].children[0].children[1].children[0].getAttribute("aria-checked") == "true")
			{
				document.getElementById("footerPlayer").children[0].children[1].children[0].children[1].children[0].click();
			}
		}
	};
}


setup();
init();
