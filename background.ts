chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ sound: "click.wav" });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getSoundSettings") {
    chrome.storage.local.get(["customSounds", "selectedSoundId"], (data) => {
      sendResponse(data);
    });
    return true;
  }
});
