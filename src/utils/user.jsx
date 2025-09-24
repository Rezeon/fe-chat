import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userApi } from "../api/user.api";
import { useDB } from "./get.message";

export function useMe() {
  const { me } = userApi();
  const { getAll, saveAll } = useDB();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const logs = await getAll("me");

        if (logs.length > 0) {
          setUser(logs[0]);
        } else {
          const res = await me();
          setUser(res.data);
          saveAll("me", [res.data]); 
        }
      } catch (error) {
        toast.error("Gagal ambil user");
      }
    }

    fetchUser();
  }, []);

  return user;
}
