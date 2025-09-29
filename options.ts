import { SoundSettings } from "./types/SoundSettings";
import { addNewSound, addNewSoundList, clearSoundList, clearStorage, loadLocalStorage, setSelectedSoundId, setSoundPlayOrder, setSoundType } from "./utils";

const soundPicker = document.getElementById("soundPicker") as HTMLSelectElement;
const soundList = document.getElementById("sound_list") as HTMLOListElement;

const uploadInput = document.getElementById("upload") as HTMLInputElement;
const soundOptions = document.getElementsByName("typing_sound_type") as NodeListOf<HTMLInputElement>;

const singleSoundContainer = document.getElementById("single_sound") as HTMLDivElement;
const multiSoundContainer = document.getElementById("multi_sound") as HTMLDivElement;

const clearSoundListBtn = document.getElementById("clear_sound_list") as HTMLButtonElement;
const soundSelections = document.getElementById("sound_selections") as HTMLDivElement;
const clearStorageBtn = document.getElementById("clear") as HTMLButtonElement;
const soundPlayOrderOptions = document.getElementsByName("sound_play_order") as NodeListOf<HTMLInputElement>;

function refreshUI(data: SoundSettings){
  soundPicker.innerHTML = "";
  soundList.innerHTML = "";
  soundSelections.innerHTML = "";

  // Add default option for sound picker
  const defaultOption = document.createElement("option");
  defaultOption.value = "default";
  defaultOption.textContent = "Default Click";
  soundPicker.appendChild(defaultOption);

  // add default button for sound list
  const defaultBtn = document.createElement("button");
  defaultBtn.textContent = "Default Click";
  defaultBtn.name = "default";
  defaultBtn.value = "default";
  defaultBtn.addEventListener("click", async () => {
    const res = await addNewSoundList({ name: "Default Click", data: chrome.runtime.getURL("sounds/click.wav") });

    refreshUI(res);
  })
  soundSelections.appendChild(defaultBtn);

  // Add custom sounds to sound picker
  data.customSounds?.forEach((sound, index) => {
    const opt = document.createElement("option");
    opt.value = `custom-${index}`;
    opt.textContent = sound.name;
    soundPicker.appendChild(opt);
  });

  // add custom buttons to sound list
  data.customSounds?.forEach((sound, index) => {
    const btn = document.createElement("button");
    btn.value = `custom-${index}`;
    btn.textContent = sound.name;

    btn.addEventListener("click", async () => {
      const res = await addNewSoundList(sound);

      refreshUI(res);
    });

    soundSelections.appendChild(btn);
  })

  // restore last chosen
  if (data.selectedSoundId) {
    soundPicker.value = data.selectedSoundId;
  }

  if(data.multipleSoundList && data.multipleSoundList.length > 0) {
    data.multipleSoundList.forEach((sound) => {
      const list = document.createElement("li");
      list.textContent = sound.name;
      soundList.appendChild(list);
    })
  }
}

async function loadPreferences(){
  const data = await loadLocalStorage();
  refreshUI(data);

  soundOptions.forEach(option => {
    if (option.value === data.soundType)
      option.click();
  });

  soundPlayOrderOptions.forEach(option => {
    if (option.value === data.soundPlayOrder)
      option.click();
  });
}

soundPlayOrderOptions.forEach(option => {
  option.addEventListener("change", async () => {
    if(option.value !== "orderly" && option.value !== "randomly") return;

    await setSoundPlayOrder(option.value);
  });
})

soundOptions.forEach(option => {
  option.addEventListener("change", async () => {
    if(option.value !== "single" && option.value !== "multiple") return;

    if (option.value === "single") {
      singleSoundContainer.classList.remove("hidden");
      multiSoundContainer.classList.add("hidden");
    }
    else if (option.value === "multiple") {
      singleSoundContainer.classList.add("hidden");
      multiSoundContainer.classList.remove("hidden");
    }

    setSoundType(option.value);
  });
});

soundPicker.addEventListener("change", () => {
  const selected = soundPicker.value;
  setSelectedSoundId(selected);
})

async function handleFileUpload(file: File): Promise<SoundSettings>{
  console.log(`handling file upload ${file.name}`);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if(typeof reader.result !== "string") return;
      const res = await addNewSound({ name: file.name, data: reader.result });

      resolve(res);
    }

    reader.onerror = () => {
      reject();
    }

    reader.readAsDataURL(file);
  });
}

uploadInput.addEventListener("change", async () => {
  for(let iii = 0; iii < uploadInput.files.length; ++iii){
    const file = uploadInput.files[iii];
    const data = await handleFileUpload(file);
    refreshUI(data);
  }
});

clearSoundListBtn.addEventListener("click", async () => {
  const res = await clearSoundList();

  refreshUI(res);
})

clearStorageBtn.addEventListener("click", async () => {
  await clearStorage();
  await loadPreferences();
  alert("All custom sounds cleared!");
});

// Initialize picker on load
loadPreferences();