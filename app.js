const getImageAsset = ({ src, width, height, tileWidth, tileHeight }) =>
  new Promise((resolve, reject) => {
    const image = new Image(width, height);
    image.onload = () =>
      resolve({ image, width, height, tileWidth, tileHeight });
    image.src = "./assets/" + src;
  });

const gridSize = 16;
const zoomLevel = 4;
const canvasId = "viewport";
const boardWidth = 3;
const boardHeight = 3;

const play = async () => {
  const viewportNode = document.getElementById(canvasId);
  const ctx = viewportNode.getContext("2d");

  ctx.canvas.width = gridSize * boardWidth;
  ctx.canvas.height = gridSize * boardHeight;

  viewportNode.style.zoom = zoomLevel;

  const warriorSprite = await getImageAsset({
    src: "warrior.png",
    width: 256,
    height: 128,
    tileWidth: 12,
    tileHeight: 15
  });

  const player = {
    x: 1,
    y: 1,
    path: [],
    currentState: "idle",
    states: {
      idle: {
        frames: [
          { src: warriorSprite, x: 1, y: 1 },
          { src: warriorSprite, x: 0, y: 1 }
        ],
        index: 0
      }
    }
  };

  let totalTime = 0;


  const tick = dTime => {
    totalTime = totalTime + dTime;
    const state = player.states[player.currentState];
    const frame = state.frames[state.index];
    
    // debugger;
    if (totalTime > 1000) {
      totalTime = totalTime - 1000;
      state.index = state.index + 1;
      if (state.index > state.frames.length - 1) {
        state.index = 0;
      }
    }
    

    ctx.drawImage(
      frame.src.image,
      frame.x * frame.src.tileWidth,
      frame.y * frame.src.tileHeight,
      frame.src.tileWidth,
      frame.src.tileHeight,
      player.x * gridSize + Math.floor((gridSize - frame.src.tileWidth) / 2),
      player.y * gridSize + Math.floor((gridSize - frame.src.tileHeight) / 2),
      frame.src.tileWidth,
      frame.src.tileHeight
    );
  };

  let lastPaintMoment = Date.now();

  const animate = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const now = Date.now();
    const dTime = now - lastPaintMoment;
    lastPaintMoment = now;

    tick(dTime);

    requestAnimationFrame(animate);
  };

  animate();
  window.addEventListener('keyup', event => {
    const currentPosition = {
      x: player.x,
      y: player.y
    }
    // console.log(event)
    if ( event.code === "ArrowRight") {
      player.x = player.x + 1;
    }
    if ( event.code === "ArrowLeft") {
      player.x = player.x - 1;
    }
    if ( event.code === "ArrowUp") {
      player.y = player.y - 1;
    }
    if ( event.code === "ArrowDown") {
      player.y = player.y + 1;
    }
    if (player.x < 0 || player.x > 2 ) {
      player.x = currentPosition.x
    }
    if (player.y < 0 || player.y > 2 ) {
      player.y = currentPosition.y
    }
  })
};

play();
