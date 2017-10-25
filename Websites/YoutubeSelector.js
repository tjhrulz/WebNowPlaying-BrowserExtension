//Decides which version of youtube the user is using.
if (document.getElementById("yt-masthead-content") === null)
{
	console.log("Hello");
	setupNew();
	init();
}
else
{
	setupOld();
	init();
}


chrome.runtime.sendMessage(
{
	method: "getURL"
}, function(response)
{
	console.log(response.ID);
});
