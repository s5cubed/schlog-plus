function onOpened() {
    console.log(`Options page opened`);
}

function onError(error) {
    console.log(`Error: ${error}`);
}

let opening = chrome.runtime.openOptionsPage();
opening.then(onOpened, onError);
window.close();
