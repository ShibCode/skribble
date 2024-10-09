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
};

export const initialize = () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#board");

  if (!canvas) throw new Error("Canvas not found");

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not found");

  let isDrawing = false;
  let lastX: number;
  let lastY: number;
  const paths: Path[] = [];

  let currentPath: Path | null = null;

  // High-DPI scaling for the canvas
  const scaleCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  };

  scaleCanvas();

  const handleMouseDown = (e: MouseEvent) => {
    const { top, left } = canvas.getBoundingClientRect();
    isDrawing = true;

    currentPath = { points: [] };
    currentPath.points.push({ x: e.clientX - left, y: e.clientY - top });

    lastX = e.clientX - left;
    lastY = e.clientY - top;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath) {
      paths.push(currentPath); // Save the current path
      currentPath = null;
    }

    isDrawing = false;
    ctx.closePath();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    const { top, left } = canvas.getBoundingClientRect();
    const currentX = e.clientX - left;
    const currentY = e.clientY - top;

    currentPath?.points.push({ x: currentX, y: currentY }); // Track the points for the path

    // Interpolate points for smoother drawing with large stroke widths
    const distance = Math.hypot(currentX - lastX, currentY - lastY);
    const steps = Math.ceil(distance / 2); // Adjust step size if needed

    interpolatePoints(lastX, lastY, currentX, currentY, steps, (x, y) => {
      ctx.lineTo(x, y);
    });

    ctx.lineCap = "round"; // Ensures smooth round ends for lines
    ctx.lineJoin = "round"; // Ensures smooth joins between lines

    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  const cleanupListeners = () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    clear();

    paths.pop();

    // Redraw all paths
    paths.forEach((path) => {
      ctx.beginPath();
      path.points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.closePath();
    });
  };

  return { ctx, cleanupListeners, clear, undo };
};
