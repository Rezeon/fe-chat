export function closeWs(wsRef) {
  if (
    wsRef.current &&
    (wsRef.current.readyState === WebSocket.OPEN ||
      wsRef.current.readyState === WebSocket.CONNECTING)
  ) {
    wsRef.current.close();
    wsRef.current = null;
    console.log("WebSocket closed on logout");
  }
}
