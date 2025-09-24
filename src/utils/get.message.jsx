import { useCallback } from "react";
import openDB from "./db.browser";

const STORES = ["messages", "follows", "posts"];

export function useDB() {
  const getAll = useCallback(async (storeName) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, []);

  const saveAll = useCallback(async (storeName, items) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);

      items.forEach((item) => store.put(item));

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }, []);

  const clearAll = useCallback(async (storeName) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);

      store.clear();

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }, []);

  return { getAll, saveAll, clearAll, STORES };
}
