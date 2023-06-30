let audio: HTMLAudioElement | null = null;

export const handlePlaySound = (url: string, volume: number = 1) => {
  const playAudio = () => {
    if (audio) {
      audio.pause();
    }

    audio = new Audio(url);
    audio.volume = volume;
    audio.autoplay = true;
    audio.muted = false;
    const audioPlayInstance = audio.play().catch((e) => {
      console.log(e);
    });

    return { audio, audioPlayInstance };
  };

  return playAudio();
};
