import { useEffect, useRef, useState } from "react";
import { WsSetting } from "../utils/ws.utils";
import { useDB } from "../utils/get.message";
import { WsContext } from "./createcontext/context";

export const WsProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [followeds, setFolloweds] = useState([])
  const [post, setPosts] = useState([])
  const EventMessage = [
  {
    db: "posts",
    created: "post_created",
    update: "post_updated",
    deleted: "post_deleted",
    setF: setPosts
  },
  {
    db: "follows",
    created: "follow_created",
    update: "follow_updated",
    deleted: "follow_deleted",
    setF: setFolloweds
  },
  {
    db: "messages",
    created: "message_created",
    update: "message_updated",
    deleted: "message_deleted",
    setF: setMessages
  },
];
  const wsRef = useRef(null);
  const { saveAll } = useDB();
  useEffect(() => {
    WsSetting({
      wsRef:wsRef,
      saveAll:saveAll,
      EventMessage,
    });
  }, []);
  
  return <WsContext.Provider value={{ messages, post, followeds, setMessages, setFolloweds, setPosts }}>{children}</WsContext.Provider>;
};
