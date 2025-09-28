function playClick() {
  chrome.runtime.sendMessage({ type: "getSoundSettings" }, (data) => {
    let soundPath;
    const customSounds = data.customSounds || [];
    const selectedSoundId = data.selectedSoundId || "default";

    if (selectedSoundId === "default") {
      soundPath = chrome.runtime.getURL("sounds/click.wav");
    } else {
      const index = parseInt(selectedSoundId.replace("custom-", ""), 10);
      if (customSounds[index]) {
        soundPath = customSounds[index].data; // base64
      } else {
        soundPath = chrome.runtime.getURL("sounds/click.wav"); // fallback
      }
    }

    const audio = new Audio(soundPath);
    audio.volume = 0.5;
    audio.play().catch((err) => console.error("Play failed:", err));
  });
}

document.addEventListener("keydown", (e) => {
  if (!["Shift", "Control", "Alt"].includes(e.key)) {
    playClick();
  }
});
