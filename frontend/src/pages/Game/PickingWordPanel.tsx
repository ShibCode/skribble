import { PickState } from ".";
import Avatar from "../../components/Avatar";
import { useGame } from "../../context/GameProvider";

type ModalProps = {
  pickState: PickState | null;
  setPickState: React.Dispatch<React.SetStateAction<PickState | null>>;
};

const PickingWordPanel = ({ pickState, setPickState }: ModalProps) => {
  const { game, me } = useGame();

  const drawer = game?.players.find((p) => p.isDrawing);

  return (
    <>
      {me?.isDrawing ? (
        <div className="flex flex-col items-center gap-5">
          <p className="text-3xl">Choose a word</p>

          <div className="flex gap-4">
            {pickState?.options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  pickState.onPick(opt);
                  setTimeout(() => {
                    setPickState(null);
                  }, 1000);
                }}
                className="font-bold border-white border-[3px] rounded-[4px] py-0.5 px-2.5 hover:bg-white hover:text-black text-2xl"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-[34px]">{drawer!.username} is choosing a word!</p>
          <Avatar size={70} {...drawer!.avatar} />
        </div>
      )}
    </>
  );
};

export default PickingWordPanel;
