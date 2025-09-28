const soundPicker = document.getElementById("soundPicker") as HTMLSelectElement;
const uploadInput = document.getElementById("upload") as HTMLInputElement;

function populatePicker(customSounds, selectedSoundId) {
  soundPicker.innerHTML = "";

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "default";
  defaultOption.textContent = "Default Click";
  soundPicker.appendChild(defaultOption);

  // Add custom sounds
  customSounds.forEach((sound, index) => {
    const opt = document.createElement("option");
    opt.value = `custom-${index}`;
    opt.textContent = sound.name;
    soundPicker.appendChild(opt);
  });

  // Restore last chosen
  if (selectedSoundId) {
    soundPicker.value = selectedSoundId;
  }
}

function loadPreferences() {
  chrome.storage.local.get(["customSounds", "selectedSoundId"], (data) => {
    const customSounds = data.customSounds || [];
    const selectedSoundId = data.selectedSoundId || "default";
    populatePicker(customSounds, selectedSoundId);
  });
}

document.getElementById("save").addEventListener("click", () => {
  const selected = soundPicker.value;
  chrome.storage.local.set({ selectedSoundId: selected }, () => {
    alert("Sound preference saved!");
  });
});

uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    chrome.storage.local.get("customSounds", (data) => {
      const customSounds = data.customSounds || [];
      customSounds.push({ name: file.name, data: reader.result });

      chrome.storage.local.set({ customSounds }, () => {
        loadPreferences(); // refresh picker
        alert("Custom sound added!");
      });
    });
  };
  reader.readAsDataURL(file);
});

document.getElementById("clear").addEventListener("click", () => {
  chrome.storage.local.remove(["customSounds", "selectedSoundId"], () => {
    loadPreferences();
    alert("All custom sounds cleared!");
  });
});

// Initialize picker on load
loadPreferences();
