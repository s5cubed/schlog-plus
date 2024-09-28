// ===========================================================================
// Schlog+ / popup.js
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

function onOpened() {
	console.log(`Options page opened`);
}

function onError(error) {
	console.log(`Error: ${error}`);
}

let opening = browser.runtime.openOptionsPage();
opening.then(onOpened, onError);
window.close();
