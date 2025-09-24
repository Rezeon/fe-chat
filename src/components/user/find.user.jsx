import { GitPullRequest, SearchCode } from "lucide-react";
import { userApi } from "../../api/user.api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function FindName({ setRes, create }) {
  const { findUser } = userApi();
  const [user, setUser] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (form.name === "") {
      setUser([]);
      return;
    }

    if (timer) clearTimeout(timer);

    const newTimer = setTimeout(async () => {
      try {
        const res = await findUser({ name: form.name.toLocaleLowerCase() });
        setUser(res.data || []);
      } catch (error) {
        toast.error(error.response?.data?.error || "User not found");
      }
    }, 800);
    setTimer(newTimer);
  }, [form.name]);

  const handleAdd = async (id) => {
    try {
      setRes(false);
      await create(Number(id));
      toast.success("Just got a friend");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add friend");
    }
    setForm({
      name: "",
    });
    setRes(true);
  };

  return (
    <>
      <div className="w-full bg-white border-gray-100 hover:border-2 hover:border-blue-400 flex items-center p-2">
        <div className="w-auto pr-2">
          <SearchCode size={16} color="gray" />
        </div>
        <input
          type="text"
          placeholder="Search user..."
          className="w-full focus:outline-none focus:ring-0 bg-white text-black"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <ul className="mt-2 space-y-2">
        {user?.map((u) => (
          <li
            key={u.id}
            className="w-full flex gap-3 relative items-center bg-white p-2 border border-gray-300 rounded"
          >
            <div className="w-[10%] border border-gray-400 aspect-square rounded-full flex items-center ">
              <img src={u?.profile} alt="" className="w-full" />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-gray-700">{u?.name}</p>
              <p className="text-xs text-gray-500">{u?.email}</p>
            </div>
            <div
              onClick={() => handleAdd(u.ID)}
              className="cursor-pointer absolute right-2 p-2 hover:bg-gray-100 rounded-full"
            >
              <GitPullRequest size={16} color="gray" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
