export interface SoundSettings {
  selectedSoundId?: string;
  customSounds?: { name: string; data: string }[];
  multipleSoundList?: { name: string; data: string; order: number }[];
  soundType?: "single" | "multiple";
  soundPlayOrder?: "orderly" | "randomly";
}

export function isSoundSettings(obj: unknown): obj is SoundSettings {
  if (typeof obj !== "object" || obj === null) return false;

  if ("selectedSoundId" in obj && typeof obj.selectedSoundId !== "string") return false;
  if ("soundType" in obj && obj.soundType !== "single" && obj.soundType !== "multiple") return false;
  if ("soundPlayOrder" in obj && obj.soundPlayOrder !== "orderly" && obj.soundPlayOrder !== "randomly") return false;
  if ("multipleSoundList" in obj){
    if(!Array.isArray(obj.multipleSoundList)) return false;
    for(const sound of obj.multipleSoundList){
        if(typeof sound !== "object" || sound === null) return false;
        if(typeof sound.name !== "string" || typeof sound.data !== "string") return false;
        if(typeof sound.order !== "number") return false;
    }    
  }
  if ("customSounds" in obj){
    if(!Array.isArray(obj.customSounds)) return false;
    for(const sound of obj.customSounds){
        if(typeof sound !== "object" || sound === null) return false;
        if(typeof sound.name !== "string" || typeof sound.data !== "string") return false;
    }
  }

  return true;
}