import { IAssistantResponse } from "shared/types/assistant";
import { IGetChatBotNodeResponse } from "shared/types/chatBot";
import { IMessage } from "shared/types/chatWithAssistant";

export interface IinitialState {
  list: IMessage[];
  bot: IGetChatBotNodeResponse;
  assistant: IAssistantResponse;
  isLoading: boolean;
  error: string;
  isSplitScreenActivated?: boolean;
}
