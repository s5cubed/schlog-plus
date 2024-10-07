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

var tagSettings = {
"rainbow":"<span class='rainbow'>INSERT_TEXT_HERE</span>",
"rainbowtext":"<span class='rainbow'>INSERT_TEXT_HERE</span>",
"glow":"<span style='text-shadow:0px 0px 40px #00fe20, 0px 0px 2px #00fe20;'>INSERT_TEXT_HERE</span>",
"glowtext":"<span style='text-shadow:0px 0px 40px #00fe20, 0px 0px 2px #00fe20;'>INSERT_TEXT_HERE</span>",
"sneed":"<span style='text-shadow:0px 0px 40px #fffb00, 0px 0px 2px #fffb00;'>INSERT_TEXT_HERE</span>",
"sneedtext":"<span style='text-shadow:0px 0px 40px #fffb00, 0px 0px 2px #fffb00;'>INSERT_TEXT_HERE</span>",
"spin":"<span class='rotate'>INSERT_TEXT_HERE</span>"
}

var profile_music_pause_offtab = true;
var browserType = "firefox"
if (typeof browser === "undefined") {
	var browser = chrome;
	browserType = "chrome";
}

function getCSS(path, callfunc) {
	fetch(path).then(
		(res) => {
			if (!res.ok) {
				throw new Error(`HTTP error! Status: ${res.status}`);
			}
			return res.text();
		}
		
	).then(
		(data) => callfunc(data)
	).catch(
		(error) =>console.error("Unable to fetch data:", error)
	);
}

function getHTMLPage(input, callfunc) {
fetch(input)
  .then(response => {
    // When the page is loaded convert it to text
    return response.text()
  })
  .then(html => {
    // Initialize the DOM parser
    const parser = new DOMParser()

    // Parse the text
    const doc = parser.parseFromString(html, "text/html")
	callfunc(doc)
  })
  .catch(error => {
     console.error('Failed to fetch page: ', error)
  })
}

function isEmpty(obj) {
	return Object.keys(obj).length === 0;
}

// Handles errors

function onError(error) {
	console.log(`Error: ${error}`);
}

// This is for custom text animations, etc.
function autoStyle() {
var style = `
#schlogPlusShoutbox {
	width: auto;
	position: fixed;
	scale: 0.9;
	display: flex;
	z-index: 100;
}
.rainbow {
	animation: colorRotate 6s linear 0s infinite;	
}

.rotate {
	animation: rotation 1s infinite linear;
	display: inline-block;
}

@keyframes rotation { 
	from {    
		transform: rotateX(0deg); 
		
	}  
	to {  
		transform: rotateX(359deg);
	}
}

@keyframes colorRotate {
  from {
    color: #6666ff;
  }
  10% {
    color: #0099ff;
  }
  50% {
    color: #00ff00;
  }
  75% {
    color: #ff3399;
  }
  100% {
    color: #6666ff;
  }
}
`
var styleNode = document.createElement("style")
styleNode.textContent = style
document.head.appendChild(styleNode)
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

// Lazy. Update when new settings are added, get rid of the old one.
function newstufferroravoidance(settings) {
	var defaultvalues = {
		"show_schlogplus_users":"true",
		"schlog_plus_news":"true",
		"toggle_custom_backgrounds":"true",
		"shoutbox_position":"Bottom Right",
		"toggle_shoutbox_anywhere":"false"
	}
	for (i in defaultvalues) {
		if (settings[i] == undefined) {
			settings[i] = {"value":defaultvalues[i]}
		}
	}
}

// Extension's main decision making block
function getSettings(settings) {
	newstufferroravoidance(settings)
	autoStyle()
	
	if (settings.theme != undefined) {
		if (settings.theme.value != "None") {
			var style = document.createElement("style")
			var url = browser.runtime.getURL('css/' + settings.theme.value.toLowerCase() + '-main.css');
			getCSS(url,function(css) {
				style.textContent = css
				document.head.appendChild(style)
			})
		}
	}
// Planned but not fully implemented.	
//	if (settings.schlog_plus_news.value) {
//			var newsDiv = document.createElement("div")
//			newsText = "Schlog+ News: This is a test!"
//			newsDiv.innerHTML = "<img src='https://raw.githubusercontent.com/sss5sss555s5s5s5/schlog-plus/refs/heads/main/icons/icon-256.png' width=20px>" + newsText
//			newsDiv.style = "text-align: center;"
//			document.getElementById("top").insertBefore(newsDiv,document.getElementsByClassName("p-body")[0])
//	}
	// Enable custom stylesheets
	if (settings.custom_stylesheet.value != "") {
		var style = document.createElement("style")
		style.textContent = settings.custom_stylesheet.value
		document.head.appendChild(style)
	}
	
	profile_music_pause_offtab = settings.profile_music_pause_offtab.value
	// If true, the reaction tooltip will become a grid.
	if (settings.toggle_react_grid.value == true) {
		var style = document.createElement("style")
		style.textContent = ".reactTooltip {display: grid; grid-template-columns: repeat(" + settings.react_grid_rows.value + ", 40px [col-start]); max-width: 100%; flex-wrap: wrap; padding: 0; justify-content: center;}"
		document.head.appendChild(style)
	}
	// If true, image squishing will be fixed.
	if (settings.image_squish_fix.value == true) {
		var style = document.createElement("style")
		style.textContent = ".bbImage, .message-signature img {width: auto; max-width: 300px; max-height: 300px; display: inline;}"
		document.head.appendChild(style)
	}
	// If true, widescreen_videos will no longer become portrait.
	if (settings.widescreen_video.value == true) {
		var style = document.createElement("style")
		for (var i = 0; i < document.getElementsByTagName("video").length; i++) {
		document.getElementsByTagName("video")[i].style = "max-width:600px;max-height:300px; width: auto; height: auto;"
		}
	}
	
	function autoGreentext() {
		if (settings.toggle_auto_greentext.value == true) {
			if (document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible").length > 0) {
				var messageBox = document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible")[0]
				document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible")[0].addEventListener("keypress",function(e) {
					//var messageBox = document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible")[0]
					for (var i = 0; i < messageBox.childNodes.length; i++) {
							if (i > 0 && (messageBox.childNodes[i - 1].textContent.startsWith(">")  || messageBox.childNodes[i - 1].textContent.startsWith("^") || messageBox.childNodes[i - 1].textContent.startsWith("<")) && 
								!(messageBox.childNodes[i].textContent.startsWith(">") || messageBox.childNodes[i].textContent.startsWith(">") || messageBox.childNodes[i].textContent.startsWith("^") )
							) {
								messageBox.childNodes[i].style = "";
							}
							if (messageBox.childNodes[i].tagName == "P" && messageBox.childNodes[i].style.color == "") {
								var checkval = messageBox.childNodes[i].textContent[0]
								//console.log(checkval)
								if (checkval == "") {
									//console.log("Empty text for some reason, 1: ", messageBox.childNodes[i].textContent[1], " 2: ", messageBox.childNodes[i].textContent[2])
									checkval = messageBox.childNodes[i].textContent[1]
								}
								if (checkval == ">")
								{
									messageBox.childNodes[i].style = "color: #789922;"
									//console.log("Valid configuration met, your text colour has changed.")
								}
								else if (checkval == "<") {
									messageBox.childNodes[i].style = "color: #f6750b"
									//console.log("Valid configuration met, your text colour has changed.")
								}
								else if (checkval == "^") {
									messageBox.childNodes[i].style = "color: #6577E6"
									//console.log("Valid configuration met, your text colour has changed.")
								}
							}
					}
				})
			}
			else {
				console.log("Greentext Not working, ", document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible"))
			}
		}
	}
	// Timeout to allow script to find messagebox
	setTimeout(autoGreentext, 500)
	
	updateFunction(settings)
	// When you click on new post or show new posts this will trigger.
	document.body.addEventListener("mousedown", event=> {
		setTimeout(updateFunction, 1000, settings);
	})
	function profileBanners() {
		if (settings.toggle_custom_badges.value && window.location.href.includes("members")) {
			var memberHeader = document.getElementsByClassName("memberHeader-content memberHeader-content--info")
			var userTitle = document.getElementsByClassName("userTitle")
			if (memberHeader.length > 0 && userTitle.length > 0) {
				memberHeader = memberHeader[0]
				if (memberHeader.getElementsByClassName("memberHeader-banners").length <= 0) {
					var bannerdiv = document.createElement("div")
					bannerdiv.className = "memberHeader-banners"
					memberHeader.insertBefore(bannerdiv,memberHeader.getElementsByClassName("memberHeader-blurbContainer")[0])
					var userName = memberHeader.getElementsByClassName("username ")[0]
					var bracketregex = /\[#(?:[A-Fa-f0-9]{3}){1,2}\b\]/gi
					var parenthesisRegex = /\(#(?:[A-Fa-f0-9]{3}){1,2}\b\)/gi
					var matches = userTitle[0].textContent.match(bracketregex)
					var schlogPlusUserImg = document.createElement("img")
					var schlogPlusUserImgAdded = false
					schlogPlusUserImg.src = "https://raw.githubusercontent.com/sss5sss555s5s5s5/schlog-plus/refs/heads/main/icons/icon-256.png"
					schlogPlusUserImg.style = "width: 24px; margin-left:4px"
					if (userTitle[0].textContent.match(parenthesisRegex)) {
						userName.style = "color:" + userTitle[0].textContent.match(parenthesisRegex)[0].replace("(","").replace(")","") + ";"
						userTitle[0].textContent = userTitle[0].textContent.replace(userTitle[0].textContent.match(parenthesisRegex)[0],"")
						if(!schlogPlusUserImgAdded && settings.show_schlogplus_users.value)
						{
							userName.appendChild(schlogPlusUserImg)
							schlogPlusUserImgAdded = true	
						}
					}
					var badgeTexts = userTitle[0].textContent.split(bracketregex)
					userTitle[0].textContent = badgeTexts[0]
					if (matches != null) {
						for (var t = 0; t < matches.length; t++) {
							var bannerDiv = document.createElement("div")
							var bannerStrong = document.createElement("strong")
							var bannerColour = matches[t].replace("[","").replace("]","")
							bannerStrong.textContent = badgeTexts[t + 1]
							bannerDiv.className = "userBanner"
							bannerDiv.style = "display:inline-block;text-shadow: 1px 1px black;color:white;border-color:black;margin-right:5px;background-color:" + bannerColour + ";"
							bannerDiv.appendChild(bannerStrong)
							bannerdiv.appendChild(bannerDiv);
						}
						if(!schlogPlusUserImgAdded && settings.show_schlogplus_users.value)
						{
							userName.appendChild(schlogPlusUserImg)
							schlogPlusUserImgAdded = true	
						}
					}
				}
			}
		}
	}
	setTimeout(profileBanners, 5)
	
	// Profile Data Requests. Must be a member page and not an about page
	if (window.location.href.includes("members") && !window.location.href.includes("/about")) {
		
		var waitdiv = document.createElement("div")
		if (settings.enable_profile_music.value) {
			console.log("Attempting to load music player")
			waitdiv.textContent = "Loading music player..."
			waitdiv.style = "float:right;"
			document.getElementsByClassName("memberHeader-buttons")[0].appendChild(waitdiv);
		}
		var proflocation = window.location.href + "about"
		if (window.location.href.split("/")[5] != "") {proflocation = window.location.href.replace(window.location.href.split("/")[5],"about")}
		getHTMLPage(proflocation,function(doc) {
				console.log("Profile data (music, background, etc) function running")
				var aboutText = doc.getElementsByClassName("bbWrapper")[0].childNodes
				var playerNode = document.createElement("audio")
				var playerSource = document.createElement("source");
				var playerlocation = document.getElementsByClassName("memberHeader-buttons")[0]
				var musicUrl = ""
				var bgUrl = ""
				
				var bg = document.createElement("style")
				var bgMore = ".p-breadcrumbs {text-shadow: 4px 4px black;}"
				
				if (settings.enable_profile_music.value) {
					playerNode.id = "profileMusicPlayer"
					playerNode.volume = settings.profile_music_volume.value;
					playerNode.controls = !settings.profile_music_hide_controls.value;
					playerNode.style = "height: 30px;float: right;";
					playerNode.autoplay = settings.profile_music_autoplay.value;
					playerNode.loop = settings.profile_music_loop.value;
					waitdiv.remove();
					
				}
				for (var i = 0; i < aboutText.length; i++) {
					if (aboutText[i].tagName == "A") {
						if (aboutText[i].textContent.toLowerCase() == "[music]" && settings.enable_profile_music.value) {
							musicUrl = aboutText[i].href
						}
						if (aboutText[i].textContent.toLowerCase() == "[background]" && settings.toggle_custom_backgrounds.value) {
							bgUrl = aboutText[i].href
						}
					}
					else if (aboutText[i].constructor == Text && aboutText[i].data.toLowerCase().includes("[music]") && aboutText[i].data.toLowerCase().includes("[/music]")) {
						musicUrl = aboutText[i].data.replace("[MUSIC]","").replace("\n","").replace("[/MUSIC]","").replace("[music]","").replace("[/music]","")
					}
					else if (aboutText[i].constructor == Text && aboutText[i].data.toLowerCase().includes("[bg]") && aboutText[i].data.toLowerCase().includes("[/bg]")) {
						bgUrl = aboutText[i].data.replace("[BG]","").replace("\n","").replace("[/BG]","").replace("[bg]","").replace("[/bg]","")
					}
				}
				if (musicUrl.startsWith("http") && settings.enable_profile_music.value) {
					playerSource.src = musicUrl;
					playerNode.appendChild(playerSource);
					playerNode.autoplay = settings.profile_music_autoplay.value; // Double check
					playerlocation.appendChild(playerNode);
				}
				if (bgUrl.startsWith("http") && settings.toggle_custom_backgrounds.value) {
					bg.textContent = ".p-body {background: url('" + bgUrl + "'); background-size: 100%; background-attachment: fixed;} " + bgMore
					document.head.appendChild(bg)	
				}
			}
		)
	}
	
	// Page takes a lil while to load so if we gi ve it a delay it will eventually get in.
	setTimeout(profileButtons, 300);
	function profileButtons() { 
		var features = ["Music","Background"]
		if (window.location.href.includes("account-details")) {
			var schlogPlusLabel = document.createElement("label")
			var schlogPlusDiv = document.createElement("div")
			schlogPlusDiv.style = "margin-bottom: 20px;"
			schlogPlusLabel.textContent = "Schlog+ Features: "
			var buttonBar = document.getElementsByClassName("fr-box bbWrapper fr-ltr fr-basic fr-top")[0]
			var aboutMe = document.getElementsByClassName("fr-element fr-view fr-element-scroll-visible")[0]
			schlogPlusDiv.appendChild(schlogPlusLabel)
			for (feature=0;feature < features.length; feature++) {
				var InputField = document.createElement("input")
				InputField.placeholder = features[feature] + " url..."
				InputField.id = features[feature] + "InputField"
				InputField.style = "max-height:30px;margin-top: 7px;margin-left:5px"
				schlogPlusDiv.appendChild(InputField)
				InputField.addEventListener("keypress", function(event) {
					if (event.key === "Enter") {
						event.preventDefault();
						if (InputField.value.includes("http")) {
							var pElement = document.createElement("p")
							var aElement = document.createElement("a")
							aElement.href = InputField.value
							aElement.target = "_blank"
							aElement.textContent = "[" + InputField.placeholder.split(" ")[0] + "]"
							pElement.appendChild(aElement)
							aboutMe.appendChild(pElement)
							InputField.value = ""
						}
					}
				}
			); 
			}
			buttonBar.parentElement.insertBefore(schlogPlusDiv, buttonBar.parentElement.childNodes[7])
		}
	}
	
	if (settings.toggle_shoutbox_anywhere.value) {
		var shoutbox = document.createElement("object")
		var shoutboxStyle = document.createElement("style")
		shoutboxStyle.textContent = "#schlogPlusShoutbox { " + settings.shoutbox_position.value.toLowerCase().split(" ")[0] + ": 0; " + settings.shoutbox_position.value.toLowerCase().split(" ")[1] + ": 0; }"
		document.head.appendChild(shoutboxStyle)
		shoutbox.id = "schlogPlusShoutbox"
		shoutbox.type = "text/html"
		shoutbox.data = "https://soyjak.blog/index.php?shoutbox/"
		shoutbox.height = "470px"
		document.body.append(shoutbox)
		shoutbox.onload = function() {
			var rsnode = document.createElement("style")
			const resizeObserver = new ResizeObserver(entries => 
				{
					//console.log('Body height changed:', entries[0].target.clientHeight);
					shoutbox.height = 80 + entries[0].target.clientHeight 
				}
			)
			rsnode.textContent = `
			.p-navSticky, .p-breadcrumbs, footer {
					display: none;
			}
			`
			shoutbox.contentDocument.documentElement.style = "overflow: hidden;"
			console.log("Loaded " + shoutbox.contentDocument)
			shoutbox.contentDocument.head.appendChild(rsnode)
			resizeObserver.observe(shoutbox.contentDocument.getElementsByClassName("block-body")[0])
		}
	}
}


// This function checks for changes in messages for the word filter and other cool text stuff.
function changeElements(settings) {
	var effectElements = [document.getElementsByClassName("p-title-value")[0]]
	//var rainbowregex = /\[rainbow\](\s?([A-Za-z]+\s?)+)\[\/rainbow\]/gi
	//var regex = /\[[^\]]*\](\s?([A-Za-z]+\s?)+)\[\/[A-Za-z]+\]/gi
	//var regex = /\[[^\]]*\](\s?(\S\s?)+)\[\/[A-Za-z]+\]/gi
	//var regex = /\[[^\]]*\](.*?)\[\/[A-Za-z]+\]/gi
	var regex = /\[(.*?)\](.*?)\[\/\1\]/gi
	var bracketregex = /\[[^\]]*\]/gi
	//var thing = document.getElementsByClassName("message-content js-messageContent");
	//for (var i = 0; i < thing.length; i++) {
		//effectElements.push(thing[i])
		//thing[i].innerHTML = thing[i].innerHTML.replace("schlog","shlog")
	//}
		
	// This gets message text.
	var conversationMessages = document.getElementsByClassName("message-userContent lbContainer js-lbContainer")
	for (var i=0; i < conversationMessages.length; i++) {
			effectElements.push(conversationMessages[i])
	}
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
		if (effectElements[i] != undefined) {
			if (settings.schlog_or_shlog.value != "Off") {
				effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0], settings.schlog_or_shlog.value.split(" ")[2]); 
				effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0].toLowerCase(), settings.schlog_or_shlog.value.split(" ")[2].toLowerCase()); 
				effectElements[i].innerHTML = effectElements[i].innerHTML.replace(settings.schlog_or_shlog.value.split(" ")[0].toUpperCase(), settings.schlog_or_shlog.value.split(" ")[2].toUpperCase()); 
			}
			var matches = effectElements[i].innerHTML.match(regex)
			if (matches) {
				for (m=0;m < matches.length;m++) {
					var matchTagSettings = matches[m].match(bracketregex)[0].replace("[","").replace("]","")
					var matchText = matches[m].replace(matches[m].match(bracketregex)[0],"").replace(matches[m].match(bracketregex)[1],"")
					if (matchTagSettings.toLowerCase() in tagSettings) {
						effectElements[i].innerHTML = effectElements[i].innerHTML.replace(matches[m],tagSettings[matchTagSettings.toLowerCase()].replace("INSERT_TEXT_HERE",matchText))
					}
				}
			}
		}
	}
}


var isPlayerPaused = true

document.addEventListener("visibilitychange", (event) => {
	if (document.visibilityState == "visible") {
		// Tab is active
		if (document.getElementById("profileMusicPlayer") != null && profile_music_pause_offtab) {
			if (isPlayerPaused == false) {
				document.getElementById("profileMusicPlayer").play()
			}
		}
	} else {
		// Tab is NOT active
		if (document.getElementById("profileMusicPlayer") != null && profile_music_pause_offtab) {
			isPlayerPaused = document.getElementById("profileMusicPlayer").paused
			document.getElementById("profileMusicPlayer").pause()	
		}
	}
});

function updateFunction(settings) {
	// If you are currently on a thread page...
	if (window.location.href.includes("threads") || window.location.href.includes("conversations")) {
		var messageInner = document.getElementsByClassName("message-inner")
		for (var i= 0; i < messageInner.length; i++) {
			// If toggle_ignore_guests is true and there are guests on the page, their messages will be hidden. 
			if (messageInner[i].getElementsByClassName("userTitle message-userTitle").length > 0) {
				if (settings.toggle_ignore_guests.value && messageInner[i].getElementsByClassName("userTitle message-userTitle")[0].textContent.includes("Guest")) {
					messageInner[i].style = "display:none;"
				}
			}
			
			if (messageInner[i].getElementsByClassName("reaction-text js-reactionText").length > 0) {
					if (settings.toggle_dislike_button.value) {
						messageInner[i].getElementsByClassName("reaction-text js-reactionText")[0].textContent = "Dislike"
						if (messageInner[i].getElementsByClassName("reaction-text js-reactionText")[0].parentNode.getElementsByTagName("i").length > 0) {
							messageInner[i].getElementsByClassName("reaction-text js-reactionText")[0].parentNode.getElementsByTagName("i")[0].remove()
						}
						messageInner[i].getElementsByClassName("reaction-text js-reactionText")[0].parentNode.href = messageInner[i].getElementsByClassName("reaction-text js-reactionText")[0].parentNode.href.replace("reaction_id=1","reaction_id=50")
					}
			}
			
			// If a user's username is inside of the ignore list, their message gets hidden.
			if (messageInner[i].getElementsByClassName("username").length > 0) {
					if (settings.ignore_list.value.includes(messageInner[i].getElementsByClassName("username")[0].textContent)) {
						messageInner[i].style = "display:none;"
				}
			}
			changeElements(settings)
			var userTitle = messageInner[i].getElementsByClassName("userTitle message-userTitle")
			var userName = messageInner[i].getElementsByClassName("message-name")
			var schlogPlusUserImg = document.createElement("img")
			var schlogPlusUserImgAdded = false
			schlogPlusUserImg.src = "https://raw.githubusercontent.com/sss5sss555s5s5s5/schlog-plus/refs/heads/main/icons/icon-256.png"
			schlogPlusUserImg.style = "width: 12px; margin-left:4px"
			if (userName.length > 0) {userName = userName[0].getElementsByTagName("A")[0]}
			if (settings.toggle_custom_badges.value && messageInner[i] != undefined && userTitle.length > 0) {
				var bracketregex = /\[#(?:[A-Fa-f0-9]{3}){1,2}\b\]/gi
				var parenthesisRegex = /\(#(?:[A-Fa-f0-9]{3}){1,2}\b\)/gi
				var matches = userTitle[0].textContent.match(bracketregex)
				if (userTitle[0].textContent.match(parenthesisRegex)) {
					userName.style = "color:" + userTitle[0].textContent.match(parenthesisRegex)[0].replace("(","").replace(")","") + ";"
					userTitle[0].textContent = userTitle[0].textContent.replace(userTitle[0].textContent.match(parenthesisRegex)[0],"")
					if(!schlogPlusUserImgAdded && settings.show_schlogplus_users.value)
					{
						userName.appendChild(schlogPlusUserImg)
						schlogPlusUserImgAdded = true	
					}
				}
				var badgeTexts = userTitle[0].textContent.split(bracketregex)
				userTitle[0].textContent = badgeTexts[0]
				if (matches != null) {
					for (var t = 0; t < matches.length; t++) {
						var bannerDiv = document.createElement("div")
						var bannerStrong = document.createElement("strong")
						var bannerColour = matches[t].replace("[","").replace("]","")
						bannerStrong.textContent = badgeTexts[t + 1]
						bannerDiv.className = "userBanner"
						bannerDiv.style = "display:block;text-shadow: 1px 1px black;color:white;margin-top:4px;background-color:" + bannerColour + ";"
						bannerDiv.appendChild(bannerStrong)
						messageInner[i].getElementsByClassName("message-userDetails")[0].appendChild(bannerDiv);
					}
					if(!schlogPlusUserImgAdded && settings.show_schlogplus_users.value)
					{
						userName.appendChild(schlogPlusUserImg)
						schlogPlusUserImgAdded = true	
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
