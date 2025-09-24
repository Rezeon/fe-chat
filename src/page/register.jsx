import { MessagesSquare } from "lucide-react";
import { useState } from "react";
import { userApi } from "../api/user.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { signUp } = userApi();
  const handlePage = () => {
    return navigate("/sign-in");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await signUp(form);
      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Register Success 🎉");
      } else {
        toast.error("No token received from server");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Username or password wrong");
    } finally {
      setLoading(false);
    }
    return navigate("/");
  };

  return (
    <div className="w-full h-svh flex items-center justify-center relative text-black">
      <div className="card w-auto p-6 shadow-2xl rounded-2xl">
        <form
          onSubmit={handleSubmit}
          className="card-body flex flex-col gap-6 justify-center items-start"
        >
          <div className="w-full flex items-center flex-col-reverse gap-2 mb-4">
            <p className="text-2xl font-bold">Welcome to Message Square</p>
            <MessagesSquare size={40} className="text-blue-500" />
          </div>

          <div className="relative w-full">
            <input
              type="text"
              required
              placeholder=" "
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="peer input input-bordered w-full placeholder-transparent bg-white
                         focus:outline-none focus:ring-0 focus:border-2 border-2 border-gray-600 "
            />
            <label
              className={`absolute -translate-y-1/2 px-1 z-10  transition-all font-semibold
                         ${
                           form?.name
                             ? "top-0 text-gray-400 bg-white border-r-2 border-l-2 border-gray-600 -base text-sm left-3 peer-focus:text-blue-500"
                             : "left-3 top-1/2 z-1  text-gray-500"
                         }`}
            >
              Name
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="email"
              required
              placeholder=" "
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="peer input input-bordered w-full placeholder-transparent bg-white
                         focus:outline-none focus:ring-0 focus:border-2 border-2 border-gray-600 "
            />
            <label
              className={`absolute -translate-y-1/2 px-1 z-10  transition-all font-semibold
                         ${
                           form?.email
                             ? "top-0 text-gray-400 bg-white border-r-2 border-l-2 border-gray-600 -base text-sm left-3 peer-focus:text-blue-500"
                             : "left-3 top-1/2 z-1  text-gray-500"
                         }`}
            >
              Email
            </label>
          </div>

          <div className="relative w-full">
            <input
              type="password"
              required
              placeholder=" "
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="peer input input-bordered w-full placeholder-transparent bg-white
                         focus:outline-none focus:ring-0 focus:border-2 border-2 border-gray-600 "
            />
            <label
              className={`absolute -translate-y-1/2 px-1 z-10  transition-all font-semibold
                         ${
                           form?.password
                             ? "top-0 text-gray-400 bg-white border-r-2 border-l-2 border-gray-600 -base text-sm left-3 peer-focus:text-blue-500"
                             : "left-3 top-1/2 z-1  text-gray-500"
                         }`}
            >
              Password
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer input input-bordered w-full placeholder-transparent bg-white
                         focus:outline-none focus:ring-0 focus:border-2 border-2 border-gray-600 "
            />
            <label
              className={`absolute -translate-y-1/2 px-1 z-10  transition-all font-semibold
                         ${
                           confirmPassword
                             ? "top-0 text-gray-400 bg-white border-r-2 border-l-2 border-gray-600 -base text-sm left-3 peer-focus:text-blue-500"
                             : "left-3 top-1/2 z-1  text-gray-500"
                         }`}
            >
              Confirm Password
            </label>
          </div>

          <div className=" w-full flex flex-col gap-2">
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "Sign-Up..." : "Sign-Up"}
            </button>
            <button onClick={() => handlePage()} className="btn btn-outline">
              Login?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
