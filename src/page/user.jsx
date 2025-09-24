import { useEffect, useState } from "react";
import { useMe } from "../utils/user";
import { userApi } from "../api/user.api";
import { User2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function User() {
  const user = useMe();
  const { updateUser, me, deleteUser } = userApi();
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || "",
    password: "",
    profile: null,
  });
  const [preview, setPreview] = useState(form?.profile || null);
  useEffect(() => {
    async function fetch() {
      try {
        const res = await me();
        setForm({
          name: res.data.name,
          profile: res.data.profile,
        });
        console.log(res.data);
      } catch (error) {
        toast.error("err", error);
      }
    }
    fetch();
  }, []);
  console.log(form);
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, profile: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (name) {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.ID);
      toast.success("user deleted");
      navigate("/sign-up")
    } catch (error) {
      toast.error("err", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    if (form.name) fd.append("name", form.name);
    fd.append("email", user.email);
    if (!form.password === "") fd.append("password", form.password);
    if (form.profile) fd.append("profile", form.profile);

    try {
      await updateUser(user.ID, fd);
      toast.success("Profile updated!");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-2 mb-3">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white flex flex-col items-start rounded-2xl shadow h-screen p-2 gap-2 pb-4"
      >
        <div className="w-full flex justify-center">
          <div className="w-[20%] border-2 shadow border-gray-500 aspect-square rounded-full flex items-center justify-center bg-gray-100">
            {form.profile ? (
              <img
                className="w-full h-full rounded-full object-cover"
                src={form.profile}
                alt="profile"
              />
            ) : (
              <User2Icon size={100} className="text-gray-400" />
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          <input
            type="file"
            name="profile"
            onChange={handleChange}
            className="file-input bg-white text-gray-600 border border-gray-500"
          />
        </div>

        <fieldset className="fieldset text-gray-800 flex flex-col">
          <label className="text-xl font-semibold text-black">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input bg-white border-black"
            placeholder="Type here"
          />
        </fieldset>

        <fieldset className="fieldset text-gray-800 flex flex-col">
          <label className="text-xl font-semibold text-black">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input bg-white border-black"
            placeholder="Type here"
            autoComplete="new-password"
          />
        </fieldset>

        <button type="submit" className="btn btn-primary mt-2 w-full">
          Update Profile
        </button>
        <button onClick={handleDelete} className="btn bg-red-500 ">
          Delete
        </button>
      </form>
    </div>
  );
}
