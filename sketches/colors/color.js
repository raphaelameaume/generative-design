import { PaperSize, Orientation } from 'penplot';
import Color from 'color';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.LETTER;

export default function createPlot (context, dimensions) {
    const [ width, height ] = dimensions;
    
    const mouse = { x: 0, y: 0 };

    const canvas = document.querySelector('canvas');
    canvas.addEventListener('mousemove', ( event ) => {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;

        mouse.x = x;
        mouse.y = y;
    });

    const innerColor = Color().hsl();
    innerColor.color[1] = 50;
    innerColor.color[2] = 50;

    const extraColor = Color().hsl();
    extraColor.color[1] = 50;
    extraColor.color[2] = 50;
  
    return {
        draw,
        animate: true,
        background: 'white' // used when exporting the canvas to PNG
    };
  
    function draw () {
        const size = Math.max(0.1, Math.min(mouse.x * width, 0.8 * height));

        context.clearRect(0, 0, width, height);

        extraColor.color[0] = 360 - mouse.y * 360;
        const c0 = extraColor.hex();
        context.fillStyle = c0;

        context.fillRect(0, 0, width, height);

        innerColor.color[0] = mouse.y * 360;
        const c1 = innerColor.hex();
        context.fillStyle = c1;

        context.fillRect(width * 0.5 - size * 0.5, height * 0.5 - size * 0.5, size, size);
    }
  }