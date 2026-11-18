// High quality Web Audio Synthesizer fallback for demo playback
// Generates beautiful ambient, lo-fi, and melodic music procedurally if network streams fail

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;
  private currentTrackId: string | null = null;
  private tempo = 80;
  private step = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol * 0.35)), this.ctx.currentTime);
    }
  }

  public start(trackId: string, genre: string = 'chill') {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentTrackId = trackId;
    this.step = 0;

    // Pick chord progression based on genre or track
    const chordProgressions: Record<string, number[][]> = {
      pop: [
        [261.63, 329.63, 392.00], // C
        [196.00, 246.94, 293.66], // G
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63]  // F
      ],
      chill: [
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [196.00, 246.94, 293.66, 349.23]  // G7
      ],
      rock: [
        [164.81, 246.94, 329.63], // E5
        [220.00, 293.66, 440.00], // A5
        [196.00, 261.63, 392.00], // G5
        [146.83, 220.00, 293.66]  // D5
      ],
    };

    const chords = chordProgressions[genre.toLowerCase()] || chordProgressions.chill;
    this.tempo = genre.toLowerCase() === 'rock' ? 120 : 75;
    const beatInterval = (60 / this.tempo) * 1000 / 2; // 8th notes

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const chordIndex = Math.floor((this.step / 8) % chords.length);
      const currentChord = chords[chordIndex];

      // Play pad / chord on beat 1 of each 8 steps
      if (this.step % 8 === 0) {
        currentChord.forEach((freq) => {
          this.playTone(freq, 2.2, 'sine', 0.08);
          this.playTone(freq * 0.5, 2.5, 'triangle', 0.1);
        });
      }

      // Arpeggio note
      const arpNote = currentChord[this.step % currentChord.length];
      this.playTone(arpNote * 2, 0.4, 'sine', 0.05);

      // Soft percussion tick
      if (this.step % 4 === 0) {
        this.playNoise(0.08, 0.06);
      } else if (this.step % 4 === 2) {
        this.playSnare(0.12, 0.04);
      }

      this.step++;
    }, beatInterval);
  }

  private playTone(freq: number, duration: number, type: OscillatorType, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  private playNoise(duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 4000;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start();
    } catch {
      // ignore
    }
  }

  private playSnare(duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      this.playNoise(duration, volume);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);
      gain.gain.setValueAtTime(volume * 1.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const audioSynthesizer = new AudioSynthesizer();
