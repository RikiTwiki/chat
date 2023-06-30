import nextId from "react-id-generator";
import { chatNodeTypes } from "shared/constants/chat";
import { IMessage } from "shared/types/chatWithAssistant";
import { ReactComponent as IconRusFlag } from "assets/img/icons/russia-flag.svg";

const initChatList: IMessage[] = [
  {
    text: "Выберите язык / Choose language",
    type: "assistant",
    id: nextId(),
    options: [
      {
        text: "",
        type: "option",
        id: 2,
        lang: chatNodeTypes.EN,
        iconComponet: IconRusFlag,
      },
      {
        text: "",
        type: "option",
        id: 2,
        lang: chatNodeTypes.RU,
        iconComponet: IconRusFlag,
      },
    ],
  },
];

const startOverChat: IMessage = {
  id: nextId(),
  text: "Start over",
  type: "option",
  action: chatNodeTypes.START_OVER_CHAT,
};

const activateAssistant: IMessage = {
  id: nextId(),
  text: "Activate assistant",
  type: "option",
  action: chatNodeTypes.ACTIVATE_ASSISTANT,
};

export { initChatList, startOverChat, activateAssistant };
