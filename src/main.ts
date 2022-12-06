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

  const m = 20;
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


  function rand() {
    return Math.floor(Math.random()*255);
  }

  for(const germe of germes) {
    ctx.fillStyle = `rgb(${rand()}, ${rand()}, ${rand()}, 0.5)`;
    for(const pixel of germe.pixels) {
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }
  }
  for(const germe of germes) {
    ctx.fillStyle = "red";
    ctx.fillRect(germe.x, germe.y, 11, 11);
    ctx.fillStyle = `rgb(${germe.rgb.r}, ${germe.rgb.g}, ${germe.rgb.b})`;
    ctx.fillRect(germe.x, germe.y, 10, 10);
  }


  // Segmentation binaire
  let min = Infinity;
  let max = -Infinity;

  for(const g1 of germes) {
    for(const g2 of germes) {
      if(g1 === g2) {
        continue;
      }
      const ds = g1.distanceColor(g2);
      if(ds > max) {
        max = ds; 
      }
      if(ds < min) {
        min = ds;
      }
    }
  }
  console.log("Distance: ", min, max);
  console.log("Avg: ", (min+max)/2);

  let avg = (min+max)/2;

  const c1: Set<Germe> = new Set();
  const c2: Set<Germe> = new Set();

  for(const g1 of germes) {
    for(const g2 of germes) {
      if(g1 === g2) {
        continue;
      }
      const ds = g1.distanceColor(g2);

    }
  }
})();

export {};