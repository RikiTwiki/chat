import { useRef, useState, useEffect } from "react";
import ChatList from "./chatList/ChatList";
import { handlePlaySound } from "utils/soundEffect";
import { API_URL } from "shared/api/api.config";
import styles from "./Home.module.scss";
import { IMessage } from "shared/types/chatWithAssistant";
import i18next from "i18next";
import { getItem } from "services/localStorage.service";
import { chatNodeTypes } from "shared/constants/chat";
import Button from "components/ui/button/Button";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useTypedDispatch, useTypedSelector } from "store/store";
import {
  add,
  addOptions,
  getChatBotNodeThunk,
  patchLastItemOptions,
  getAssistantResThunk,
} from "store/chat/chat.slice";
import { scrollBottom } from "utils/srollUtils";
import SpeechRecognationComponent from "./speechRecognation/SpeechRecognation";
import { initChatList } from "utils/chatScripts";
import { useSpeechRecognition } from "react-speech-recognition";

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const { list: chatList, isLoading } = useTypedSelector((store) => store.chat);
  const { bot: botRes, assistant: assistantRes } = useTypedSelector(
    (store) => store.chat
  );
  const containerRef = useRef<HTMLInputElement>(null);
  const { interimTranscript } = useSpeechRecognition();
  const [startListening, setStartListening] = useState(true);
  const [activateAssistant, setActivateAssistant] = useState(false);
  const [timeOutSubs, setTimeOutSubs] = useState<NodeJS.Timeout[]>([]);

  const commands = [
    {
      command: /(\b.*)?(да|yes|нет|no)(.*\b)?/,
      callback: () => {
        const regex1 = /(\b.*)?(yes|да)(.*\b)?/;
        const regex2 = /(\b.*)?(нет|no)(.*\b)?/;
        const matchesIndex1 = interimTranscript
          .toLocaleLowerCase()
          .search(regex1);
        const matchesIndex2 = interimTranscript
          .toLocaleLowerCase()
          .search(regex2);

        if (matchesIndex1 < matchesIndex2) {
          handleYesNoCommand("No");
        }

        if (matchesIndex1 > matchesIndex2) {
          handleYesNoCommand("Yes");
        }
      },
    },
    {
      command: /(\b.*)?(russian|russia|русский|россия)(.*\b)?/,
      callback: () => handleChooseLangCommand(chatNodeTypes.RU),
    },
    {
      command: /(\b.*)?(english|england|английский|aнгло)(.*\b)?/,
      callback: () => handleChooseLangCommand(chatNodeTypes.EN),
    },
    {
      command: /(\b.*)?(заново|restart|начать|start over|назад)(.*\b)?/,
      callback: () => handleStartOverChat(),
    },
  ];

  const handleYesNoCommand = (type: string) => {
    if (!activateAssistant) {
      const lastItem = chatList[chatList.length - 1];
      const option = lastItem.options?.find((o: IMessage) => o.text === type);
      const optionId = option?.id;

      if (String(optionId) === chatNodeTypes.CHAT_BOT_END_NODE_ID) {
        handleChatBotTree(option);
        const timeOut = setTimeout(() => {
          if (!activateAssistant) setActivateAssistant(true);
        }, 1500);
        setTimeOutSubs((prev) => [...prev, timeOut]);
        return;
      }

      if (option) handleChatBotTree(option);
    }
  };

  const handleChooseLangCommand = (lang: string) => {
    if (!activateAssistant && chatList.length < 2) {
      i18next.changeLanguage(lang);
      const option = initChatList[0].options.filter(
        (o: IMessage) => o.lang === lang
      );

      if (option?.[0]) handleChatBotTree(option[0]);
    }
  };

  const handleAssistantRecognition = (message: string) => {
    if (activateAssistant && message) {
      dispatch(add({ text: message, type: "user" }));
      dispatch(getAssistantResThunk(message));
    }
  };

  const handleChatBotTree = (option: IMessage) => {
    dispatch(patchLastItemOptions({ newOptions: null }));

    if (option?.id && !activateAssistant) {
      dispatch(add({ text: option.text, type: "user", id: option.id }));
      dispatch(getChatBotNodeThunk(option.id));
    }
  };

  const handleStartOverChat = () => {
    window.location.reload();
  };

  const handleOptionClick = async (option: IMessage) => {
    if (option?.lang === chatNodeTypes.RU) i18next.changeLanguage("ru");
    if (option?.lang === chatNodeTypes.EN) i18next.changeLanguage("en");
    if (String(option?.id) === chatNodeTypes.CHAT_BOT_END_NODE_ID) {
      if (!activateAssistant) setActivateAssistant(true);
      handleChatBotTree(option);
      dispatch(patchLastItemOptions({ newOptions: null }));
      return;
    }

    handleChatBotTree(option);
  };

  useEffect(() => {
    const lang = getItem("i18nextLng");
    if (lang && botRes.id) {
      const originalUrl = botRes["audio_" + lang];
      const newBaseUrl = "https://adminagro.24mycrm.com";

      const modifiedUrl = originalUrl.replace(
        "http://10.118.50.31:7333",
        newBaseUrl
      );

      const { audio, audioPlayInstance } = handlePlaySound(modifiedUrl);

      audioPlayInstance.then(() => {
        const timeOut = setTimeout(() => {
          setStartListening(true);
        }, audio.duration * 1000);
        setTimeOutSubs((prev) => [...prev, timeOut]);
      });

      dispatch(
        addOptions({
          ...botRes,
          question: botRes["question_" + lang],
        })
      );
    }
  }, [botRes]);

  useEffect(() => {
    const { text, audio: audioUrl } = assistantRes;
    if (text) {
      const { audio, audioPlayInstance } = handlePlaySound(
        `${API_URL}/api/${audioUrl}`
      );

      audioPlayInstance.then(() => {
        const timeOut = setTimeout(() => {
          setStartListening(true);
        }, audio.duration * 1000);
        setTimeOutSubs((prev) => [...prev, timeOut]);
      });

      dispatch(add({ text, type: "assistant" }));
    }
  }, [assistantRes]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      scrollBottom(containerRef);
    }, 500);

    setTimeOutSubs((prev) => [...prev, timeOut]);

    return () => {
      timeOutSubs.map((s) => clearTimeout(s));
    };
  }, [chatList]);

  return (
    <div className={styles.wrapper}>
      <div className={styles["chat-wrapper"]}>
        <div className={styles["chat-list"]} ref={containerRef}>
          <div className="container">
            {chatList.length > 0 && (
              <ChatList
                chatList={chatList}
                loading={isLoading}
                onOptionClick={handleOptionClick}
              />
            )}
          </div>
        </div>

        <div className={cn(styles.control, "container")}>
          <SpeechRecognationComponent
            className="container"
            uploadAudioText={handleAssistantRecognition}
            loading={isLoading}
            startListening={startListening}
            onStop={() => setStartListening(false)}
            showTranscript={true}
            continuous={false}
            commands={commands}
          />

          {chatList.length > 1 && (
            <Button
              className={"primary"}
              onClick={handleStartOverChat}
              width="200px"
            >
              {t("Start over")}
            </Button>
          )}
        </div>
      </div>

      <div className={styles["iframe-wrapper"]}>
        <iframe
          src="https://e.customs.gov.kg/passenger-declaration"
          title="Website"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default Home;
