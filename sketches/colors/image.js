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

const sortBySaturation = ( colors ) => {
    const hslColors = colors.map( ( color ) => {
        return color.hsl();
    });

    hslColors.sort( ( a, b ) => {
        return a.color[1] < b.color[1]
    });

    return hslColors;
};

const sortByChannel = ( colors, channel ) => {
    colors.sort( ( a, b ) => {
        return a.color[channel] < b.color[channel]
    });

    return colors;
};

const sortImageData =  ( data, w, h ) => {
    const sortedData = [];

    for ( let i = 0; i < data.length; i+= 4 ) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const m = i / 4;
        const y = Math.floor(m / h);
        const x = m - y * w;

        if ( !sortedData[x] ) {
            sortedData[x] = [];
        }

        sortedData[x][y] = [ r, g, b, a ];
    }

    return sortedData;
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

    image.src = '../../assets/beach.jpg';

    let time = 0;

    window.addEventListener('keypress', () => {
    })

    return {
        draw,
        animate: false,
        background: 'black' // used when exporting the canvas to PNG
    };
  
    function draw () {
        time++;

        if ( loaded && drawn && !imageData ) {
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            draw();
        }
        
        if ( loaded && !drawn ) {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            drawn = true;
            draw();
        }

        if ( loaded && imageData ) {
            loaded = false;
            const tileCount = 200;

            const rectSize = canvas.width / tileCount;
            const colors = [];
            const { data } = imageData;

            const sortedData = sortImageData(data, canvas.width, canvas.height);

            for ( let gridY = 0; gridY < tileCount; gridY++ ) {
                for ( let gridX = 0; gridX < tileCount; gridX++ ) {
                    const px = Math.floor(gridX * rectSize);
                    const py = Math.floor(gridY * rectSize);

                    const [ r, g, b, a ] = sortedData[px][py];

                    colors.push(Color({r, g, b}).alpha(a / 255));
                }
            }

            // const sortedColors = sortByHue(colors);
            // const sortedColors = sortByChannel(colors, 0);
            const sortedColors = sortByBrightness(colors);
            // const sortedColors = sortBySaturation(colors);

            let i = 0;

            context.clearRect(0, 0, canvas.width, canvas.height);

            for ( let gridY = 0; gridY < tileCount; gridY++ ) {
                for ( let gridX = 0; gridX < tileCount; gridX++ ) {
                    context.fillStyle = sortedColors[i].hex();

                    const radius = rectSize * 0.5;

                    context.beginPath();
                    context.arc(gridX * rectSize + radius, gridY * rectSize + radius, radius, 0, 2 * Math.PI, false);
                    context.fill();
                    // context.fillRect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
                    i++;
                }
            }


            // console.log('put image data');
            // context.clearRect(0, 0, width, height);
            // context.putImageData(imageData, 0, 0);
        }
    }
}