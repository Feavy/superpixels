import loadPPM from "./loadPPM";
import Germe from "./Germe";
import imgradient from "./imgradient";

(async () => {
  const image = await loadPPM('/images/D001.ppm');
  const gradient = imgradient(image);

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

  // On place les germes sur une grille de côté S
  for(let x = S/2; x < image.width; x+=S) {
    for(let y = S/2; y < image.height; y+=S) {
      // Vérifier que le germe n'est pas sur un bord grâce au gradient
      // On sélectionne le minimum dans un voisinage 3x3

      const min = gradient[x][y];
      let position = {x, y};

      for(let x2 = x-1; x2 <= x+1; x2++) {
        for(let y2 = y-1; y2 <= y+1; y2++) {
          if(gradient[x2][y2] < min) {
            position = {x: x2, y: y2};
          }
        }
      }

      germes.push(new Germe(image.pixel(position.x, position.y)));
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
    ctx.fillStyle = `rgb(${rand()}, ${rand()}, ${rand()}, 1)`;
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

  // Obtenir les germes extrêmes en terme de couleur (les plus éloignées)
  for(const germe of germes) {
    for(const germe2 of germes) {
      const d = germe.distanceColor(germe2);
      if(!extrem1 || d > extrem1.distanceColor(extrem2!)) {
        extrem1 = germe;
        extrem2 = germe2;
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

  // Pour afficher la segmentation :

  // ctx.fillStyle = "white";
  // for(const germe of c1) {
  //   for(const pixel of germe.pixels) {
  //     ctx.fillRect(pixel.x, pixel.y, 1, 1);
  //   }
  // }

  // ctx.fillStyle = "black";
  // for(const germe of c2) {
  //   for(const pixel of germe.pixels) {
  //     ctx.fillRect(pixel.x, pixel.y, 1, 1);
  //   }
  // }

  // Pour afficher le gradient :

  // let min = Infinity;
  // let max = -Infinity;
  // for (let x = 0; x < image.width; x++) {
  //   for (let y = 0; y < image.height; y++) {
  //     const gray = Math.floor(gradient[x][y]*255/81);
  //     ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray}, 1)`;
  //     ctx.fillRect(x, y, 1, 1);
  //   }
  // }
})();

export {};