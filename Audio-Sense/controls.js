// JS for controls.html: Simulated sound control using Web Audio API

document.addEventListener('DOMContentLoaded', () => {
  const freqSlider = document.getElementById('freq-slider');
  const freqDisplay = document.getElementById('freq-display');
  const dbSlider = document.getElementById('db-slider');
  const dbDisplay = document.getElementById('db-display');
  const startStopBtn = document.getElementById('start-stop-btn');
  const controlPanel = document.getElementById('control-panel');

  let audioContext, oscillator, gainNode, isPlaying = false;

  // Initialize Web Audio API
  function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine'; // Simple sine wave for simulation
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Default to 440 Hz
    gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start muted
  }

  // Update frequency from slider
  freqSlider.addEventListener('input', () => {
    const freq = parseFloat(freqSlider.value);
    freqDisplay.textContent = `${freq} Hz`;
    if (oscillator) {
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    }
    // Add glow effect based on range (Bass: <300Hz, Mid: 300-4000Hz, Treble: >4000Hz)
    controlPanel.classList.remove('bass-glow', 'mid-glow', 'treble-glow');
    if (freq < 300) controlPanel.classList.add('bass-glow');
    else if (freq <= 4000) controlPanel.classList.add('mid-glow');
    else controlPanel.classList.add('treble-glow');
  });

  // Update dB from slider and convert to linear gain
  dbSlider.addEventListener('input', () => {
    const db = parseFloat(dbSlider.value);
    dbDisplay.textContent = `${db} dB`;
    if (gainNode) {
      const linearGain = Math.pow(10, db / 20); // dB to linear
      gainNode.gain.setValueAtTime(linearGain, audioContext.currentTime);
    }
    // Visual intensity and warning glow
    const intensity = (db / 120) * 100; // 0-100% for CSS
    dbDisplay.style.textShadow = `0 0 ${intensity / 10}px var(--glow-color)`;
    controlPanel.classList.remove('warning-glow');
    if (db > 90) controlPanel.classList.add('warning-glow');
  });

  // Start/Stop sound with fade-in/out
  startStopBtn.addEventListener('click', () => {
    if (!audioContext) initAudio();
    if (isPlaying) {
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
      setTimeout(() => {
        oscillator.stop();
        isPlaying = false;
        startStopBtn.textContent = 'Start Sound';
      }, 500);
    } else {
      oscillator.start();
      // Fade in
      gainNode.gain.exponentialRampToValueAtTime(Math.pow(10, parseFloat(dbSlider.value) / 20), audioContext.currentTime + 0.5);
      isPlaying = true;
      startStopBtn.textContent = 'Stop Sound';
    }
  });

  // Initialize displays on load
  freqDisplay.textContent = `${freqSlider.value} Hz`;
  dbDisplay.textContent = `${dbSlider.value} dB`;
});