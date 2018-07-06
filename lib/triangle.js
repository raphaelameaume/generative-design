const triangle = ( ctx, [ x0, y0 ], [ x1, y1 ], [ x2, y2 ] ) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
};

export default triangle;