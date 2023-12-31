"use client";
import React, { useEffect, useRef, useState } from "react";
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
import OpenAI from "openai";
import LoadingIcons from "react-loading-icons";

const db = getFirestoreInstance();
// ここで `db` を使用してFirebase Firestoreの操作を行います。

type Message = {
  text: string;
  sender: string;
  createdAt: Timestamp;
};

const Chat = () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const { selectedRoom, selectedRoomName } = useAppContext();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollDiv = useRef<HTMLDivElement>(null);

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
        });
        return () => {
          unsubscribe();
        };
      };
      fetchMessages();
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: "user",
      createdAt: serverTimestamp(),
    };

    //メッセージをfirestoreに保存
    const roomDocRef = doc(db, "rooms", selectedRoom!);
    const messageCollectionRef = collection(roomDocRef, "messages");
    await addDoc(messageCollectionRef, messageData);
    setInputMessage("");
    setIsLoading(true);

    //OpenAIからの返信
    const gpt3Response = await openai.chat.completions.create({
      messages: [{ role: "user", content: inputMessage }],
      model: "gpt-3.5-turbo",
    });
    setIsLoading(false);

    const botResponse = gpt3Response.choices[0].message.content;
    await addDoc(messageCollectionRef, {
      text: botResponse,
      sender: "bot",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="bg-gray-300  text-black h-full  p-16 pt-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">{selectedRoomName}</h1>
      <div
        className="flex-grow tracking-wider overflow-y-auto mb-4"
        ref={scrollDiv}
      >
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

          // /* <div className="text-right">
          //               <div className="bg-blue-300 text-xl inline-block rounded px-4 py-2 mb-2">
          //                 <p className="text-black font-medium">{message.text}</p>
          //               </div>
          //             </div>
          //             <div className="text-left">
          //               <div className="bg-green-300 text-xl inline-block rounded px-4 py-2 mb-2">
          //                 <p className="text-black font-medium">{message.text}</p>
          //               </div>
          //             </div> */
        ))}
        {isLoading && <LoadingIcons.SpinningCircles />}
      </div>

      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Send a Message"
          name="message" // name属性の追加
          className="border-2 rounded w-full pr-10 focus:outline-none p-4"
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
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
