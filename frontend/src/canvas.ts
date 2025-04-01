import { socket } from "./socket";

const FPS = 75;
const EMIT_DELAY = 1000 / FPS;

const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};

const interpolatePoints = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  steps: number,
  drawCallback: (x: number, y: number) => void
) => {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = lerp(x0, x1, t);
    const y = lerp(y0, y1, t);
    drawCallback(x, y);
  }
};

type Path = {
  points: { x: number; y: number }[];
  color: string | CanvasGradient | CanvasPattern;
  width: number;
};

export const initialize = () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#board");

  if (!canvas) throw new Error("Canvas not found");

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not found");

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const config = {
    primary: "black",
    secondary: "white",
    size: 1,
    isDisabled: false,
  };

  let isDrawing = false;
  let activeMouseButton: number | null = null;
  let lastX: number;
  let lastY: number;
  let paths: Path[] = [];
  let currentPath: Path | null = null;
  let drawEmitTimeout: number | null = null;

  const getDrawPoint = (x: number, y: number) => {
    const { top, left, width, height } = canvas.getBoundingClientRect();

    return [
      (x - left) * (canvas.width / width),
      (y - top) * (canvas.height / height),
    ];
  };

  const handlePointerDown = (e: MouseEvent) => {
    if (isDrawing || config.isDisabled) return;

    e.preventDefault();

    if (e.button === 1) return;

    isDrawing = true;
    activeMouseButton = e.button;

    currentPath = {
      points: [],
      color: activeMouseButton === 0 ? config.primary : config.secondary,
      width: config.size,
    };

    [lastX, lastY] = getDrawPoint(e.clientX, e.clientY);
    currentPath.points.push({ x: lastX - 0.5, y: lastY - 0.5 });
    currentPath.points.push({ x: lastX + 0.5, y: lastY + 0.5 });

    ctx.strokeStyle = currentPath.color;
    ctx.lineWidth = currentPath.width;

    ctx.beginPath();
    ctx.moveTo(currentPath.points[0].x, currentPath.points[0].y);
    ctx.lineTo(currentPath.points[1].x, currentPath.points[1].y);
    ctx.stroke();

    socket.emit("client:draw", [...paths, currentPath]);
  };

  const handlePointerUp = () => {
    if (currentPath) paths.push(currentPath);

    currentPath = null;
    isDrawing = false;
    activeMouseButton = null;
    ctx.closePath();
  };

  const handlePointerMove = (e: MouseEvent) => {
    if (!isDrawing || !currentPath || config.isDisabled) return;

    const [currentX, currentY] = getDrawPoint(e.clientX, e.clientY);

    currentPath.points.push({ x: currentX, y: currentY });

    // Interpolate points for smoother drawing with large stroke widths
    const distance = Math.hypot(currentX - lastX, currentY - lastY);
    const steps = Math.ceil(distance / 2); // Adjust step size if needed

    interpolatePoints(lastX, lastY, currentX, currentY, steps, (x, y) => {
      ctx.lineTo(x, y);
    });

    ctx.strokeStyle = currentPath.color;
    ctx.lineWidth = currentPath.width;

    ctx.stroke();

    lastX = currentX;
    lastY = currentY;

    if (!drawEmitTimeout) {
      drawEmitTimeout = setTimeout(() => {
        socket.emit("client:draw", [...paths, currentPath]);
        drawEmitTimeout = null;
      }, EMIT_DELAY);
    }
  };

  // Prevent right-click context menu
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("contextmenu", handleContextMenu);

  const cleanupListeners = () => {
    canvas.removeEventListener("pointerdown", handlePointerDown);
    canvas.removeEventListener("pointerup", handlePointerUp);
    canvas.removeEventListener("pointermove", handlePointerMove);
    canvas.removeEventListener("contextmenu", handleContextMenu);
  };

  const emptyCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawPaths = () => {
    if (!ctx || !canvas) return;

    paths.forEach((path) => {
      if (!path) return;

      ctx.beginPath();
      path.points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.stroke();
      ctx.closePath();
    });
  };

  // Clear the canvas
  const clear = () => {
    emptyCanvas(); // Empty canvas
    paths = []; // Remove all paths
    socket.emit("client:draw", []); // Emit updated paths
  };

  // Undo the last drawn path
  const undo = () => {
    emptyCanvas(); // Empty canvas
    paths.pop(); // Remove last path
    drawPaths(); // Redraw rest of the paths
    socket.emit("client:draw", paths); // Emit updated paths
  };

  // populate the canvas when someone else is drawing
  socket.on("server:draw", (receivedPaths: Path[]) => {
    paths = receivedPaths;
    currentPath = null;

    emptyCanvas();
    drawPaths();
  });

  return { config, cleanupListeners, clear, undo };
};
