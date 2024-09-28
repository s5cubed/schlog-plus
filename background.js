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
