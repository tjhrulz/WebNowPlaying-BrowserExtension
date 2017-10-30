chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if (request.method && (request.method == "flagAsOutdated"))
	{
		chrome.browserAction.setBadgeText(
		{
			text: "!"
		});
		// Red, Green, Blue, Alpha
		chrome.browserAction.setBadgeBackgroundColor(
		{
			color: [255, 0, 0, 255]
		});

		chrome.browserAction.setTitle(
		{
			title: "WebNowPlaying Rainmeter plugin out of date"
		});
		if (!chrome.browserAction.onClicked.hasListeners())
		{
			chrome.browserAction.onClicked.addListener(function(activeTab)
			{
				var newURL = "https://github.com/tjhrulz/WebNowPlaying/releases/latest";
				chrome.tabs.create(
				{
					url: newURL
				});
			});
		}
	}
	else if (request.method && (request.method == "unflagAsOutdated"))
	{
		chrome.browserAction.setBadgeText(
		{
			text: ''
		});

		chrome.browserAction.setTitle(
		{
			title: "WebNowPlaying is up to date and connected"
		});
	}
});
