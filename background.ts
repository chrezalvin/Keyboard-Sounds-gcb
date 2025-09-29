import { loadLocalStorage } from "./utils";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ sound: "click.wav" });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(`Received a message with type: ${msg.type}`);
  if (msg.type === "getSoundSettings") {
    loadLocalStorage().then((data) => {
      console.log("Sending sound settings:", data);
      sendResponse(data);
    });
    return true;
  }
});
