import { useEffect, useState } from "react";
import { init } from "./canvas";

const App = () => {
  const [strokeStyle, setStrokeStyle] = useState("black");
  const [lineWidth, setLineWidth] = useState(1);

  useEffect(() => {
    return init(strokeStyle, lineWidth);
  }, [strokeStyle, lineWidth]);

  return (
    <div>
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        id="board"
        className="w-full h-screen bg-red-50"
      ></canvas>

      <div className="h-[100px] flex gap-10">
        <button onClick={() => setStrokeStyle("black")}>Stroke Black</button>
        <button onClick={() => setStrokeStyle("red")}>Stroke Red</button>
        <button onClick={() => setStrokeStyle("blue")}>Stroke Blue</button>

        <button onClick={() => setLineWidth(1)}>Line Width SM</button>
        <button onClick={() => setLineWidth(5)}>Line Width MD</button>
        <button onClick={() => setLineWidth(10)}>Line Width LG</button>
      </div>
    </div>
  );
};

export default App;
