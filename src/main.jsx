// <= IMPORTS =>
import "./index.css";
import React from "react";
import App from "./App.jsx";
import store from "./redux/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { persistStore } from "redux-persist";
import { Toaster } from "./components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";
import { ChatSocketProvider } from "./context/ChatSocketContext";

// <= REDUX-PERSIST =>
const persistor = persistStore(store);

// <= SELECTING THE ROOT ELEMENT =>
const rootElement = document.getElementById("root");

// <= CREATING THE ROOT ELEMENT =>
const root = ReactDOM.createRoot(rootElement);

// <= RENDERING THE APP =>
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChatSocketProvider>
          <App />
        </ChatSocketProvider>
      </PersistGate>
    </Provider>
    <Toaster position="bottom-left" />
  </React.StrictMode>
);
