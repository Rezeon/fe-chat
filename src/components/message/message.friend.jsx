import {
  GitPullRequest,
  MessageSquareCode,
  Trash2Icon,
  User,
  UserPlus2,
  UsersRoundIcon,
} from "lucide-react";
import { followApi } from "../../api/follow.api";
import { useContext, useEffect, useMemo, useState } from "react";
import LoadingPage from "../loading/loading";
import toast from "react-hot-toast";
import { FindName } from "../user/find.user";
import { useDB } from "../../utils/get.message";
import { useMe } from "../../utils/user";
import { WsContext } from "../../context/createcontext/context";

export function MessageFriend({ setSelectedUser, setOpenF, messages }) {
  const { followed, followers: folloe, deleteF, create } = followApi();
  const { getAll, saveAll } = useDB();
  const { followeds, setFolloweds } = useContext(WsContext);
  const user = useMe();
  const [follower, setFollowers] = useState();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState("");

  useEffect(() => {
    async function fetchFollower() {
      try {
        const res = await followed();
        setFollowers(res.data.following);
        const local = await getAll("follows");
        if (local.length > 0) {
          setFolloweds(local);
          return;
        } else {
          const resd = await folloe();
          setFolloweds(resd.data.followers);
          saveAll("follows", resd.data.followers);
          setLoading(true);
        }
      } catch (error) {
        toast.error("you dont have follower", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    fetchFollower();
  }, []);

  const handleDel = async (id) => {
    if (!id || id === 0) {
      toast.error("Invalid friend ID");
      return;
    }
    try {
      await deleteF(id);
      toast.success("friend deleted");
    } catch (error) {
      toast.error("err", error);
    }
  };
  const handleMessage = (id) => {
    const res = follower.find((f) => f.Followed.ID === Number(id)).Followed;
    setSelectedUser(res);
  };
  const handleAdd = async (id) => {
    try {
      const res = await create(Number(id));
      toast.success("Just got a friend");
      setFollowers((prev) => [...prev, { Followed: res.data }]);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add friend");
    }
  };

  const mutualFriends = useMemo(
    () =>
      follower?.filter((f) =>
        followeds?.some((ff) => ff.Follower.ID === f.Followed.ID)
      ),
    [follower, followeds]
  );
  const wantFriends = useMemo(() => {
    if (!followeds || !follower) return [];

    return followeds.filter((f) => {
      const targetId = f.Follower?.ID;

      if (targetId === user.ID) return false;

      const alreadyMutual = follower.some((ff) => ff.Followed?.ID === targetId);

      return !alreadyMutual;
    });
  }, [followeds, follower]);

  const lastMessage = (id, fallback) => {
    const msgs = messages?.filter(
      (m) => m.receiver_id === id || m.sender_id === id
    );

    if (!msgs || msgs.length === 0) {
      return fallback;
    }

    const last = msgs.reduce((latest, current) =>
      new Date(current.CreatedAt) > new Date(latest.CreatedAt)
        ? current
        : latest
    );

    return last.content || fallback;
  };
  const lastMessageTime = (id) => {
    const msgs = messages?.filter(
      (m) => m.receiver_id === id || m.sender_id === id
    );

    if (!msgs || msgs.length === 0) {
      return null;
    }

    const last = msgs.reduce((latest, current) => {
      return new Date(current.CreatedAt) > new Date(latest.CreatedAt)
        ? current
        : latest;
    });

    return new Date(last.CreatedAt);
  };

  const sortedFriends = useMemo(() => {
    if (!mutualFriends) return [];

    return [...mutualFriends].sort((a, b) => {
      const timeA = lastMessageTime(a.Followed.ID) || new Date(0);
      const timeB = lastMessageTime(b.Followed.ID) || new Date(0);

      return timeB - timeA;
    });
  }, [mutualFriends, messages]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingPage />
      </div>
    );
  }
  return (
    <div>
      <div className="w-full h-auto flex gap-2 justify-end ">
        <div
          onClick={() => setOpen(open === "friendlist" ? "" : "friendlist")}
          className="w-[8%] md:w-[6%] mb-2 bg-gray-200 aspect-square cursor-pointer hover:bg-gray-300 p-1 rounded flex items-center justify-center "
        >
          <UsersRoundIcon size={25} color="gray" />
        </div>
        <div
          onClick={() => setOpen(open === "addfriend" ? "" : "addfriend")}
          className="w-[8%] md:w-[6%] relative mb-2 bg-gray-200 aspect-square cursor-pointer hover:bg-gray-300 p-1 rounded flex items-center justify-center "
        >
          <UserPlus2 size={25} color="gray" />
          {wantFriends?.length > 0 && (
            <div className="text-white absolute -top-1 -right-1 text-[11px] flex items-center justify-center aspect-square w-[15px] rounded-full bg-red-600 ">
              {wantFriends?.length}
            </div>
          )}
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open === "friendlist"
            ? "max-h-[500px] opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95"
        }`}
      >
        <FindName create={create} />
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open === "addfriend"
            ? "max-h-[500px] opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95"
        }`}
      >
        {wantFriends?.length > 0 ? (
          wantFriends?.map((f) => (
            <li
              key={f.ID}
              className="w-full flex gap-3 relative items-center bg-white p-2 border border-gray-300 rounded"
            >
              <div className="flex items-center gap-3">
                {f.Follower?.profile ? (
                  <img
                    className="size-10 rounded-full"
                    src={f.Follower.profile}
                    alt={f.Follower.name}
                  />
                ) : (
                  <div className="size-10 flex items-center justify-center bg-gray-200 rounded-full">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-500 ">
                    {f.Follower?.name}
                  </div>
                  <div className="text-xs text-gray-400 uppercase font-semibold opacity-60">
                    {f.Follower?.email}
                  </div>
                </div>
              </div>
              <div
                onClick={() => handleAdd(f.Follower.ID)}
                className="cursor-pointer absolute right-2 p-2 hover:bg-gray-100 rounded-full"
              >
                <GitPullRequest size={16} color="gray" />
              </div>
            </li>
          ))
        ) : (
          <p className="p-2 text-gray-500">
            No one to be your freinds right now
          </p>
        )}
      </div>
      <ul className="list text-gray-800 gap-2 ">
        {sortedFriends.length > 0 ? (
          sortedFriends.map((f) => (
            <li
              key={f.ID}
              className="list-row flex relative items-center border border-gray-200 justify-between gap-3 p-2 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                {f.Followed?.profile ? (
                  <img
                    className="size-10 rounded-full"
                    src={f.Followed.profile}
                    alt={f.Followed.name}
                  />
                ) : (
                  <div className="size-10 flex items-center justify-center bg-gray-200 rounded-full">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-semibold">{f.Followed?.name}</div>
                  <div className="text-xs font-semibold opacity-60">
                    {lastMessage(f.Followed.ID, f.Followed.email)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDel(f.Followed.ID)}
                className="absolute right-16 btn btn-square btn-ghost"
              >
                <Trash2Icon size={20} color="gray" />
              </button>
              <button
                onClick={() => {
                  handleMessage(f.Followed.ID);
                  setOpenF(false);
                }}
                className="absolute right-2 btn btn-square btn-ghost"
              >
                {lastMessage(f.Followed.ID) && (
                  <div className="w-[10%] aspect-square absolute rounded-full bg-red-600 -top-1 -right-1" />
                )}
                <MessageSquareCode size={20} color="gray" />
              </button>
            </li>
          ))
        ) : (
          <p className="p-2 text-gray-500">No followers found</p>
        )}
      </ul>
    </div>
  );
}
