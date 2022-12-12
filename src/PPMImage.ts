import Pixel from "./Pixel";

export default class PPMImage {
  private readonly ctx: CanvasRenderingContext2D;

  private pixels: Pixel[][] = [];

  public constructor(public readonly width: number, public readonly height: number, public readonly data: ImageData) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.putImageData(data, 0, 0);

    for(let x = 0; x < width; x++) {
      this.pixels[x] = [];
      for(let y = 0; y < height; y++) {
        this.pixels[x][y] = new Pixel(this, x, y, this.data.data[y * this.width * 4 + x * 4], this.data.data[y * this.width * 4 + x * 4 + 1], this.data.data[y * this.width * 4 + x * 4 + 2]);
      }
    }
  }

  public pixel(x: number, y: number): Pixel {
    if(isNaN(x) || isNaN(y)) {
      return this.pixels[0][0];
    }
    return this.pixels[Math.floor(x)][Math.floor(y)];
    // const [r, g, b] = this.ctx.getImageData(x, y, 1, 1).data;
    // return new Pixel(this, x, y, r, g, b);
    // return new Pixel(this.data.data[y * this.width * 4 + x * 4], this.data.data[y * this.width * 4 + x * 4 + 1], this.data.data[y * this.width * 4 + x * 4 + 2]);
  }
}