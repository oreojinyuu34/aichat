"use client";
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { BiLogOut } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { getFirestoreInstance } from "../../../lib/FirebaseConfig";
import { unsubscribe } from "diagnostics_channel";
import { useAppContext } from "@/context/AppContext";

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const db = getFirestoreInstance();
// ここで `db` を使用してFirebase Firestoreの操作を行います。

const Sidebar = () => {
  const { user, userId } = useAppContext();

  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    if (user) {
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, "rooms");
        const q = query(
          roomCollectionRef,
          where("userID", "==", userId),
          orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newRooms: Room[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          }));
          setRooms(newRooms);
        });
        return () => {
          unsubscribe();
        };
      };
      fetchRooms();
    }
  }, [userId]);

  return (
    <div className="bg-green-600 text-slate-100 h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div className="cursor-pointer text-slate-100 flex justify-evenly font-semibold items-center border mt-2 rounded-md  hover:bg-green-400">
          <span className="p-2 text-2xl">＋</span>
          <h1 className="text-xl p-4 pl-0">New Chat</h1>
        </div>
        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className="cursor-pointer border-b my-4 p-4 bg-cyan-600  hover:bg-cyan-400 rounded-md duration-150 "
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-2xl cursor-pointer text-slate-100 flex justify-center items-center mb-8 rounded-md p-4 hover:bg-green-400">
        <BiLogOut />
        <span className="px-4">ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
