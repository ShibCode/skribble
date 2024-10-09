const Canvas = () => {
  return (
    <div className="bg-white rounded-[4px] w-full aspect-[800/600]">
      <canvas
        id="board"
        width={800}
        height={600}
        className="w-full h-full"
      ></canvas>
    </div>
  );
};

export default Canvas;
