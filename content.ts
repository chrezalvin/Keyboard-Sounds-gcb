import { playAudio } from "./utils";
import { DEFAULT_SOUND_PATH, EXCLUDED_KEYS } from "./configs";
import { isSoundSettings, SoundSettings } from "./types/SoundSettings"

function playClick() {
  chrome.runtime.sendMessage({ type: "getSoundSettings" }, (data: unknown) => {
    // could be empty object too
    if (!isSoundSettings(data)) {
      console.error("Invalid sound settings received:", data);
      return;
    }

    console.log("Sound settings received:", data);

    try{
      let soundPath: string = chrome.runtime.getURL(DEFAULT_SOUND_PATH);
      const customSounds = data.customSounds ?? [];
      const selectedSoundId = data.selectedSoundId ?? "default";
      const soundType = data.soundType ?? "single";
      const soundPlayOrder = data.soundPlayOrder ?? "orderly";

      if(soundType === "single"){
        if (selectedSoundId !== "default") {
          const index = parseInt(selectedSoundId.replace("custom-", ""), 10);
          if (customSounds[index])
            soundPath = customSounds[index].data; // base64
        }
      }
      else if(soundType === "multiple"){
        const multipleSounds = data.multipleSoundList ?? [];
        if(multipleSounds.length > 0){
          let sound: SoundSettings["multipleSoundList"][number];
          if(soundPlayOrder === "orderly"){
            sound = multipleSounds.shift(); // get first sound
            if(sound)
              multipleSounds.push(sound); // put it back to the end
          }
          else if(soundPlayOrder === "randomly"){
            const randomIndex = Math.floor(Math.random() * multipleSounds.length);
            sound = multipleSounds[randomIndex];
          }

          soundPath = sound.data;
        }
      }

      playAudio(soundPath);
    }
    catch(e){
      console.error("Play failed:", e)
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (!EXCLUDED_KEYS.includes(e.key)) {
    playClick();
  }
});
