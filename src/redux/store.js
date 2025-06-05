// <= IMPORTS =>
import jobSlice from "./jobSlice";
import chatSlice from "./chatSlice";
import authSlice from "./authSlice";
import companySlice from "./companySlice";
import articleSlice from "./articleSlice";
import storage from "redux-persist/lib/storage";
import applicationSlice from "./applicationSlice";
import notificationSlice from "./notificationSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// <= REDUX-PERSIST =>
const persistConfig = {
  key: "JobHunt",
  version: 1,
  storage,
};

// <= APPLICATION-REDUCERS =>
const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice,
  company: companySlice,
  application: applicationSlice,
  notification: notificationSlice,
  chat: chatSlice,
  article: articleSlice,
});

// <= REDUX-PERSIST =>
const persistedReducer = persistReducer(persistConfig, rootReducer);

// <= STORE WITH PERSISTENCE CONFIGURATION =>
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
