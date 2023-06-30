import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IinitialState } from "./chat.interface";
import { initChatList } from "utils/chatScripts";
import { IMessage } from "shared/types/chatWithAssistant";
import nextId from "react-id-generator";
import assistantChatApi from "shared/api/chat";
import { getApiErrorMessage } from "utils/utils";
const { getBinaryTreeAnswers, getAssistantResponse } = assistantChatApi;

const initialState: IinitialState = {
  list: initChatList,
  bot: {
    audio_ru: "",
    audio_en: "",
    id: 0,
    no: 0,
    question_ru: "",
    yes: 0,
    question_en: "",
  },
  assistant: {
    audio: "",
    text: "",
  },
  isLoading: false,
  error: "",
  isSplitScreenActivated: false,
};

export const getChatBotNodeThunk = createAsyncThunk(
  "chat/getChatBotNode",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getBinaryTreeAnswers(id);
      return response;
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err));
    }
  }
);

export const getAssistantResThunk = createAsyncThunk(
  "chat/getAssistantRes",
  async (message: string, { rejectWithValue }) => {
    try {
      const response = await getAssistantResponse(message);
      return response;
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err));
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    add: (state, { payload }) => {
      const { text, type, id = nextId() } = payload;
      const newItem: IMessage = { type, text, id };
      state.list = [...state.list, newItem];
    },

    addOptions: (state, { payload }) => {
      const { yes, no, id, question } = payload;
      const newItem: IMessage = {
        text: question,
        id,
        type: "assistant",
      };

      if (yes && no) {
        newItem.options = [
          { id: yes, text: "Yes", type: "option" },
          { id: no, text: "No", type: "option" },
        ];
      }

      state.list = [...state.list, newItem];
    },

    patchLastItemOptions: (state, { payload }) => {
      const { newOptions } = payload;
      const lastIndex = state.list.length - 1;
      const newList = state.list.map((item, idx) => {
        return lastIndex === idx ? { ...item, options: newOptions } : item;
      });

      state.list = newList;
    },

    reset: (state) => {
      state.list = initChatList;
    },

    setIsSplitScreenActivated: (state, { payload }) => {
      state.isSplitScreenActivated = payload;
    },
  },

  extraReducers(builder) {
    builder.addCase(getChatBotNodeThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getChatBotNodeThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      if (payload) state.bot = payload;
    });

    builder.addCase(getChatBotNodeThunk.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = state.error;
      const newItem: IMessage = {
        text: "Error, can you repeat it?",
        type: "error",
      };
      state.list = [...state.list, newItem];
    });

    builder.addCase(getAssistantResThunk.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAssistantResThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      if (payload) state.assistant = payload;
    });

    builder.addCase(getAssistantResThunk.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = state.error;
      const newItem: IMessage = {
        text: "Error, can you repeat it?",
        type: "error",
      };
      state.list = [...state.list, newItem];
    });
  },
});

export const {
  add,
  addOptions,
  patchLastItemOptions,
  reset,
  setIsSplitScreenActivated,
} = chatSlice.actions;
export default chatSlice.reducer;
