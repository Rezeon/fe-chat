export function  WsSetting({
  wsRef,
  db,
  created,
  update,
  deleted,
  saveAll,
  setF = [],
}) {
  const ws = new WebSocket(import.meta.env.VITE_WS_URL);
  wsRef.current = ws;
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    const updateAllStates = (callback) => {
      setF.forEach((fn) => {
        if (typeof fn === "function") {
          fn(callback);
        }
      });
    };

    if (msg.event === created) {
      updateAllStates((prev) => {
        const updated = [...prev, msg.data];
        saveAll(db, updated);
        return updated;
      });
    }

    if (msg.event === update) {
      updateAllStates((prev) => {
        const updated = prev.map((m) => (m.ID === msg.data.ID ? msg.data : m));
        saveAll(db, updated);
        return updated;
      });
    }

    if (msg.event === deleted) {
      updateAllStates((prev) => {
        const updated = prev.filter((m) => m.ID !== msg.data.ID);
        saveAll(db, updated);
        return updated;
      });
    }
  };

  return () => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      wsRef.current.close();
      console.log(" WebSocket closed");
    }
  };
}
