var previousUrlDictionary = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	if (tab.url.includes("www.youtube.com"))
	{
		previousUrlDictionary[tab.id] = tab.url;
		console.log(previousUrlDictionary);
	}
});

//chrome.webNavigation.onBeforeNavigate.addListener(function(object)
//{
//	chrome.tabs.get(object.tabId, function(tab)
//	{
//		if (tab.url.includes("www.youtube.com"))
//		{
//			previousUrlDictionary[tab.id] = tab.url;
//			console.log(previousUrlDictionary);
//		}
//	});
//});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if (request.method && (request.method == "getURL") && sendResponse)
	{
		sendResponse(
		{
			if (previousUrlDictionary)
			{
				console.log(previousUrlDictionary);
				ID: previousUrlDictionary[sender.id]
			}
		});
	}
});
