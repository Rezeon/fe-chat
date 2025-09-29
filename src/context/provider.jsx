import { WsProvider } from "./ws.context";

export function ProviderContext({ children }) {
  return (<WsProvider>{children}</WsProvider>)
}
