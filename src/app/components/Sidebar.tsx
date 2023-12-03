import React from "react";
import { BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  return (
    <div className="bg-green-600 text-slate-100 h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div className="cursor-pointer text-slate-100 flex justify-evenly font-semibold items-center border mt-2 rounded-md  hover:bg-green-400">
          <span className="p-2 text-2xl">＋</span>
          <h1 className="text-xl p-4 pl-0">New Chat</h1>
        </div>
        <ul>
          <li className="cursor-pointer border-b my-4 p-4 bg-cyan-600  hover:bg-cyan-400 rounded-md duration-150 ">
            Room1
          </li>
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
