// ===========================================================================
// Schlog+ / background.js
// Created by s. aka Soygoy
//
// https://soyjak.blog/index.php?members/soygoy.488/
// sss5sss555s5s5s5.github.com
// s5s5s5.com
//
// This code is lcensed under the MIT License, please credit me in your forks.
// ===========================================================================

var memorySlots = {}
var browserType = "firefox"
if (typeof browser === "undefined") {
	var browser = chrome;
	browserType = "chrome";
}

function isEmpty(obj) {
	return Object.keys(obj).length === 0;
}

function getCurrentSettings(result) { 
	if (isEmpty(result)) {
		browser.runtime.openOptionsPage();
	}
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "fetchData" && message.url && message.slot) {
    fetch(message.url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
		memorySlots[message.slot] = data
        sendResponse({ data: data });
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
        sendResponse({ error: 'Failed to fetch data' });
      });
    return true; // Indicate asynchronous response
  }
  if (message.type === "getVariable" && message.slot) {
    sendResponse({ myVariable: memorySlots[message.slot]});
  }
  
});

function onError(error) {
	console.log(`Error: ${error}`);
}

if (browserType == "firefox") {
	let getting = browser.storage.sync.get();
	getting.then(getCurrentSettings, onError);
}
else {
	browser.storage.sync.get(
		function(result) {
			getCurrentSettings(result)
		}
	)
}

console.log("Background test"); 
