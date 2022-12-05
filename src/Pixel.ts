import { rgb2lab } from 'rgb-lab';
import type Germe from "./Germe";
import PPMImage from "./PPMImage";

export default class Pixel {
  public x: number;
  public y: number;

  public rgb: {r: number, g: number, b: number};
  public lab: {l: number, a: number, b: number};

  private germe: Germe | null = null;

  public distance(other: Pixel, m: number, S: number): number {
    const d_lab = Math.sqrt(Math.pow(this.lab.l - other.lab.l, 2) + Math.pow(this.lab.a - other.lab.a, 2) + Math.pow(this.lab.b - other.lab.b, 2));
    const d_xy = Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    return d_lab + m/S * d_xy;
  }

  public constructor(public readonly image: PPMImage, x: number, y: number, r: number, g: number, b: number) {
    this.x = x;
    this.y = y;

    this.rgb = {r: r, g: g, b: b};

    const [l, a, bb] = rgb2lab([r, g, b]);
    this.lab = {l: l, a: a, b: bb};
  }

  public setGerme(germe: Germe) {
    if(this.germe === germe) return;

    if(this.germe !== null) {
      this.germe.removePixel(this);
    }
    this.germe = germe;
    this.germe.addPixel(this);
  }

}
