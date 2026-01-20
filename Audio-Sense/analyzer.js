// JS for analyzer.html: Web Audio API, real-time analysis, visualizations

document.addEventListener('DOMContentLoaded', () => {
  const startStopBtn = document.getElementById('start-stop-btn');
  const frequencyDisplay = document.getElementById('frequency-display');
  const dbDisplay = document.getElementById('db-display');
  const sliderIndicator = document.getElementById('slider-indicator');
  const visualization = document.getElementById('visualization');
  const canvas = document.createElement('canvas');
  canvas.width = visualization.clientWidth;
  canvas.height = visualization.clientHeight;
  visualization.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let audioContext, analyser, microphone, dataArray, isRunning = false;
  const bufferLength = 256; // For frequency bars

  // Request microphone permission and set up audio
  async function initAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      isRunning = true;
      startStopBtn.textContent = 'Stop Microphone';
      animate();
    } catch (err) {
      alert('Microphone access denied or not supported.');
    }
  }

  // Stop audio
  function stopAudio() {
    if (audioContext) {
      audioContext.close();
      isRunning = false;
      startStopBtn.textContent = 'Start Microphone';
      frequencyDisplay.textContent = '0 Hz';
      dbDisplay.textContent = '0 dB';
      sliderIndicator.style.left = '0%';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Calculate approximate dB from RMS
  function calculateDB(buffer) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    return 20 * Math.log10(rms / 128); // Approximate dB
  }

  // Find peak frequency
  function findPeakFrequency(data) {
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIndex = i;
      }
    }
    const nyquist = audioContext.sampleRate / 2;
    return (maxIndex / data.length) * nyquist;
  }

  // Animation loop for real-time updates
  function animate() {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);
    const frequency = findPeakFrequency(dataArray);
    const db = calculateDB(dataArray);

    // Update displays
    frequencyDisplay.textContent = `${Math.round(frequency)} Hz`;
    dbDisplay.textContent = `${Math.round(db)} dB`;

    // Update slider (20Hz to 20kHz)
    const sliderPos = Math.min((frequency / 20000) * 100, 100);
    sliderIndicator.style.left = `${sliderPos}%`;

    // Add glow if sound detected
    const container = document.getElementById('analyzer-container');
    if (db > -50) {
      container.classList.add('glow');
    } else {
      container.classList.remove('glow');
    }

    // Draw frequency bars
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / bufferLength;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      ctx.fillStyle = `hsl(${(i / bufferLength) * 360}, 100%, 50%)`;
      ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
    }
  }

  // Button event
  startStopBtn.addEventListener('click', () => {
    if (isRunning) {
      stopAudio();
    } else {
      initAudio();
    }
  });
});