import { useMemo, useState } from "react";
import Avatar from "../../components/Avatar";
import Arrow from "./Arrow";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { userId } from "../../App";

const avatarMax = {
  body: 28,
  mouth: 51,
  eyes: 57,
};

const getRandomAvatar = () => {
  const body = Math.floor(Math.random() * avatarMax.body);
  const mouth = Math.floor(Math.random() * avatarMax.mouth);
  const eyes = Math.floor(Math.random() * avatarMax.eyes);

  return { body, mouth, eyes };
};

const Home = () => {
  const [avatar, setAvatar] = useState(getRandomAvatar);
  const [username, setUsername] = useState("asd");

  const navigate = useNavigate();

  const avatars = useMemo(() => new Array(8).fill(0).map(getRandomAvatar), []);

  const handleAvatarChange = (
    part: "body" | "mouth" | "eyes",
    value: -1 | 1
  ) => {
    setAvatar((prev) => ({
      ...prev,
      [part]: (prev[part] + value + avatarMax[part]) % avatarMax[part],
    }));
  };

  const handleRandom = () => {
    setAvatar(getRandomAvatar());
  };

  const handleStart = () => {
    if (username.length < 2) return;

    socket.emit(
      "client:join_game",
      userId,
      username,
      avatar,
      (gameId: string) => navigate(`/game/${gameId}`)
    );
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full flex justify-center relative">
        <header className="flex flex-col items-center gap-4 absolute bottom-full -translate-y-8">
          <img src="/logo.gif" alt="skribble.io" />

          <div className="flex">
            {avatars.map((avatar, i) => (
              <Avatar key={i} size={48} {...avatar} />
            ))}
          </div>
        </header>

        <main className="bg-[rgba(12,44,150,0.75)] text-white p-3 rounded-[4px] w-full max-w-[400px] flex flex-col items-center gap-2">
          <input
            type="text"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="rounded-sm px-2 py-1.5 placeholder:font-bold text-black w-full"
          />

          <div className="flex w-full justify-center relative bg-black/10 rounded-[4px] p-4">
            <button
              className="absolute top-1.5 right-1.5 opacity-60 hover:opacity-100 hover:scale-[1.15] transition-all duration-150"
              onClick={handleRandom}
            >
              <img src="/dice.gif" alt="dice" />
            </button>

            <div className="flex flex-col">
              <button
                className="h-1/3 aspect-square"
                onClick={() => handleAvatarChange("eyes", -1)}
              >
                <Arrow direction="left" />
              </button>
              <button
                className="h-1/3 aspect-square"
                onClick={() => handleAvatarChange("mouth", -1)}
              >
                <Arrow direction="left" />
              </button>
              <button
                className="h-1/3 aspect-square"
                onClick={() => handleAvatarChange("body", -1)}
              >
                <Arrow direction="left" />
              </button>
            </div>

            <Avatar size={96} {...avatar} />

            <div className="flex flex-col">
              <button
                className="h-1/3 aspect-square"
                onClick={() => handleAvatarChange("eyes", 1)}
              >
                <Arrow direction="right" />
              </button>
              <button
                className="h-1/3 aspect-square"
                onClick={() => handleAvatarChange("mouth", 1)}
              >
                <Arrow direction="right" />
              </button>
              <button
                className="h-1/3 aspect-square"
                onClick={() => handleAvatarChange("body", 1)}
              >
                <Arrow direction="right" />
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <button
              className="w-full h-[54px] rounded-[4px] bg-[#53e237] text-[2rem] font-extrabold"
              style={{ textShadow: "2px 2px 0px #0000002b" }}
              onClick={handleStart}
            >
              Play!
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
