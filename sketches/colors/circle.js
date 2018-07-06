import { PaperSize, Orientation } from 'penplot';
import Color from 'color';


export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.LETTER;

const triangle = ( ctx, [ x0, y0 ], [ x1, y1 ], [ x2, y2 ] ) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
};

const degToRad = ( angleInDegrees ) => {
    return angleInDegrees * Math.PI / 180;
};

export default function createPlot (context, dimensions) {
    const [ width, height ] = dimensions;
    
    let segments = 4;
    const radius = height * 0.35;

    const circleColor = Color().hsl();

    window.addEventListener('keypress', ( event ) => {
        segments = Math.floor(Math.random() * 60 + 5);
    });

    return {
        draw,
        animate: true,
        background: 'white' // used when exporting the canvas to PNG
    };
  
    function draw () {
        context.clearRect(0, 0, width, height);

        const delta = 360 / segments;

        for ( let angle = 0; angle < 360; angle += delta  ) {
            const x0 = width * 0.5 + Math.cos(degToRad(angle)) * radius;
            const y0 = height * 0.5 + Math.sin(degToRad(angle)) * radius;

            const x1 = width * 0.5 + Math.cos(degToRad(angle + delta)) * radius;
            const y1 = height * 0.5 + Math.sin(degToRad(angle + delta)) * radius;

            triangle(context, [width * 0.5, height * 0.5], [x0, y0], [x1, y1]);


            circleColor.color[0] = angle;
            circleColor.color[1] = 100;
            circleColor.color[2] = 50;

            context.fillStyle = circleColor.hex(); 

            context.fill();
        }
    }
  }