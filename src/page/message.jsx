import { useState } from "react";
import { MessageFriend } from "../components/message/message.friend";
import { MessageContent } from "../components/message/message.page";
import { BookOpen } from "lucide-react";

export function MessagePage() {
  const [selectedUser, setSelectedUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full h-screen relative">
      <div
        className="absolute top-2 left-2 p-2 rounded border border-gray-200 bg-white aspect-square md:hidden cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <BookOpen size={20} color="gray" />
      </div>

      <div
        className={`${
          open ? "block" : "hidden"
        } md:block w-full md:w-[40%] h-screen p-2 border-r bg-white`}
      >
        <MessageFriend
          setSelectedUser={setSelectedUser}
          messages={messages}
          setOpenF={setOpen}
        />
      </div>

      <div
        className={`${
          open ? "hidden" : "block"
        } md:block w-full md:w-[60%] h-screen overflow-y-auto custom-scrollbar `}
      >
        <MessageContent
          messages={messages}
          selectedUser={selectedUser}
          setMessages={setMessages}
          setOpenF={setOpen}
        />
      </div>
    </div>
  );
}
