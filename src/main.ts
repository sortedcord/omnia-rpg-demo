import { classroomScene } from "./scenes/classroom";
import { isWalkable } from "./collision";
import { renderScene } from "./render";
import { findInteractable } from "./interact";

// src/main.ts
const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;


const player = {
  x: 10,
  y: 12
};


window.addEventListener("keydown", (e) => {
  let next = { ...player };


  if (e.key === "ArrowUp") next.y--;
  if (e.key === "ArrowDown") next.y++;
  if (e.key === "ArrowLeft") next.x--;
  if (e.key === "ArrowRight") next.x++;

  if (e.key === "e") {
    const obj = findInteractable(classroomScene, player);

    if (obj) {
      console.log(`interacting with ${obj.id}`)
      for (const interaction of obj.interactions) {
        console.log(`[${interaction.type}] ${interaction.description}`);

      }
    } else {
      console.log("Nothing to interact with");
    }

    return;
  }

  if (isWalkable(classroomScene, next)) {
    player.x = next.x;
    player.y = next.y;
  }
});
canvas.width = 640;
canvas.height = 480;

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // placeholder background
  renderScene(ctx, classroomScene);

  ctx.fillStyle = "white";
  ctx.fillRect(player.x * 32, player.y * 32, 32, 32);
  requestAnimationFrame(loop);
}

loop();

