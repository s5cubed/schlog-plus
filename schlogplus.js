// ===========================================================================
// Schlog+ / schlogplus.js
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

// Handles errors

function onError(error) {
	console.log(`Error: ${error}`);
}

// Extension's main decision making block

function getSettings(settings) {
	// Enable custom stylesheets
	if (settings.custom_stylesheet.value != "") {
		var style = document.createElement("style")
		style.textContent = settings.custom_stylesheet.value
		document.head.appendChild(style)
	}
	// If true, the reaction tooltip will become a grid.
	if (settings.toggle_react_grid.value == true) {
		var style = document.createElement("style")
		style.textContent = ".reactTooltip {display: grid; grid-template-columns: repeat(" + settings.react_grid_rows.value + ", 40px [col-start])}"
		document.head.appendChild(style)
	}
	// If true, image squishing will be fixed.
	if (settings.image_squish_fix.value == true) {
		var style = document.createElement("style")
		style.textContent = ".bbImage {width: auto;}"
		document.head.appendChild(style)
	}
	// If true, widescreen_videos will no longer become portrait.
	if (settings.widescreen_video.value == true) {
		var style = document.createElement("style")
		for (var i = 0; i < document.getElementsByTagName("video").length; i++) {
		document.getElementsByTagName("video")[i].style = "max-width:600px;max-height:300px;"
		}
	}
	
	if (settings.schlog_or_shlog.value != "Off") { 
		var effectElements = [document.getElementsByClassName("p-title-value")[0]]
		for(var i=0; i < document.getElementsByTagName("div").length; i++ ) { 
			if(document.getElementsByTagName("div")[i].hasAttribute("itemprop")) {
				if (document.getElementsByTagName("div")[i].getAttribute("itemprop") == "text") {
					effectElements.push((document.getElementsByTagName("div")[i]))
				}
			}
		}
		
		for(var i=0; i < document.getElementsByClassName("siropuShoutboxMessage").length; i++ ) { 
			effectElements.push(document.getElementsByClassName("siropuShoutboxMessage")[i])
		}

		for (var i= 0; i < effectElements.length; i++) {
			effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0], settings.schlog_or_shlog.value.split(" ")[2]); 
			effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0].toLowerCase(), settings.schlog_or_shlog.value.split(" ")[2].toLowerCase()); 
			effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0].toUpperCase(), settings.schlog_or_shlog.value.split(" ")[2].toUpperCase()); 
		}
		
	}
  
	// If you are currently on a thread page...
	if (window.location.href.includes("threads")) {
		var messageInner = document.getElementsByClassName("message-inner")
		for (var i= 0; i < messageInner.length; i++) {
			// If toggle_ignore_guests is true and there are guests on the page, their messages will be hidden. 
			if (settings.toggle_ignore_guests.value && messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.includes("Guest")) {
				messageInner[i].style = "display:none;"
			}
			// Custom user badges. If this is enabled, code will look through your usertitle for a string like "[#ccc] Text" and give you a custom user badge.
			
			if (settings.toggle_custom_badges.value && messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.includes("[#")) {
				// This statement checks to make sure that people don't try to break the code by something of "[#[#[][[][#" etc.
				if ( (messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.match(/]/g) || []).length == 1 && (messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.match(/#/g) || []).length == 1) {
					var bannerText = messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.split("]")[1]
					var bannerColour = "#" + messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.split("[#")[1].split("]")[0]
					messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent = messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.split("[#")[0]
					var bannerDiv = document.createElement("div")
					var bannerStrong = document.createElement("strong")
					bannerStrong.textContent = bannerText
					bannerDiv.className = "userBanner"
					bannerDiv.style = "display:block;color:white;background-color:" + bannerColour + ";"
					bannerDiv.appendChild(bannerStrong)
					messageInner[i].getElementsByClassName("message-userDetails")[0].appendChild(bannerDiv);
				}
			}
			// If a user's username is inside of the ignore list, their message gets hidden.
			if (settings.ignore_list.value.includes(messageInner[i].getElementsByClassName("username")[0].textContent)) {
				messageInner[i].style = "display:none;"
			}
		}
	}
  
  // Enables profile music, checks on member pages only, makes sure you have an about section
	if (settings.enable_profile_music.value == true && window.location.href.includes("members") && document.getElementById("about") ){
		var waitdiv = document.createElement("div")
		waitdiv.textContent = "Loading music player..."
		waitdiv.style = "float:right;"
		document.getElementsByClassName("memberHeader-buttons")[0].appendChild(waitdiv);
		// Extension clicks on your about section to force the site to load your about content and get any code strings you might have in there
		document.getElementById("about").click(); 
		// After 300 ms, it goes back to your main profile page and creates the music player 3 seconds later. The wait time is to let the about elements load
		setTimeout(document.getElementsByClassName("tabs-tab")[0].click(), 300)
		setTimeout(startMusicPlayer, 3000);
		function startMusicPlayer() {
			var aboutText = document.getElementsByClassName("tabPanes js-memberTabPanes")[0].children[3].getElementsByClassName("bbWrapper")[0].childNodes
			// Injects into your buttons section on your profile
			var playerlocation = document.getElementsByClassName("memberHeader-buttons")[0]
			var playerNode = document.createElement("audio")
			playerNode.volume = .5;
			playerNode.controls = !settings.profile_music_hide_controls.value;
			playerNode.style = "height: 30px;float: right;"
			playerNode.autoplay = settings.profile_music_autoplay.value;
			playerNode.loop = settings.profile_music_loop.value;
			var playerSource = document.createElement("source");
			//console.log("Page is applicable for music");
			waitdiv.remove();
			for (var i = 0; i < aboutText.length; i++) {
				if (aboutText[i].constructor == Text && aboutText[i].data.includes("[MUSIC]") && aboutText[i].data.includes("[/MUSIC]")) {
					var musicUrl = aboutText[i].data.replace("[MUSIC]","").replace("\n","").replace("[/MUSIC]","")
					if (musicUrl.startsWith("http")) {
						playerSource.src = musicUrl;
						playerNode.appendChild(playerSource);
						playerlocation.appendChild(playerNode);
					}
				}
			}
		}
	}
}

if (browserType == "firefox") {
	let getting = browser.storage.sync.get();
	getting.then(getSettings, onError);
}
else {
	browser.storage.sync.get(
		function(result) {
			getSettings(result)
		}
	)
}
