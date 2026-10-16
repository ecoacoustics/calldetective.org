function formatDuration(totalSeconds) {
  const seconds = Math.round(totalSeconds);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function updateClock(clock, seconds) {
  clock.textContent = formatDuration(seconds);
}

globalThis.loadSiteCallout = (callout) => {
  const spectrogram = callout.querySelector("oe-spectrogram[data-src]");
  if (!spectrogram) return;

  if (spectrogram.dataset.clockInitialized) return;

  const clock = callout.querySelector(".site-callout-duration");
  let duration = 0;
  let lastElapsed = 0;
  let hasPlayed = false;
  let animationFrame = 0;

  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.preload = "metadata";
  audio.addEventListener(
    "loadedmetadata",
    () => {
      duration = audio.duration;
      if (!hasPlayed) updateClock(clock, duration);
    },
    { once: true },
  );
  audio.src = spectrogram.dataset.src;

  spectrogram.addEventListener("play", (event) => {
    cancelAnimationFrame(animationFrame);
    const currentTime = spectrogram.currentTime.value;

    if (!event.detail.play) {
      if (hasPlayed && currentTime === 0 && lastElapsed > 0) {
        updateClock(clock, duration || lastElapsed);
        lastElapsed = duration || lastElapsed;
      } else {
        lastElapsed = currentTime;
        updateClock(clock, currentTime);
      }
      return;
    }

    hasPlayed = true;
    lastElapsed = currentTime;
    updateClock(clock, currentTime);

    const updateWhilePlaying = () => {
      const elapsed = spectrogram.currentTime.value;
      lastElapsed = elapsed;
      updateClock(clock, elapsed);
      if (!spectrogram.paused) animationFrame = requestAnimationFrame(updateWhilePlaying);
    };
    animationFrame = requestAnimationFrame(updateWhilePlaying);
  });

  spectrogram.dataset.clockInitialized = "true";
  if (!spectrogram.src) spectrogram.src = spectrogram.dataset.src;
};

globalThis.pauseSiteCallout = (callout) => {
  let spectrogram = callout.querySelector("oe-spectrogram");
  
  if (!spectrogram) {
    return;
  }

  if (spectrogram.paused) {
    return;
  }

  spectrogram.pause();
};
