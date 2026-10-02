function formatDuration(totalSeconds) {
  const seconds = Math.round(totalSeconds);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

globalThis.loadSiteCallout = (callout) => {
  const spectrogram = callout.querySelector("oe-spectrogram[data-src]");
  if (!spectrogram || spectrogram.src) return;

  const audioSource = spectrogram.dataset.src;
  spectrogram.src = audioSource;

  const duration = callout.querySelector(".site-callout-duration");
  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.preload = "metadata";
  audio.addEventListener(
    "loadedmetadata",
    () => (duration.textContent = formatDuration(audio.duration)),
    { once: true },
  );
  audio.src = audioSource;
};

globalThis.pauseSiteCallout = (callout) => {
  callout.querySelector("oe-spectrogram")?.pause();
};
