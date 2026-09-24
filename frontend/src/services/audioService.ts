// Audio Service for DTMF Telephone Tones and Web Speech Synthesis (IVR Voice)

const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playDtmfTone(digit: string, durationMs: number = 180) {
  try {
    const freqs = DTMF_FREQS[digit];
    if (!freqs) return;

    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freqs[0], now);
    osc2.frequency.setValueAtTime(freqs[1], now);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000));

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + (durationMs / 1000));
    osc2.stop(now + (durationMs / 1000));
  } catch (err) {
    console.warn("Audio playback not supported or user gesture needed:", err);
  }
}

export function playPhoneRing(durationMs: number = 800) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(480, now + 0.05);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (durationMs / 1000));
  } catch (e) {
    console.warn("Ring sound error:", e);
  }
}

export function speakIvrText(text: string, language: string = 'hi') {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported in this browser.');
    return;
  }

  // Cancel any prior speech
  window.speechSynthesis.cancel();

  // Clean text from symbols
  const clean = text.replace(/[*#]/g, '').replace(/[•]/g, ',');
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Find suitable Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => 
    language === 'hi' ? (v.lang.includes('hi') || v.name.includes('Hindi')) : (v.lang.includes('en-IN') || v.lang.includes('en'))
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
