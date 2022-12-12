import PPMImage from "./PPMImage";

export default function imgradient(image: PPMImage): number[][] {
    const xgrad: number[][] = [];
    const ygrad: number[][] = [];

    const gradient: number[][] = [];

    // Pour chaque pixel  
    for (let x = 0; x < image.width; x++) {
        xgrad[x] = [];
        ygrad[x] = [];
        for (let y = 0; y < image.height; y++) {
            // on calcule la différence avec son voisin de gauche (gradient colonne) :
            if(x > 0) {
                xgrad[x][y] = image.pixel(x, y).lab.l - image.pixel(x-1, y).lab.l;
            } else {
                xgrad[x][y] = image.pixel(x, y).lab.l;
            }
            // on calcule la différence avec son voisin du haut (gradient ligne) :
            if(y > 0) {
                ygrad[x][y] = image.pixel(x, y).lab.l - image.pixel(x, y-1).lab.l;
            } else {
                ygrad[x][y] = image.pixel(x, y).lab.l;
            }
        }
    }

    // On a les coordonnées du vecteur dans xgrad, ygrad
    for (let x = 0; x < image.width; x++) {
        gradient[x] = [];
        for (let y = 0; y < image.height; y++) {
            // On calcule la norme du vecteur en chaque pixel, plus elle est élevée, plus il y a un contraste
            gradient[x][y] = Math.sqrt(Math.pow(xgrad[x][y], 2) + Math.pow(ygrad[x][y], 2));
        }
    }

    return gradient;
}