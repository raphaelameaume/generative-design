import { PaperSize, Orientation } from 'penplot';
import Color from 'color';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

const sortByHue = ( colors ) => {
    const hslColors = colors.map( ( color ) => {
        return color.hsl();
    });

    hslColors.sort( ( a, b ) => {
        return a.color[0] < b.color[0]
    });

    return hslColors;
};

const sortByBrightness = ( colors ) => {
    const hslColors = colors.map( ( color ) => {
        return color.hsl();
    });

    hslColors.sort( ( a, b ) => {
        return a.color[2] < b.color[2]
    });

    return hslColors;
};

export default function createPlot (context, dimensions) {
    const [ width, height ] = dimensions;

    let loaded = false;
    let imageData = null;
    let drawn = false;
    const canvas = document.querySelector('canvas');

    const image = new Image();
    image.onload = () => {
        loaded = true;
        draw();
    }

    image.src = '../../assets/buildings.jpeg';



    window.addEventListener('keypress', () => {
    })

    return {
        draw,
        animate: false,
        background: 'white' // used when exporting the canvas to PNG
    };
  
    function draw () {
        if ( loaded && drawn && !imageData ) {
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            console.log('get image data', imageData);
            draw();
        }
        
        if ( loaded && !drawn ) {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            drawn = true;
            draw();

            // console.log(imageData);
        }

        if ( loaded && imageData ) {
            loaded = false;
            const tileCount = canvas.width / 25;
            const rectSize = canvas.width / tileCount;
            const colors = [];
            const { data } = imageData;

            for ( let gridY = 0; gridY < tileCount; gridY++ ) {
                for ( let gridX = 0; gridX < tileCount; gridX++ ) {
                    const px = gridX * rectSize;
                    const py = gridY * rectSize;

                    // console.log(px, py);

                    for ( let i = 0; i < data.length; i+= 4 ) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];

                        const m = i / 4;
                        const y = Math.floor(m / canvas.height);
                        const x = m - y * canvas.width;

                        if ( px === x && y === py ) {
                            colors.push(Color({r, g, b}).alpha(a / 255));
                        }
                    }
                }
            }

            const sortedColors = sortByBrightness(colors);

            let i = 0;

            for ( let gridY = 0; gridY < tileCount; gridY++ ) {
                for ( let gridX = 0; gridX < tileCount; gridX++ ) {
                    context.fillStyle = colors[i].hex();
                    context.fillRect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
                    i++;
                }
            }


            // console.log('put image data');
            // context.clearRect(0, 0, width, height);
            // context.putImageData(imageData, 0, 0);
        }
    }
}