export const init = (strokeStyle: string, lineWidth: number) => {
  const canvas = document.querySelector<HTMLCanvasElement>("#board");

  if (!canvas) throw new Error("Canvas not found");

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not found");

  let isDrawing = false;

  const handleMouseDown = (e: MouseEvent) => {
    const { top, left } = canvas.getBoundingClientRect();

    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - left, e.clientY - top);
  };

  const handleMouseUp = () => {
    isDrawing = false;
    ctx.closePath();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    const { top, left } = canvas.getBoundingClientRect();

    ctx.lineTo(e.clientX - left, e.clientY - top);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
};
