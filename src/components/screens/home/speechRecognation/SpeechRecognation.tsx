import styles from "./SpeechRecognation.module.scss";
import { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useRef, FC, useState } from "react";
import cn from "classnames";
import SpeechRecognition from "react-speech-recognition";
import { useOutsideClick } from "hooks/useOutsideClick";
import AudioRecordAnimation from "components/ui/audioRecordAnimation/audioRecordAnimation";
import TypingEffect from "components/ui/typingEffect/TypingEffect";
import { Command } from "shared/types/speechRecognition";
import { getItem } from "services/localStorage.service";
import { chatNodeTypes } from "shared/constants/chat";
import { handlePlaySound } from "utils/soundEffect";

interface IProps {
  loading: boolean;
  uploadAudioText: any;
  className: string;
  startListening?: boolean;
  showTranscript?: boolean;
  continuous?: boolean;
  commands?: ReadonlyArray<Command> | undefined;
  onStop?: () => any;
  onPlay?: () => any;
}

const SpeechRecognation: FC<IProps> = ({
  loading,
  uploadAudioText,
  className,
  startListening,
  showTranscript,
  continuous,
  commands,
  onStop,
  onPlay,
  ...rest
}) => {
  const {
    transcript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition({ commands });

  const ref = useRef(null);

  const handleRecordPlay = () => {
    handlePlaySound("");
    let lang = getItem("i18nextLng");
    let params: any = { continuous };
    if (lang) {
      if (lang === chatNodeTypes.RU) params.language = "ru-RU";
      if (lang === chatNodeTypes.EN) params.language = "en-US";
    }

    SpeechRecognition.startListening(params);
    if (onPlay) onPlay();
  };

  const handleRecordStop = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    if (onStop) onStop();
  };

  useOutsideClick(ref, () => {
    handleRecordStop();
  });

  useEffect(() => {
    if (finalTranscript) {
      uploadAudioText(transcript);
      handleRecordStop();
    }
  }, [finalTranscript]);

  useEffect(() => {
    if (startListening) {
      handleRecordPlay();
    }
  }, [startListening]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className={cn(styles.speechRecognation, className)} {...rest}>
      <div ref={ref}>
        {!listening ? (
          <AudioRecordAnimation
            width={70}
            height={70}
            className={loading ? "disable" : ""}
            onClick={handleRecordPlay}
            isRecording={listening}
          ></AudioRecordAnimation>
        ) : (
          <AudioRecordAnimation
            width={70}
            height={70}
            className={loading ? "disable" : ""}
            onClick={handleRecordStop}
            isRecording={listening}
          ></AudioRecordAnimation>
        )}
      </div>

      {transcript && showTranscript ? (
        <div className={styles["text-wrapper"]}>
          <TypingEffect text={transcript} duration={10} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SpeechRecognation;
