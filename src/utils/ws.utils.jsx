export function WsSetting({ user, EventMessage, wsRef, saveAll }) {
  const token = localStorage.getItem("token");
  const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
  wsRef.current = ws;

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    console.log("s", msg)

    EventMessage.map((e) => {
      const updateAllStates = (callback) => {
        if (typeof e.setF === "function") {
          e.setF(callback);
        }
      };
      if (msg.event === e.created) {
        updateAllStates((prev) => {
          const updated = [...prev, msg.data];
          saveAll(e.db, updated);
          return updated;
        });
      }

      if (msg.event === e.update) {
        updateAllStates((prev) => {
          const updated = prev.map((m) =>
            m.ID === msg.data.ID ? msg.data : m
          );
          saveAll(e.db, updated);
          return updated;
        });
      }

      if (msg.event === e.deleted) {
        updateAllStates((prev) => {
          const updated = prev.filter((m) => m.ID !== msg.data.ID);
          saveAll(e.db, updated);
          return updated;
        });
      }
    });
  };
}
