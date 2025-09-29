import { useContext, useEffect, useState } from "react";
import { useDB } from "../../utils/get.message";
import { postApi } from "../../api/post.api";
import { useMe } from "../../utils/user";
import toast from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";
import { WsContext } from "../../context/createcontext/context";

export function PostContent() {
  const { getAllPost, update, deleted } = postApi();
  const { getAll, saveAll } = useDB();
  const user = useMe();
  const {post, setPosts} = useContext(WsContext)
  const [friend, setFriend] = useState([]);
  const [editPost, setEditPost] = useState(null);
  console.log("s", post)
  const [form, setForm] = useState({
    content: "",
    image: null,
  });
  useEffect(() => {
    async function loadMessages() {
      const local = await getAll("follows");
      setFriend(local || []);
    }
    loadMessages();
  }, [getAll]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const localMsgs = await getAll("posts");
        if (localMsgs.length > 0) {
          setPosts(localMsgs);
        } else {
          const res = await getAllPost();
          setPosts(res.data);
          saveAll("posts", res.data);
        }
      } catch {
        setPosts([]);
      }
    }
    fetchPosts();
  }, [getAll]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("content", form.content);
    if (form.image) {
      fd.append("image", form.image);
    }

    try {
      await update(editPost, fd);
      toast.success("Post updated");
      setEditPost(null);
      setForm({ content: "", image: null });
    } catch (error) {
      toast.error(error.message || "Gagal update post");
    }
  };
  const handleDelete = async () => {
    try {
      await deleted(editPost);
      toast.success("Post deleted");
    } catch (error) {
      toast.error("e", error);
    }
  };
  return (
    <>
      {post.filter((p) => friend.some((pp) => pp.follower_id === p.user_id || pp.followed_id === p.user_id))
        .map((p) => (
          <div
            key={p.ID}
            className="card text-gray-700 bg-white w-full max-w-lg shadow-sm mb-4"
          >
            {editPost === p.ID ? (
              <form onSubmit={handleSubmit} className="card-body space-y-2">
                <input
                  type="text"
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Edit content..."
                  className="input input-bordered border border-gray-200 bg-white w-full"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, image: e.target.files[0] }))
                  }
                  className="file-input file-input-bordered border border-gray-200 bg-white w-full"
                />
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
                <div className="w-full flex items-center gap-2">
                  <button
                    type="button"
                    className="btn text-white bg-gray-600 btn-ghost"
                    onClick={() => setEditPost(null)}
                  >
                    Cancel
                  </button>
                  <div
                    className="btn flex items-center justify-center bg-red-600 btn-ghost"
                    onClick={() => handleDelete()}
                  >
                    <Trash2 size={20} color="white" />
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="card-body relative p-2">
                  <h2 className="card-title">{p?.User?.name}</h2>
                  <p>{p?.content}</p>
                  {user?.ID === p?.User?.ID && (
                    <div
                      className="absolute right-1 top-1 "
                      onClick={() => {
                        setEditPost(p.ID);
                        setForm({ content: p.content, image: null });
                      }}
                    >
                      <Edit size={20} />
                    </div>
                  )}
                </div>
                {p?.image && (
                  <figure>
                    <img
                      src={p.image}
                      alt="post"
                      className="w-full rounded-b-lg"
                    />
                  </figure>
                )}
              </>
            )}
          </div>
        ))}
    </>
  );
}
