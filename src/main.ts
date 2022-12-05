import loadPPM from "./loadPPM";
import Germe from "./Germe";

(async () => {
  const image = await loadPPM('/images/D000.ppm');

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(image.data, 0, 0);

  const m = 50;
  const N = 20;
  const pixels = image.width * image.height;
  const S = Math.sqrt(pixels/N);

  const germes: Germe[] = [];

  for(let i = S/2; i < image.height; i+=S) {
    for(let j = S/2; j < image.width; j+=S) {
      germes.push(new Germe(image.pixel(j, i)));
    }
  }

  let relocated = false;
  let i = 0;

  do {
    relocated = false;
    for (let x = 0; x < image.width; x++) {
      for (let y = 0; y < image.height; y++) {
        const pixel = image.pixel(x, y);
        let min = Infinity;
        let germe: Germe | undefined;
        for (const g of germes) {
          const d = pixel.distance(g, m, S);
          if (d < min) {
            min = d;
            germe = g;
          }
        }
        if (germe) {
          pixel.setGerme(germe);
        }
      }
    }
    for(const germe of germes) {
      const r = germe.relocate();
      relocated = relocated || r;
    }
    console.log("Iteration", i++);
  } while(relocated && i < 50);


  i = 0;

  function rand() {
    return Math.floor(Math.random()*255);
  }

  for(const germe of germes) {
    i+=2;
    ctx.fillStyle = `rgb(${rand()}, ${rand()}, ${rand()}, 0.5)`;
    for(const pixel of germe.pixels) {
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(germe.x, germe.y, 3, 3);
  }

  for(let i = 0; i < image.width; i+=S) {
    for(let j = 0; j < image.height; j+=S) {
      ctx.fillRect(i, 0, 1, image.height);
      ctx.fillRect(0, j, image.width, 1);
    }
  }
})();

export {};