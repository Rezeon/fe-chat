import { SideBar } from "../components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

export default function LayOut() {
  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Content area */}
      <div className="flex flex-1">
        <SideBar />

        <main className="w-full custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
