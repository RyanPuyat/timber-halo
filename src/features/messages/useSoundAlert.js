let soundUnlocked = false;

function unlockSound() {
  soundUnlocked = true;
}

window.addEventListener('click', unlockSound, { once: true });
window.addEventListener('keydown', unlockSound, { once: true });
window.addEventListener('touchstart', unlockSound, { once: true });

const messageAudio = new Audio('/sounds/message.wav');
messageAudio.preload = 'auto';
messageAudio.volume = 0.8;

export function playMessageSound() {
  if (!soundUnlocked) {
    console.debug('Sound blocked: waiting for user interaction.');
    return;
  }

  try {
    messageAudio.currentTime = 0;

    const playPromise = messageAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {})
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.debug('Audio playback was aborted.');
          } else {
            console.warn('Audio playback failed:', err);
          }
        });
    }
  } catch (err) {
    console.warn('Unexpected audio error:', err);
  }
}
