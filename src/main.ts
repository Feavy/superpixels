import loadPPM from "./loadPPM";
import Germe from "./Germe";

(async () => {
  const image = await loadPPM('/images/D001.ppm');

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
  let extrem1: Germe | undefined = undefined;
  let extrem2: Germe | undefined = undefined;

  // get extrems germes in terms of color
  for(const germe of germes) {
    for(const germe2 of germes) {
      if(germe !== germe2) {
        const d = germe.distanceColor(germe2);
        if(!extrem1 || d > extrem1.distanceColor(extrem2!)) {
          extrem1 = germe;
          extrem2 = germe2;
        }
      }
    }
  }

  const c1: Germe[] = [];
  const c2: Germe[] = [];

  for(const germe of germes) {
    if(germe.distanceColor(extrem1!) < germe.distanceColor(extrem2!)) {
      c1.push(germe);
    } else {
      c2.push(germe);
    }
  }

  ctx.fillStyle = "white";
  for(const germe of c1) {
    for(const pixel of germe.pixels) {
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }
  }

  ctx.fillStyle = "black";
  for(const germe of c2) {
    for(const pixel of germe.pixels) {
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }
  }
})();

export {};