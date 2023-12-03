import React from "react";
import { FaPaperPlane } from "react-icons/fa6";

const Chat = () => {
  return (
    <div className="bg-gray-300  text-black h-full  p-16 pt-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Room1</h1>
      <div className="flex-grow tracking-wider overflow-y-auto mb-4">
        <div className="text-right">
          <div className="bg-blue-300 text-xl inline-block rounded px-4 py-2 mb-2">
            Hello
          </div>
        </div>
        <div className="text-left">
          <div className="bg-green-300 text-xl inline-block rounded px-4 py-2 mb-2">
            Hi
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Send a Message"
          className="border-2 rounded w-full pr-10 focus:outline-none p-4"
        />
        <button className="absolute inset-y-0 right-6 flex items-center hover:text-lg">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
