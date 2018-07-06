import { PaperSize, Orientation } from 'penplot';
import Color from 'color';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.LETTER;

const map = (n, start1, stop1, start2, stop2) => {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

const createRandomColors = ( count ) => {
    const colors = [];

    for ( let i = 0; i < count; i++ ) {
        const color = Color({r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255}).hex();
        colors.push(color);
    }

    return colors;
};

export default function createPlot (context, dimensions) {
    const [ width, height ] = dimensions;

    const maxSize = 50;
    const minSize = 45;

    let tileCountX = Math.floor(Math.random() * maxSize + minSize);
    let tileCountY = Math.floor(Math.random() * maxSize + minSize);

    let colorsLeft = createRandomColors(tileCountY);
    let colorsRight = createRandomColors(tileCountY);

    window.addEventListener('keypress', () => {
        tileCountX = Math.floor(Math.random() * maxSize + minSize);
        tileCountY = Math.floor(Math.random() * maxSize + minSize);

        colorsLeft = createRandomColors(tileCountY);
        colorsRight = createRandomColors(tileCountY);

        draw();
    })

    return {
        draw,
        animate: true,
        background: 'white' // used when exporting the canvas to PNG
    };
  
    function draw () {
        const tileWidth = width / tileCountX;
        const tileHeight = height / tileCountY;

        context.clearRect(0, 0, width, height);

        for ( let gridY = 0; gridY < tileCountY; gridY++ ) {
            const c1 = colorsLeft[gridY];
            const c2 = colorsRight[gridY];

            for ( let gridX = 0; gridX < tileCountX; gridX++ ) {
                const amount = map(gridX, 0, tileCountX - 1, 0, 1);
                
                const x = Math.floor(tileWidth * gridX * 10000) / 10000;
                const y = Math.floor(tileHeight * gridY * 10000) / 10000;

                const c = Color(c1).mix(Color(c2), amount);

                context.fillStyle = c.hex();

                context.fillRect(x, y, tileWidth * 1.1, tileHeight * 1.1);
            }
        }

    }
}