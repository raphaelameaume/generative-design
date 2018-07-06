import { PaperSize, Orientation } from 'penplot';
import Color from 'color';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.LETTER;

export default function createPlot (context, dimensions) {
    const [ width, height ] = dimensions;
    
    const mouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', ( event ) => {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;

        mouse.x = x;
        mouse.y = y;
    });

    const c = Color().hsl();

   

    return {
        draw,
        animate: true,
        background: 'white' // used when exporting the canvas to PNG
    };
  
    function draw () {
        const size = Math.max(0.1, Math.min(mouse.x * width, 0.8 * height));

        context.clearRect(0, 0, width, height);

        const stepX = mouse.x + 0.2;
        const stepY = mouse.y + 0.2;

        for ( let gridY = 0; gridY < height; gridY += stepY ) {
            for ( let gridX = 0; gridX < width; gridX += stepX ) {
                c.color[0] = gridX / width * 360;
                c.color[1] = ( height - gridY ) / height * 100;
                c.color[2] = 50;

                context.fillStyle = c.hex();

                context.fillRect(gridX, gridY, stepX, stepY);
            }
        }
    }
  }