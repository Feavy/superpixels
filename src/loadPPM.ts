import {Buffer} from "buffer";
import PortablePixmap from "@fitbit/portable-pixmap";
import PPMImage from "./PPMImage";

export default async function loadPPM(url: string): Promise<PPMImage> {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => {
      const buffer = toBuffer(data);
      const ppm = PortablePixmap.parse(buffer);
      const image = ppm.toRGBA8888() as Uint8ClampedArray;
      return new PPMImage(ppm.width, ppm.height, new ImageData(image, ppm.width, ppm.height));
    });
}

function toBuffer(ab: ArrayBuffer) {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}