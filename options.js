// ===========================================================================
// Schlog+ / options.js
// Created by s. aka Soygoy
//
// https://soyjak.blog/index.php?members/soygoy.488/
// sss5sss555s5s5s5.github.com
// s5s5s5.com
//
// This code is lcensed under the MIT License, please credit me in your forks.
// ===========================================================================

// Setting types:
// Toggle: on or off only.
// TextArea: Spawns a huge text box that you can type in.
// TextLine: Spawns a text line that you can type in.
// Slider: slides number up and down
// Select: Spawns a selection node.

var settings = {
    "Custom CSS":"Customize the entire website to your liking.",
    "custom_stylesheet": {
        "type":"textarea",
        "value":"",
        "description": "Import your custom theme here.",
    },
    "User control":"Ignore guests and staff members.",
    "toggle_ignore_guests": {
        "type":"toggle",
        "value":false,
        "description": "Ignore all guests?",
    },
    "ignore_list": {
        "type":"textline",
        "value":"",
        "description": "Input usernames separated by commas to ignore them.",
    },
    "Reaction Tooltip":"Customize the reactions box to your liking.",
    "toggle_react_grid": {
        "type":"toggle",
        "value":true,
        "description": "Toggle reaction grid?",
    },
    "react_grid_rows": {
        "type":"slider",
        "value":8,
        "min": 1,
        "max":30,
        "step":1,
        "description": "Reaction grid row amount",
    },
    "Image and Video scaling":"Fix annoying issues in regards to image scaling.",
    "image_squish_fix": {
        "type":"toggle",
        "value":true,
        "description": "Fix image squishing?",
    },
    "widescreen_video": {
        "type":"toggle",
        "value":true,
        "description": "Fix widescreen videos becoming portrait?",
    },
    "Profile music":"Configure profile music. To add profile music, go to your about section and add [MUSIC]music_url_here[/MUSIC] on a newline.",
    "enable_profile_music": {
        "type":"toggle",
        "value":true,
        "description": "Enable profile music?",
    },
    "profile_music_autoplay": {
        "type":"toggle",
        "value":false,
        "description": "Allow profile music to automatically play when someone has it.",
    },
    "profile_music_loop": {
        "type":"toggle",
        "value":true,
        "description": "Allow profile music to automatically loop.",
    },
    "profile_music_hide_controls": {
        "type":"toggle",
        "value":false,
        "description": "Hide profile music controls.",
    },
    "profile_music_volume": {
        "type":"slider",
        "value":0.5,
        "min": 0.0,
        "max":1.0,
        "step":0.1,
        "description": "Profile music volume.",
    },
    "Fun stuff":"Custom badges and free swag.",
    "toggle_custom_badges": {
        "type":"toggle",
        "value":true,
        "description": "Toggle Custom Badges?",
    },
    "schlog_or_shlog": {
        "type":"select",
        "value":"Off",
        "options":["Off","Schlog to Shlog","Shlog to Schlog"],
        "description": "Auto word filter Schlog to Shlog, or Shlog to Schlog?",
    },
}

var browserType = "firefox"
if (typeof browser === "undefined") {
	var browser = chrome;
	browserType = "chrome";
}

function isEmpty(obj) {
	return Object.keys(obj).length === 0;
}

function restoreOptions() {
	function setCurrentSettings(result) {
		if (isEmpty(result)) {
			console.log("Empty settings!")  
			browser.storage.sync.set(settings);
		}
		// Instead of just settings = result, we set every value key to make sure that objects dont go out of order.
		for (var i = 0; i < Object.keys(result).length; i++) {
			var currentKeyValue = result[Object.keys(result)[i]];
			var currentKey = Object.keys(result)[i];
			var currentValue = Object.values(currentKey);
			if (currentKeyValue.constructor == Object) {
				//console.log("Settings before: ", settings[currentKey])
				settings[currentKey].value = currentKeyValue.value;
				//console.log("Settings after: ", settings[currentKey])
			}
		}
	renderSettings();
	//console.log(result);
	}

	function onError(error) {
		console.log(`Error: ${error}`);
		renderSettings();
	}
  
	if (browserType == "firefox") {
		let getting = browser.storage.sync.get();
		getting.then(setCurrentSettings, onError);
	}
	else {
		browser.storage.sync.get(
			function(result) {
				setCurrentSettings(result)
			}
		)
	}
  
}

function renderSettings() {
	document.getElementById("main-settings").innerHTML = ""
	for (var i = 0; i < Object.keys(settings).length; i++) {
		var mainsettings = document.getElementById("main-settings")
		var currentKeyValue = settings[Object.keys(settings)[i]];
		var currentKey = Object.keys(settings)[i];
		var currentValue = Object.values(currentKey);
        
		if (currentKeyValue.constructor == Object) {
			var nodetoadd
			switch (currentKeyValue.type) {
				case 'textarea':
					nodetoadd = document.createElement("textarea")
					nodetoadd.id = currentKey
					nodetoadd.rows = 8
					nodetoadd.cols = 100
					nodetoadd.value = currentKeyValue.value
					mainsettings.appendChild(nodetoadd)
					break;
				case 'textline':
					var description = document.createElement("element")
					description.textContent = currentKeyValue.description
					mainsettings.appendChild(description)
					nodetoadd = document.createElement("input")
					nodetoadd.id = currentKey
					nodetoadd.type = "text"
					nodetoadd.value = currentKeyValue.value
					mainsettings.appendChild(nodetoadd)
					break;
                case 'toggle':
					var description = document.createElement("element")
					description.textContent = currentKeyValue.description
					mainsettings.appendChild(description)
					nodetoadd = document.createElement("input")
					nodetoadd.id = currentKey
					nodetoadd.type = "checkbox"
					nodetoadd.checked = currentKeyValue.value
					mainsettings.appendChild(nodetoadd)
					break;
                case 'slider':
					mainsettings.appendChild(document.createElement("br"))
					var description = document.createElement("element")
					var valueLabel = document.createElement("element")
					valueLabel.id = currentKey + "_value"
					description.textContent = currentKeyValue.description + " Value: "
					valueLabel.innerHTML = currentKeyValue.value
					mainsettings.appendChild(description)
					mainsettings.appendChild(valueLabel)
					nodetoadd = document.createElement("input")
					nodetoadd.id = currentKey
					nodetoadd.type = "range"
					nodetoadd.min = currentKeyValue.min
					nodetoadd.max = currentKeyValue.max
					nodetoadd.step = currentKeyValue.step
					nodetoadd.value = currentKeyValue.value
					nodetoadd.oninput = function() {
						document.getElementById(this.id + "_value").innerHTML = this.value;
					}
					mainsettings.appendChild(document.createElement("br"))
					mainsettings.appendChild(nodetoadd)
					break;
                case 'select':
					var description = document.createElement("element")
					description.textContent = currentKeyValue.description
					mainsettings.appendChild(description)
					nodetoadd = document.createElement("select")
					nodetoadd.id = currentKey
					mainsettings.appendChild(nodetoadd)
					for (var d = 0; d < currentKeyValue.options.length ; d++) {
							var selectoption = document.createElement("option")
							selectoption.value = currentKeyValue.options[d]
							selectoption.innerHTML = currentKeyValue.options[d]
							nodetoadd.appendChild(selectoption)
					}
					nodetoadd.value = currentKeyValue.value
					break;
				}
		}
		else {
			var headernode = document.createElement("h2")
			var descriptionnode = document.createElement("p")
			headernode.textContent = currentKey
			descriptionnode.textContent = currentKeyValue;
			
			mainsettings.appendChild(headernode)
			mainsettings.appendChild(descriptionnode)
		}
		
		mainsettings.appendChild(document.createElement("br"))
		console.log(currentKey + " and " + currentKeyValue);
    // more statements
	}
	
	var button = document.createElement("button")
	button.type="submit"
	button.id="submit-button"
	button.textContent="Save"
	mainsettings.appendChild(button)
}

function saveOptions(e) {
	e.preventDefault();
	for (var i = 0; i < Object.keys(settings).length; i++) {
		var mainsettings = document.getElementById("main-settings")
		var currentKeyValue = settings[Object.keys(settings)[i]];
		var currentKey = Object.keys(settings)[i];
		var currentValue = Object.values(currentKey);
		
		if (currentKeyValue.constructor == Object) {
			var nodetoget = document.getElementById(currentKey)
			switch (currentKeyValue.type) {
				case 'toggle':
					currentKeyValue.value = nodetoget.checked;
					break;
				default:
					if (nodetoget != null) {
						currentKeyValue.value = nodetoget.value 
					}
					break;
			}

        //console.log(currentKey + " and " + currentKeyValue.value);
    // more statements
		}
    
	}
	browser.storage.sync.set(settings);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

