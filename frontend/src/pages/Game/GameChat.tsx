type MessageType = {
  type: "text" | "green" | "orange" | "yellow" | "blue";
  message: string;
  from?: string;
};

const messages: MessageType[] = [
  { type: "orange", message: "Lorem is now the room owner!" },
  { type: "yellow", message: "Copied room link to clipboard!" },
  { type: "green", message: "a joined the room!" },
  { type: "blue", message: "a is drawing now!" },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
  {
    type: "text",
    message: "Message in chat",
    from: "Lorem",
  },
];

function GameChat() {
  return (
    <div className="bg-white rounded-[4px] aspect-[300/600] flex flex-col">
      <div className="flex-1 overflow-auto overscroll-contain">
        {messages.map((message, i) => (
          <Message key={i} {...message} isOdd={i % 2 === 1} />
        ))}
      </div>

      <div className="mt-auto p-[0.2em] text-sm">
        <input
          placeholder="Type your guess here..."
          className="border w-full border-black rounded-[4px] h-8 px-1 placeholder:text-gray-500 focus-within:outline-blue-500"
        />
      </div>
    </div>
  );
}

export default GameChat;

interface MessageProps extends MessageType {
  isOdd: boolean;
}

const Message = ({ type, message, from, isOdd }: MessageProps) => {
  const types = {
    text: "text-black",
    green: "text-green-600 font-bold",
    orange: "text-orange-500 font-bold",
    yellow: "text-yellow-500 font-bold",
    blue: "text-blue-600 font-bold",
  };

  return (
    <div
      className={`p-[0.2em] text-sm ${types[type]} ${
        isOdd ? "bg-[#ececec]" : "bg-white"
      }`}
    >
      {from && <span className="font-bold">{from}: </span>}

      <span className="break-words">{message}</span>
    </div>
  );
};
