const canvas = document.getElementById("canvas-wrapper");
const ctx = canvas.children[0].getContext("2d");
let isMouseDown = false;
let startPoint = { x: 0, y: 0 };
let previousLine = { startX: 0, startY: 0, endX: 0, endY: 0 };
const currentPosition = { x: 0, y: 0 };
let currentLine = { startX: 0, startY: 0, endX: 0, endY: 0 };
const lines = [];
const size = 28;

const fieldHooksCentres = [];
const columns = document.querySelectorAll(".table-column");
columns.forEach((column) => {
  const fieldHooks = column.querySelectorAll(".field-hook");
  fieldHooks.forEach((fieldHook) =>
    fieldHooksCentres.push({
      id: fieldHook.dataset.id,
      x: fieldHook.offsetLeft + size / 2 + column.offsetLeft,
      y: fieldHook.offsetTop + size / 2 + column.offsetTop,
    })
  );
});

console.log(fieldHooksCentres);

//#region helpers

function findById(id) {
  const index = fieldHooksCentres.findIndex((f) => f.id === id);
  return fieldHooksCentres[index];
}

function lineIsExist(line) {
  lines.some(
    (l) =>
      (l.startX === line.startX &&
        l.startY === line.startY &&
        l.endX === line.endX &&
        l.endY === line.endY) ||
      (l.startX === line.endX &&
        l.startY === line.endY &&
        l.endX === line.startX &&
        l.endY === line.startY)
  );
}

function isFieldHook(target) {
  return target.classList.contains("field-hook");
}

function isCircleHtml(target) {
  return target.classList.contains("circle");
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawLines();
}

//#endregion

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

canvas.onmousedown = function (e) {
  console.log(e);
  const target = e.target;
  if (isFieldHook(target)) {
    isMouseDown = true;
    const center = findById(target.dataset.id);
    ctx.moveTo(center.x, center.y);
    startPoint = { x: center.x, y: center.y };
  } else if (isCircleHtml(e.target)) {
    isMouseDown = true;
    const center = findById(target.parentElement.dataset.id);
    ctx.moveTo(center.x, center.y);
    startPoint = { x: center.x, y: center.y };
  }
};

canvas.onmousemove = function (e) {
  const { offsetX: mouseX, offsetY: mouseY } = e;
  if (isMouseDown) {
    updateCanvas();
    const target = e.target;
    if (isCircleHtml(target)) {
      const center = findById(target.parentElement.dataset.id);
      const line = {
        startX: startPoint.x,
        startY: startPoint.y,
        endX: center.x,
        endY: center.y,
      };
      drawLine(line.startX, line.startY, line.endX, line.endY);
      currentLine = line;
    } else if (isFieldHook(target)) {
      const center = findById(target.dataset.id);
      const line = {
        startX: startPoint.x,
        startY: startPoint.y,
        endX: center.x,
        endY: center.y,
      };
      drawLine(line.startX, line.startY, line.endX, line.endY);
      currentLine = line;
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
};

canvas.onmouseup = function (e) {
  const resultLine = {
    startX: startPoint.x,
    startY: startPoint.y,
    endX: currentLine.endX,
    endY: currentLine.endY,
  };
  if (isMouseDown && isCircleHtml(e.target) && !lineIsExist(resultLine)) {
    saveLine(
      resultLine.startX,
      resultLine.startY,
      resultLine.endX,
      resultLine.endY
    );
  }
  isMouseDown = false;
  updateCanvas();
};
