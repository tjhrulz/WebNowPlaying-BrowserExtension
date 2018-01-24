function updateEvent()
{
	var newURL = "https://github.com/tjhrulz/WebNowPlaying/releases/latest";
	chrome.tabs.create(
		{"url": newURL}
	);
}
function helpEvent()
{
	var newURL = "https://github.com/tjhrulz/WebNowPlaying-BrowserExtension/wiki/Troubleshooting";
	chrome.tabs.create(
		{"url": newURL}
	);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if (request.method && request.method == "flagAsOutdated")
	{
		chrome.browserAction.setBadgeText(
			{"text": "!"}
		);
		// Red, Green, Blue, Alpha
		chrome.browserAction.setBadgeBackgroundColor(
			{"color": [255, 0, 0, 255]}
		);

		chrome.browserAction.setTitle(
			{"title": "Connected but plugin is outdated. Click to update"}
		);

		if (chrome.browserAction.onClicked.hasListeners())
		{
			chrome.browserAction.onClicked.removeListener(updateEvent);
			chrome.browserAction.onClicked.removeListener(helpEvent);
		}
		chrome.browserAction.onClicked.addListener(updateEvent);
	}
	else if (request.method && request.method == "flagAsNotConnected")
	{
		chrome.browserAction.setBadgeText(
			{"text": ''}
		);

		chrome.browserAction.setTitle(
			{"title": "Not connected to Rainmeter. Click to troubleshoot"}
		);

		if (chrome.browserAction.onClicked.hasListeners())
		{
			chrome.browserAction.onClicked.removeListener(updateEvent);
			chrome.browserAction.onClicked.removeListener(helpEvent);
		}
		chrome.browserAction.onClicked.addListener(helpEvent);
	}
	else if (request.method && request.method == "flagAsConnected")
	{
		chrome.browserAction.setBadgeText(
			{"text": ''}
		);

		chrome.browserAction.setTitle(
			{"title": "Connected and sending info"}
		);

		if (chrome.browserAction.onClicked.hasListeners())
		{
			chrome.browserAction.onClicked.removeListener(updateEvent);
			chrome.browserAction.onClicked.removeListener(helpEvent);
		}
	}
});
