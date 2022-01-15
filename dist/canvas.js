export function makeCanvas(canvas, scores, params) {
    let ctx = canvas.getContext("2d");
    let H = 200 + 175 * params.axes.length;
    canvas.width = 850;
    canvas.height = H;
    ctx.fillStyle = "#DDD";
    ctx.fillRect(0, 0, 850, H);
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.font = "700 120px Dongle";
    ctx.fillText("4Orbs", 20, 90);
    ctx.textAlign = "right";
    ctx.font = "400 50px Dongle";
    ctx.fillText("theghostofinky.github.io/4orbs", 830, 60);
    ctx.fillText("proof of concept", 830, 90);
    for (let i = 0; i < params.axes.length; i++) {
        drawScore(ctx, scores[params.axes[i]], params, params.axes[i], 250 + 175 * i);
    }
}
function drawScore(ctx, score, params, axis, height) {
    let fg = "#000";
    ctx.fillStyle = fg;
    ctx.fillRect(125, height - 2, 600, 4);
    for (let i = 0; i < 7; i++) {
        let X = 125 + 100 * i;
        drawCircle(ctx, X, height, 12, fg);
        drawCircle(ctx, X, height, 8, params.colors[axis][i]);
    }
    if (score <= 6 && score >= 0) {
        let X = 125 + 100 * score;
        drawCircle(ctx, X, height, 60, fg);
        drawCircle(ctx, X, height, 52, params.colors[axis][score]);
        ctx.textAlign = "center";
        ctx.font = "400 50px Dongle";
        ctx.fillStyle = fg;
        ctx.fillText(params.labels[axis][score], X, height - 70);
        let image = new Image();
        image.src = "assets/" + params.images[axis][score];
        image.addEventListener('load', () => ctx.drawImage(image, X - 40, height - 40, 80, 80), false);
    }
}
function drawCircle(ctx, X, Y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(X, Y, radius, 0, 2 * Math.PI);
    ctx.fill();
}
//# sourceMappingURL=canvas.js.map