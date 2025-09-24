import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./page/login";
import { RegisterPage } from "./page/register";
import { Middleware } from "./middleware/middleware";
import { Dashboard } from "./page/dashboard";
import LayOut from "./page/navbar";
import { MessagePage } from "./page/message";
import { PostPage } from "./page/posts";
import { User } from "./page/user";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<RegisterPage />} />
        <Route element={<Middleware />}>
          <Route element={<LayOut />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/message" element={<MessagePage />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/setting" element={<User />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
