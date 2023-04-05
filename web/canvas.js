// const { createCanvas, loadImage } = require('canvas')
import express from "express";
import serveStatic from "serve-static";
const app = express();
// app.use(serveStatic(STATIC_PATH, { index: false }));
import { createCanvas, loadImage } from "canvas"

const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

// Write "Awesome!"
ctx.font = '30px Impact'
ctx.rotate(0.1)
ctx.fillText('Awesome!', 50, 100)

// Draw line under text
var text = ctx.measureText('Awesome!')
ctx.strokeStyle = 'rgba(0,0,0,0.5)'
ctx.beginPath()
ctx.lineTo(50, 102)
ctx.lineTo(50 + text.width, 102)
ctx.stroke()

// Draw cat with lime helmet
// loadImage('examples/images/lime-cat.jpg').then((image) => {
//   ctx.drawImage(image, 50, 0, 70, 70)

//   console.log('<img src="' + canvas.toDataURL() + '" />')
// })
app.get("/test", (req, res) => {
    var context = canvas.getContext("2d");
    context.font = "30pt Arial";
    context.textAlign = "center";

    var centerX = canvas.width / 2;
    var centerY = canvas.height - 30;
    var angle = Math.PI * 0.8; // radians
    var radius = 180;
    var str = "Shopify";

    context.save();
    context.translate(centerX, centerY);
    context.rotate(-1 * angle / 2);
    context.rotate(-1 * (angle / str.length) / 2);
    for (var n = 0; n < str.length; n++) {
        context.rotate(angle / str.length);
        context.save();
        context.translate(0, -1 * radius);
        var char = str[n];
        context.fillText(char, 0, 0);
        context.restore();
    }
    context.restore();
    console.log(context)
    res.end();
    // res.send({context});
    // res.send('hello');
    // Draw cat with lime helmet
    // loadImage('test.jpg').then((image) => {
    //     ctx.drawImage(image, 50, 0, 70, 70)

    //     res.send('<img src="' + canvas.toDataURL() + '" />');
    //     console.log('<img src="' + canvas.toDataURL() + '" />')
    // });
});
app.listen(5000);