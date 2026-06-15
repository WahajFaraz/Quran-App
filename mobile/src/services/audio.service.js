import { setAudioModeAsync, createAudioPlayer } from 'expo-audio';

let currentPlayer = null;
let statusSubscription = null;

export const playAudio = async (url, onFinish) => {
  try {
    if (currentPlayer) {
      statusSubscription?.remove();
      currentPlayer.remove();
    }
    await setAudioModeAsync({ playsInSilentMode: true });
    currentPlayer = createAudioPlayer({ uri: url });
    statusSubscription = currentPlayer.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish && onFinish) onFinish();
    });
    currentPlayer.play();
    return currentPlayer;
  } catch (error) {
    console.error('Audio play error:', error);
    throw error;
  }
};

export const stopAudio = async () => {
  if (currentPlayer) {
    statusSubscription?.remove();
    currentPlayer.remove();
    currentPlayer = null;
    statusSubscription = null;
  }
};

export const replayAudio = async () => {
  if (currentPlayer) {
    await currentPlayer.seekTo(0);
    currentPlayer.play();
  }
};
