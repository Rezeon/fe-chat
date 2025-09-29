import { useState } from "react";
import { postApi } from "../../api/post.api";
import toast from "react-hot-toast";
import { MessageSquareCode, PlusSquare, SendHorizonal } from "lucide-react";

export function PostInput() {
  const { create } = postApi();
  const [form, setForm] = useState({
    content: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      toast.error("Gezzs bro can you write?");
      return;
    }

    const fd = new FormData();
    fd.append("content", form.content);
    if (form.image) {
      fd.append("image", form.image);
    }

    try {
      await create(fd);
      setForm({ content: "", image: null });
    } catch (error) {
      toast.error("Gagal kirim Post");
      console.log(error.response?.data || error.message);
    }
  };
  return (
    <div className="absolute bottom-0 left-0 w-full z-50 gap-2 bg-white shadow flex flex-col">
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
            placeholder="Send Posts"
          />
          <button
            type="submit"
            className="h-full p-4 shadow hover:bg-blue-300 transition-all ease-in-out duration-150 absolute bg-blue-600 rounded-r-full right-0 flex justify-center items-center aspect-square"
          >
            <SendHorizonal size={24} color="white" />
          </button>
        </form>
      </div>
    </div>
  );
}
