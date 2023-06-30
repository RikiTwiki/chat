import { IGetChatBotNodeResponse } from "shared/types/chatBot";
import { axiosClient } from "./api.config";
import { getItem } from "services/localStorage.service";
import { IAssistantResponse } from "shared/types/assistant";

const assistantChatApi = {
  getAssistantResponse: async (payload: string) => {
    let lang = getItem("i18nextLng");
    if (!lang) lang = "ru";

    const formData = new FormData();
    formData.set("text", payload);

    const response = await axiosClient.post<IAssistantResponse>(
      `/api/?lang=${lang}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getBinaryTreeAnswers: async (id: number) => {
    let lang = getItem("i18nextLng");
    if (!lang) lang = "ru";

    const response = await axiosClient.get<IGetChatBotNodeResponse>(
      `/api/${id}/?lang=${lang}`
    );
    return response.data;
  },
};

export default assistantChatApi;
