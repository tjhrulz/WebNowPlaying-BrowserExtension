var doGeneric = false;
var useGenericList = false;
var whitelistOrBlacklist = 'whitelist';
var genericList = ["streamable.com", "www.adultswim.com"];

// Saves options to chrome.storage
function save_options()
{
	doGeneric = document.getElementById('generic').checked;
	useGenericList = document.getElementById('useGenericList').checked;
	whitelistOrBlacklist = document.getElementById('listType').value;
	genericList = document.getElementById('genericList').value.split("\n");
	chrome.storage.sync.set(
	{
		doGeneric: doGeneric,
		useGenericList: useGenericList,
		whitelistOrBlacklist: whitelistOrBlacklist,
		genericList: genericList
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options()
{
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get(
	{
		doGeneric: false,
		useGenericList: false,
		whitelistOrBlacklist: 'whitelist',
		genericList: ["streamable.com", "www.adultswim.com"]
	}, function(items)
	{
		document.getElementById('generic').checked = items.doGeneric;
		document.getElementById('useGenericList').checked = items.useGenericList;
		document.getElementById('listType').value = items.whitelistOrBlacklist;
		document.getElementById('genericList').value = items.genericList.join("\n");


		doGeneric = document.getElementById('generic').checked;
		useGenericList = document.getElementById('useGenericList').checked;
		whitelistOrBlacklist = document.getElementById('listType').value;
		genericList = document.getElementById('genericList').value.split("\n");
	});
}

function checkSaveOptions()
{
	var isChanged = doGeneric != document.getElementById('generic').checked;
	isChanged = isChanged || useGenericList != document.getElementById('useGenericList').checked;
	isChanged = isChanged || whitelistOrBlacklist != document.getElementById('listType').value;
	isChanged = isChanged || genericList.toString() != document.getElementById('genericList').value.split("\n").toString();
	if (isChanged)
	{
		save_options();
	}
}

document.addEventListener('DOMContentLoaded', restore_options);
window.onbeforeunload = function(e)
{
	save_options();
};

//Check if changed before saving so rate limit should not be hit
setInterval(checkSaveOptions, 500);
