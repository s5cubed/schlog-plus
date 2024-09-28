function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function getCurrentSettings(result) { 
    if (isEmpty(result)) {
            chrome.runtime.openOptionsPage();
    }
    
}

function onError(error) {
    console.log(`Error: ${error}`);
}

let getting = chrome.storage.sync.get();
getting.then(getCurrentSettings, onError);

console.log("Background test"); 
