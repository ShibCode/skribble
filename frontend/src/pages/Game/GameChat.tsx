import React, { useState } from "react";
import { useGame } from "../../context/GameProvider";
import { socket } from "../../socket";

function GameChat() {
  const [message, setMessage] = useState("");

  const { me, messages } = useGame();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    socket.emit("client:message", message, me!.id);

    setMessage("");
  };

  return (
    <div className="bg-white rounded-[4px] aspect-[300/600] flex flex-col">
      <div className="flex-1 overflow-auto overscroll-contain">
        {messages.map((message, i) => (
          <Message key={i} message={message} isOdd={i % 2 === 1} />
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-auto p-[0.2em] text-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your guess here..."
          className="border w-full border-black rounded-[4px] h-8 px-1 placeholder:text-gray-500 focus-within:outline-blue-500"
        />
      </form>
    </div>
  );
}

export default GameChat;

type MessageProps = {
  message: Message;
  isOdd: boolean;
};

const Message = ({ message, isOdd }: MessageProps) => {
  const types = {
    text: "text-black",
    "text-private": "text-[#7dad3f]",
    green: "text-green-600 font-bold",
    orange: "text-orange-500 font-bold",
    yellow: "text-yellow-500 font-bold",
    blue: "text-blue-600 font-bold",
  };

  return (
    <div
      className={`p-[0.2em] text-sm ${types[message.type]} ${
        isOdd ? "bg-[#ececec]" : "bg-white"
      }`}
    >
      {(message.type === "text" || message.type === "text-private") && (
        <span className="font-bold">{message.from}: </span>
      )}
      <span className="break-words">{message.message}</span>
    </div>
  );
};
