import {
  MessageSquareCode,
  MoonStarIcon,
  PlusSquare,
  SendHorizontalIcon,
  Settings2,
  User,
  Trash,
  StepBack,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { messageApi } from "../../api/message.api";
import toast from "react-hot-toast";
import { useDB } from "../../utils/get.message";
import { WsSetting } from "../../utils/ws.utils";

export function MessageContent({ messages, selectedUser, setMessages, setOpenF }) {
  const { create, messageById, update, deleted } = messageApi();
  const { getAll, saveAll } = useDB();
  const messagesEndRef = useRef(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const wsRef = useRef(null);
  const [form, setForm] = useState({
    content: "",
    image: null,
  });
  useEffect(() => {
    if (editMessageId) {
      const edit = messages.find((m) => m.ID === editMessageId);
      if (edit) {
        setForm({
          content: edit.content,
          image: edit.image || null,
        });
      }
    } else {
      setForm({ content: "", image: null });
    }
    setEditMessageId(null);
  }, [editMessageId, messages]);

  const handleDelete = async (id) => {
    try {
      await deleted(id);
      toast.success("Message deleted");

      setMessages((prev) => prev.filter((m) => m.ID !== id));
    } catch (error) {
      toast.error("err", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      toast.error("Gezzs bro can you write?");
      return;
    }

    const fd = new FormData();
    fd.append("content", form.content);
    fd.append("receiver_id", String(selectedUser.ID));
    if (form.image) {
      fd.append("image", form.image);
    }

    try {
      if (editMessageId) {
        await update(editMessageId, fd);
        setEditMessageId(null);
      } else {
        await create(fd);
      }
      setEditMessageId(null);
      setForm({ content: "", image: null });
    } catch (error) {
      toast.error("Gagal kirim pesan");
      console.log(error.response?.data || error.message);
    }
  };
  useEffect(() => {
    async function fetchMessages() {
      try {
        const localMsgs = await getAll("messages");
        if (
          localMsgs.length > 0 &&
          localMsgs.find((m) => m.receiver_id === selectedUser.ID)
        ) {
          setMessages(localMsgs);
          return;
        } else {
          const res = await messageById(selectedUser.ID);
          setMessages(res.data);
          saveAll("messages", res.data);
        }
      } catch (error) {
        setMessages([]);
      }
    }
    if (selectedUser?.ID) {
      fetchMessages();
    }
  }, [selectedUser]);
  useEffect(() => {
    if (!selectedUser?.ID) return;
    WsSetting({
      wsRef: wsRef,
      db: "messages",
      created: "message_created",
      update: "message_updated",
      deleted: "message_deleted",
      saveAll,
      setF: [setMessages],
    });
    return () => {
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING)
      ) {
        wsRef.current.close();
        console.log("WebSocket closed");
      }
    };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser?.ID) {
    return (
      <div className="w-full text-gray-500 gap-3 flex-col text-4xl h-screen justify-center items-center flex bg-white">
        <p>Select friend to chit chat zzz</p>
        <MoonStarIcon size={50} color="gray" />
      </div>
    );
  }

  return (
    <div className="relative h-screen text-gray-400 flex flex-col justify-end">
      <div className="w-full absolute top-0 flex items-center gap-2 bg-white shadow border border-gray-100 p-2">
        <div onClick={() => setOpenF(true)} className="w-auto md:hidden flex p-1 aspect-square cursor-pointer ">
          <StepBack size={15} color="gray" />
        </div>
        {selectedUser?.profile ? (
          <img
            className="size-10 ml-1 rounded-full"
            src={selectedUser.profile}
            alt={selectedUser.name}
          />
        ) : (
          <div className="size-10 ml-1 flex items-center justify-center bg-gray-200 rounded-full">
            <User size={20} className="text-gray-500" />
          </div>
        )}
        <div>
          <p className="text-gray-700 text-xl">{selectedUser?.name}</p>
          <p className="text-sm text-gray-500">{selectedUser?.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-16 p-3 overflow-y-auto custom-scrollbar">
        {messages
          .filter((m) => m.receiver_id === selectedUser.ID)
          .map((msg, idx) => (
            <div
              key={idx}
              className={`chat ${
                msg.sender_id === selectedUser.ID ? "chat-start" : "chat-end"
              }`}
            >
              <div className="chat-bubble bg-blue-500 text-white">
                {msg?.image && (
                  <div className="w-full flex items-center rounded-2xl mb-2">
                    <img
                      src={msg.image}
                      alt="message attachment"
                      className="max-h-40 w-full object-cover rounded-lg border border-gray-400"
                    />
                  </div>
                )}

                <div className="flex flex-col">
                  <p>{msg.content}</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    {editMessageId === msg.ID && (
                      <Trash
                        size={15}
                        color="white"
                        className="cursor-pointer"
                        onClick={() => handleDelete(msg.ID)}
                      />
                    )}
                    <span className="text-xs text-gray-200">
                      {new Date(msg.CreatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {msg?.UpdatedAt !== msg.CreatedAt && <p>(edit)</p>}
                    </span>
                    <Settings2
                      size={15}
                      color="white"
                      className="cursor-pointer"
                      onClick={() =>
                        setEditMessageId(editMessageId ? null : msg.ID)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 p-3 gap-1 w-full h-auto bg-white shadow flex flex-col">
        {form.image && (
          <div className="w-full flex justify-center items-center mb-2">
            <img
              src={
                form.image instanceof File
                  ? URL.createObjectURL(form.image)
                  : form.image
              }
              alt="preview"
              className="max-h-40 rounded-lg"
            />
          </div>
        )}
        <div className="w-full flex gap-1 h-[60px] p-3 ">
          <div className="hidden md:flex md:w-[5%] p-2 aspect-square justify-center items-center">
            <MessageSquareCode size={30} color="gray" />
          </div>

          <div className="md:w-[5%]  w-[10%]  p-2 bg-blue-500 hover:bg-blue-400 rounded-full aspect-square flex justify-center items-center relative">
            <PlusSquare size={30} color="white" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full relative flex bg-gray-300 rounded-2xl hover:bg-gray-200 text-black "
          >
            <input
              type="text"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full h-full p-3 placeholder:text-gray-500 border-none focus:outline-none focus:ring-0"
              placeholder="Send Message"
            />
            <button
              type="submit"
              className="h-full p-4 shadow hover:bg-blue-300 transition-all ease-in-out duration-150 absolute bg-blue-600 rounded-r-full right-0 flex justify-center items-center aspect-square"
            >
              <SendHorizontalIcon size={24} color="white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
