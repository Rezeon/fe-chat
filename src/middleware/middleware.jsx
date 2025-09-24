import { Navigate, Outlet } from "react-router-dom";
import LoadingPage from "../components/loading/loading";

export function Middleware() {
    const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
}