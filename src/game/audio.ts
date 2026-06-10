import { snd } from "./assets";

// Lightweight HTML5-audio sound manager (avoids pulling in @pixi/sound).
// Music loops with a crossfade-free restart; SFX play one-shot from a small pool.

const SFX: Record<string, string> = {
  culling: "moon_virus_FX_Culling.mp3",
  orbitalStrike: "moon_virus_FX_Orbital_Strike.mp3",
  houseArrest: "moon_virus_FX_House_Arrest.mp3",
  quarantine: "moon_virus_FX_Quaranteen.mp3",
  endTurn: "moon_virus_FX_end_turn.mp3",
  laserBlast: "moon_virus_FX_laser_Blast.mp3",
  victory: "Moon_virus_victory.mp3",
  death: "Moon_virus_death.mp3",
  button: "Moon_Virus_FX_Button_General use.mp3",
};

const MUSIC: Record<string, string> = {
  ambient: "ambient.mp3",
  tension: "moon_virus_Tension_master.mp3",
};

class AudioManager {
  private muted = false;
  private sfxVolume = 0.5;
  private musicVolume = 0.35;
  private music: HTMLAudioElement | null = null;
  private currentTrack = "";

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.music) this.music.muted = m;
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  play(key: string): void {
    if (this.muted) return;
    const file = SFX[key];
    if (!file) return;
    const a = new Audio(snd(file));
    a.volume = this.sfxVolume;
    // Autoplay can reject before user gesture; swallow it.
    a.play().catch(() => {});
  }

  playMusic(key: string): void {
    if (this.currentTrack === key) return;
    const file = MUSIC[key];
    if (!file) return;
    this.stopMusic();
    this.currentTrack = key;
    const a = new Audio(snd(file));
    a.loop = true;
    a.volume = this.musicVolume;
    a.muted = this.muted;
    a.play().catch(() => {});
    this.music = a;
  }

  stopMusic(): void {
    if (this.music) {
      this.music.pause();
      this.music = null;
    }
    this.currentTrack = "";
  }
}

export const audio = new AudioManager();
