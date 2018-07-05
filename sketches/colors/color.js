import { PaperSize, Orientation } from 'penplot';
import { randomFloat, setSeed } from 'penplot/util/random';
import { clipPolylinesToBox } from 'penplot/util/geom';
import Color from 'color';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.LETTER;

export default function createPlot (context, dimensions) {
    const [ width, height ] = dimensions;
    
    const lineCount = 20;
    const segments = 500;
    const radius = 2;

    const mouse = { x: 0, y: 0 };

    const canvas = document.querySelector('canvas');
    canvas.addEventListener('mousemove', ( event ) => {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;

        mouse.x = x;
        mouse.y = y;
    });

    const lines = new Array(lineCount).fill(undefined).map((_, j) => {
        const angleOffset = randomFloat(-Math.PI * 2, Math.PI * 2);
        const angleScale = randomFloat(0.001, 1);

        return new Array(segments).fill(undefined).map((_, i) => {
            const t = i / (segments - 1);
            const angle = (Math.PI * 2 * t + angleOffset) * angleScale;
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            const offset = j * 0.2;
            const r = radius + offset;
            return [ x * r + width / 2, y * r + height / 2 ];
        });
    });

    const innerColor = Color().hsl();
    innerColor.color[1] = 50;
    innerColor.color[2] = 50;

    const extraColor = Color().hsl();
    extraColor.color[1] = 50;
    extraColor.color[2] = 50;
  
    return {
        draw,
        print,
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

        // context.lineWidth = 0.1;

        // lines.forEach(points => {
        //     context.beginPath();
        //     points.forEach(p => context.lineTo(p[0], p[1]));
        //     context.stroke();
        // });
    }
  
    function print () {
        return polylinesToSVG(lines, {
            dimensions
        });
    }
  }