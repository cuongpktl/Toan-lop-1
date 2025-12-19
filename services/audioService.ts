
const SOUNDS = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Ting vui nhộn
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',   // Soft boop
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',   // Pop
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'  // Magic/Applause
};

type SoundType = keyof typeof SOUNDS;

class AudioService {
  private audios: Map<SoundType, HTMLAudioElement> = new Map();

  play(type: SoundType) {
    let audio = this.audios.get(type);
    if (!audio) {
      audio = new Audio(SOUNDS[type]);
      this.audios.set(type, audio);
    }
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
}

export const audioService = new AudioService();
