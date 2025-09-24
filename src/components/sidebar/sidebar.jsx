import { BookImage, LogOut, MessageSquareCode, UserCog } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePage = async (s) => {
    switch (s) {
      case "message":
        return navigate("/message");
      case "setting":
        return navigate("/setting");
      case "logout":
        indexedDB.deleteDatabase("AppDb");
        await localStorage.removeItem("token");
        return navigate("/sign-in");
      case "post":
        return navigate("/post");
      default:
        return "message";
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-[10%] sm:w-[10%] relative md:w-[4.5%] p-2 bg-white h-screen shadow flex flex-col gap-4 justify-start items-center">
      <div
        onClick={() => handlePage("message")}
        className={`w-full flex p-1 md:p-2 justify-center items-center transition-all cursor-pointer rounded-2xl aspect-square 
          ${isActive("/message") ? "bg-gray-100 text-white" : "bg-white"}`}
      >
        <MessageSquareCode
          color={isActive("/message") ? "#3da2e1" : "gray"}
          className="w-12 h-12 sm:w-12 sm:h-12 md:w-8 md:h-8 lg:w-7 lg:h-7"
        />
      </div>

      <div
        onClick={() => handlePage("post")}
        className={`w-full flex p-1 md:p-2 justify-center items-center transition-all cursor-pointer rounded-2xl aspect-square 
          ${isActive("/post") ? "bg-gray-100 text-white" : "bg-white"}`}
      >
        <BookImage
          color={isActive("/post") ? "#3da2e1" : "gray"}
          className="w-12 h-12 sm:w-12 sm:h-12 md:w-8 md:h-8 lg:w-7 lg:h-7"
        />
      </div>

      <div
        onClick={() => handlePage("setting")}
        className={`w-full flex p-1 md:p-2 justify-center items-center transition-all cursor-pointer rounded-2xl aspect-square 
          ${isActive("/setting") ? "bg-gray-100 text-white" : "bg-white"}`}
      >
        <UserCog
          color={isActive("/setting") ? "#3da2e1" : "gray"}
          className="w-12 h-12 sm:w-12 sm:h-12 md:w-8 md:h-8 lg:w-7 lg:h-7"
        />
      </div>

      <div
        onClick={() => handlePage("logout")}
        className="w-full border absolute bottom-1 flex p-1 md:p-2 justify-center items-center cursor-pointer hover:bg-red-200"
      >
        <LogOut
          color="black"
          className="w-12 h-12 sm:w-12 sm:h-12 md:w-8 md:h-8 lg:w-7 lg:h-7"
        />
      </div>
    </div>
  );
}
