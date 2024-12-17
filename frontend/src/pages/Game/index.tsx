import { useNavigate, useParams } from "react-router-dom";
import Canvas from "./Canvas";
import DrawControls from "./DrawControls";
import DrawControlsProvider from "./DrawControlsProvider";
import GameChat from "./GameChat";
import GameHeader from "./GameHeader";
import GameLeaderboards from "./GameLeaderboards";
import { useLayoutEffect, useState } from "react";
import { socket } from "../../socket";
import { userId } from "../../App";
import { useGame } from "../../context/GameProvider";
import WordRevealPanel from "./WordRevealPanel";
import PickingWordPanel from "./PickingWordPanel";
import OverlayContent from "../../components/OverlayContent";

export type PickState = {
  options: string[];
  onPick: (word: string) => void;
};

const Game = () => {
  const [pickState, setPickState] = useState<PickState | null>({
    options: ["cage", "crawl", "flock"],
    onPick: () => {},
  });

  const { gameId } = useParams();
  const navigate = useNavigate();

  const { me, game, setGame, setMessages } = useGame();

  useLayoutEffect(() => {
    // check if user is/was part of the game
    socket.emit("client:connect_to_game", gameId, userId, (error: boolean) => {
      if (error) navigate("/");
    });

    const handleUpdateGame = (game: Game) => setGame(game);

    const handlePickWord = (
      options: string[],
      onPick: (word: string) => void
    ) => {
      setPickState({ options, onPick });
    };

    const handleMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("server:update_game", handleUpdateGame);
    socket.on("server:pick_word", handlePickWord);
    socket.on("server:message", handleMessage);

    return () => {
      socket.off("server:update_game", handleUpdateGame);
      socket.off("server:pick_word", handlePickWord);
      socket.off("server:message", handleMessage);
    };
  }, []);

  if (!game) return;

  return (
    <div className="flex justify-center">
      <div className="w-[95%] xl:w-[90%] max-w-[1312px] flex flex-col items-start gap-3 py-6">
        <img src="/logo.gif" alt="logo" className="max-w-[312px]" />

        <div className="w-full grid grid-cols-[200px_1fr_250px] xl:grid-cols-[200px_1fr_300px] gap-1.5">
          <GameHeader />

          <GameLeaderboards />

          <div className="flex flex-col gap-1.5 relative h-max">
            <OverlayContent state="queue" className="text-3xl">
              Waiting for players: {game?.players.length} / 2
            </OverlayContent>

            <OverlayContent state="showing_round_number" className="text-3xl">
              Round {game.round}
            </OverlayContent>

            <OverlayContent state="picking_word" className="text-xl">
              <PickingWordPanel
                pickState={pickState}
                setPickState={setPickState}
              />
            </OverlayContent>

            <OverlayContent state="revealing_word" className="flex-col gap-6">
              <WordRevealPanel />
            </OverlayContent>

            <Canvas />

            <DrawControlsProvider>
              {me?.isDrawing && game.state === "drawing" && <DrawControls />}
            </DrawControlsProvider>
          </div>

          <GameChat />
        </div>
      </div>
    </div>
  );
};

export default Game;
