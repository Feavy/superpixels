import loadPPM from "./loadPPM";
import Pixel from "./Pixel";
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

  const germe = germes[0];
  const p1 = image.pixel(0, 1);
  console.log(p1.distance(germe, m, S));

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
  } while(i < 50);

  const colors = ["alizarin", "amaranth", "amber", "amethyst", "apricot", "aqua", "aquamarine", "asparagus", "auburn", "azure", "beige", "bistre", "black", "blue", "blue-green", "blue-violet", "bondi-blue", "brass", "bronze", "brown", "buff", "burgundy", "camouflage-green", "caput-mortuum", "cardinal", "carmine", "carrot-orange", "celadon", "cerise", "cerulean", "champagne", "charcoal", "chartreuse", "cherry-blossom-pink", "chestnut", "chocolate", "cinnabar", "cinnamon", "cobalt", "copper", "coral", "corn", "cornflower", "cream", "crimson", "cyan", "dandelion", "denim", "ecru", "emerald", "eggplant", "falu-red", "fern-green", "firebrick", "flax", "forest-green", "french-rose", "fuchsia", "gamboge", "gold", "goldenrod", "green", "grey", "han-purple", "harlequin", "heliotrope", "hollywood-cerise", "indigo", "ivory", "jade", "kelly-green", "khaki", "lavender", "lawn-green", "lemon", "lemon-chiffon", "lilac", "lime", "lime-green", "linen", "magenta", "magnolia", "malachite", "maroon", "mauve", "midnight-blue", "mint-green", "misty-rose", "moss-green", "mustard", "myrtle", "navajo-white", "navy-blue", "ochre", "office-green", "olive", "olivine", "orange", "orchid", "papaya-whip", "peach", "pear", "periwinkle", "persimmon", "pine-green", "pink", "platinum", "plum", "powder-blue", "puce", "prussian-blue", "psychedelic-purple", "pumpkin", "purple", "quartz-grey", "raw-umber", "razzmatazz", "red", "robin-egg-blue", "rose", "royal-blue", "royal-purple", "ruby", "russet", "rust", "safety-orange", "saffron", "salmon", "sandy-brown", "sangria", "sapphire", "scarlet", "school-bus-yellow", "sea-green", "seashell", "sepia", "shamrock-green", "shocking-pink", "silver", "sky-blue", "slate-grey", "smalt", "spring-bud", "spring-green", "steel-blue", "tan", "tangerine", "taupe", "teal", "tenné-(tawny)", "terra-cotta", "thistle", "titanium-white", "tomato", "turquoise", "tyrian-purple", "ultramarine", "van-dyke-brown", "vermilion", "violet", "viridian", "wheat", "white", "wisteria", "yellow", "zucchini"];

  i = 0;

  function rand() {
    return Math.floor(Math.random()*255);
  }

  for(const germe of germes) {
    i+=2;
    ctx.fillStyle = `rgb(${rand()}, ${rand()}, ${rand()})`;
    for(const pixel of germe.pixels) {
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(germe.x, germe.y, 3, 3);
  }
})();

export {};