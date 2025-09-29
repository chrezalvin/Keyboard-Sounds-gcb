import { DEFAULT_VOLUME } from "./configs";
import { SoundSettings, isSoundSettings } from "./types/SoundSettings"

export function playAudio(path: string, volume: number = DEFAULT_VOLUME): void {
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play()
}

export async function loadLocalStorage(): Promise<SoundSettings>{
    const res = await chrome.storage.local.get(["customSounds", "selectedSoundId", "multipleSoundList", "soundType", "soundPlayOrder"]);
    if(!isSoundSettings(res)){
        throw new Error("Invalid sound settings in storage");
    }

    return res;
}

export async function setSelectedSoundId(id: SoundSettings["selectedSoundId"]): Promise<SoundSettings> {
    await chrome.storage.local.set({ selectedSoundId: id });

    return await loadLocalStorage();
}

export async function addNewSound(customSound: SoundSettings["customSounds"][number]): Promise<SoundSettings>{
    const localStorage = await loadLocalStorage();

    await chrome.storage.local.set({ 
        customSounds: [
            ...(localStorage.customSounds ?? []), 
            customSound
        ]
    });

    return await loadLocalStorage();
}

export async function addMultipleNewSound(multipleSounds: SoundSettings["multipleSoundList"]): Promise<SoundSettings>{
    const localStorage = await loadLocalStorage();

    await chrome.storage.local.set({ 
        multipleSoundList: [
            ...(localStorage.multipleSoundList ?? []), 
            ...multipleSounds
        ]
    });

    return await loadLocalStorage();
}

export async function setSoundType(type: SoundSettings["soundType"]): Promise<SoundSettings> {
    await chrome.storage.local.set({ soundType: type });
    return await loadLocalStorage();
}

export async function addNewSoundList(customSound: SoundSettings["customSounds"][number]): Promise<SoundSettings>{
    console.log("Adding new sound to list:", customSound);

    const localStorage = await loadLocalStorage();

    // get highest index order
    const lastIndex = (localStorage.multipleSoundList ?? []).reduce((max, sound) => Math.max(max, sound.order ?? 0), 0);
    const newSound = { ...customSound, order: lastIndex + 1 };

    await chrome.storage.local.set({
        multipleSoundList: [
            ...(localStorage.multipleSoundList ?? []), 
            newSound
        ]
    });

    const res = await loadLocalStorage();

    console.log("New sound list:", res.multipleSoundList);

    return res;
}

export async function clearSoundList(): Promise<SoundSettings>{
    await chrome.storage.local.remove(["multipleSoundList", "soundType"]);

    return await loadLocalStorage();
}

export async function setSoundPlayOrder(order: SoundSettings["soundPlayOrder"]): Promise<SoundSettings> {
    await chrome.storage.local.set({ soundPlayOrder: order });
    return await loadLocalStorage();
}

export async function clearStorage(): Promise<SoundSettings>{
    await chrome.storage.local.remove(["customSounds", "selectedSoundId", "multipleSoundList", "soundType", "soundPlayOrder"]);

    return await loadLocalStorage();
}