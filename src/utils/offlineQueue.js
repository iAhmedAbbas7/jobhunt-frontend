// <= IMPORTS =>
import { createStore, get, set, del } from "idb-keyval";

// <= CREATING A DEDICATED DATABASE FOR OUTBOX CHAT MESSAGES =>
const store = createStore("jobhunt-db", "outbox");

// <= ADDING MESSAGE TO THE QUEUE LIST =>
export const enqueue = async (msg) => {
  const queue = (await get("queue", store)) || [];
  queue.push(msg);
  await set("queue", queue, store);
};

// <= DELETING MESSAGE FROM QUEUE LIST =>
export const deleteFromQueue = async (id) => {
  const queue = (await get("queue", store)) || [];
  const filtered = queue.filter((m) => m._id !== id);
  await set("queue", filtered, store);
};

// <= UPDATING SU=INGLE MESSAGE IN THE QUEUE LIST =>
export const updateInQueue = async (id, updates) => {
  const queue = (await get("queue", store)) || [];
  const updated = queue.map((msg) =>
    msg._id === id ? { ...msg, ...updates } : msg
  );
  await set("queue", updated, store);
};

// <= CLEARING QUEUE MESSAGES WHEN THEY ARE SENT =>
export const dequeueAll = async () => {
  const queue = (await get("queue", store)) || [];
  await del("queue", store);
  return queue;
};
