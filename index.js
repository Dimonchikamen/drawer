const canvas = document.getElementById("canvas-wrapper");
const ctx = canvas.children[0].getContext("2d");
let isMouseDown = false;
let startPoint = { x: 0, y: 0 };
let previousLine = { startX: 0, startY: 0, endX: 0, endY: 0 };
const currentPosition = { x: 0, y: 0 };
let currentLine = { startX: 0, startY: 0, endX: 0, endY: 0 };
const lines = [];
const radius = 10;

const circlesPoints = [];

const circles = document.querySelectorAll(".circle");
circles.forEach((c) => circlesPoints.push(fromHtmlToObjectCircle(c)));

//#region helpers

function isCircleHtml(target) {
  return target.classList.contains("circle");
}

function fromHtmlToObjectCircle(target) {
  return {
    x: Number(target.dataset.x) + radius,
    y: Number(target.dataset.y) + radius,
    radius,
  };
}

function mouseInCircle(mouseX, mouseY, circlePoint) {
  const deltaX = Math.abs(circlePoint.x - mouseX);
  const deltaY = Math.abs(circlePoint.y - mouseY);
  return (
    deltaX * deltaX + deltaY * deltaY <= circlePoint.radius * circlePoint.radius
  ); //&& deltaY <= circlePoint.radius;
}

//#endregion

function setPreviousLine(startX, startY, endX, endY) {
  previousLine = { startX, startY, endX, endY };
}

function saveLine(startX, startY, endX, endY) {
  lines.push({ startX, startY, endX, endY });
}

function drawLine(startX, startY, endX, endY) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function drawLines() {
  lines.forEach((line) =>
    drawLine(line.startX, line.startY, line.endX, line.endY)
  );
}

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  ctx.moveTo(e.offsetX, e.offsetY);
  startPoint = { x: e.offsetX, y: e.offsetY };
});

canvas.addEventListener("mousemove", (e) => {
  const { offsetX: mouseX, offsetY: mouseY } = e;
  if (isMouseDown) {
    if (isCircleHtml(e.target)) {
    }
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawLines();
    const index = circlesPoints.findIndex((c) =>
      mouseInCircle(mouseX, mouseY, c)
    );
    if (isCircleHtml(e.target)) {
      const circlePoint = fromHtmlToObjectCircle(e.target);
      drawLine(startPoint.x, startPoint.y, circlePoint.x, circlePoint.y);
      currentLine = {
        startX: startPoint.x,
        startY: startPoint.y,
        endX: circlePoint.x,
        endY: circlePoint.y,
      };
    } else {
      drawLine(startPoint.x, startPoint.y, mouseX, mouseY);
      currentLine = {
        startX: startPoint.x,
        startY: startPoint.y,
        endX: mouseX,
        endY: mouseY,
      };
    }
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (isMouseDown) {
    isMouseDown = false;
    saveLine(startPoint.x, startPoint.y, currentLine.endX, currentLine.endY);
  }
});

// window.addEventListener("mouseout", (e) => {
//   if (isMouseDown) {
//     isMouseDown = false;
//     saveLine(startPoint.x, startPoint.y, e.offsetX, e.offsetY);
//   }
// });
