"use client";
import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import { getFirestoreInstance } from "../../../lib/FirebaseConfig";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useAppContext } from "@/context/AppContext";
import { type } from "os";

const db = getFirestoreInstance();
// ここで `db` を使用してFirebase Firestoreの操作を行います。

type Message = {
  text: string;
  sender: string;
  createdAt: Timestamp;
};

const Chat = () => {
  const { selectedRoom } = useAppContext();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  //各ルームにおけるメッセージの取得
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        const roomDocRef = doc(db, "rooms", selectedRoom);
        const messagesCollectionRef = collection(roomDocRef, "messages");

        const q = query(messagesCollectionRef, orderBy("createdAt"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
          setMessages(newMessages);
          console.log(messages);
        });
        return () => {
          unsubscribe();
        };
      };
      fetchMessages();
    }
  }, [selectedRoom]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: "user",
      createdAt: serverTimestamp(),
    };

    //メッセージをfirestoreに保存
    const roomDocRef = doc(db, "rooms", "Pj4ztcetTWSuLwWOT3db");
    const messageCollectionRef = collection(roomDocRef, "messages");
    await addDoc(messageCollectionRef, messageData);
  };

  return (
    <div className="bg-gray-300  text-black h-full  p-16 pt-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Room1</h1>
      <div className="flex-grow tracking-wider overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === "user" ? "text-right" : "text-left"}
          >
            <div
              className={
                message.sender === "user"
                  ? "bg-blue-300 text-xl inline-block rounded px-4 py-2 mb-2"
                  : "bg-green-300 text-xl inline-block rounded px-4 py-2 mb-2"
              }
            >
              <p className="text-black">{message.text}</p>
            </div>
          </div>

          // {/* <div className="text-right">
          //               <div className="bg-blue-300 text-xl inline-block rounded px-4 py-2 mb-2">
          //                 <p className="text-black font-medium">{message.text}</p>
          //               </div>
          //             </div>
          //             <div className="text-left">
          //               <div className="bg-green-300 text-xl inline-block rounded px-4 py-2 mb-2">
          //                 <p className="text-black font-medium">{message.text}</p>
          //               </div>
          //             </div> */}
        ))}
      </div>

      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Send a Message"
          className="border-2 rounded w-full pr-10 focus:outline-none p-4"
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          className="absolute inset-y-0 right-6 flex items-center hover:text-lg"
          onClick={() => sendMessage()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
