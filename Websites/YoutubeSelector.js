//Decides which version of youtube the user is using.
/*global init setupNew setupOld setupTV*/

if (document.location.href.includes("/tv#/"))
{
	setupTV();
	init();
}
else if (document.getElementById("yt-masthead-content") === null)
{
	setupNew();
	init();
}
else
{
	setupOld();
	init();
}


//chrome.runtime.sendMessage(
//{
//	method: "getURL"
//}, function(response)
//{
//	console.log(response.ID);
//});
//
