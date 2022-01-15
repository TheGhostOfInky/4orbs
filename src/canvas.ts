import type { param, score } from "./types"
export function makeCanvas(canvas: HTMLCanvasElement, scores: score, params: param): void {
    let ctx = <CanvasRenderingContext2D> canvas.getContext("2d")
    let H: number = 200 + 175*params.axes.length
    canvas.width = 850
    canvas.height = H
    ctx.fillStyle = "#DDD"
    ctx.fillRect(0,0,850,H)
    ctx.fillStyle = "#000"
    ctx.textAlign = "left"
    ctx.font = "700 120px Dongle"
    ctx.fillText("4Orbs", 20, 90)
    ctx.textAlign = "right"
    ctx.font = "400 50px Dongle"
    ctx.fillText("theghostofinky.github.io/4orbs", 830, 60)
    ctx.fillText("proof of concept", 830, 90)
    for(let i: number = 0; i < params.axes.length; i++ ){
        drawScore(ctx, scores[params.axes[i]], params, params.axes[i],250+175*i)
    }
}

function drawScore(ctx: CanvasRenderingContext2D, score: number, params: param, axis:string, height:number): void {
    let fg: string = "#000"
    ctx.fillStyle = fg
    ctx.fillRect(125,height-2,600,4)
    for(let i:number = 0; i < 7; i++){
        let X:number = 125 + 100*i
        drawCircle(ctx,X,height,12,fg)
        drawCircle(ctx,X,height,8,params.colors[axis][i])
    }
    if(score<=6 && score>=0){
        let X: number = 125 + 100*score
        drawCircle(ctx,X,height,60,fg)
        drawCircle(ctx,X,height,52,params.colors[axis][score])
        ctx.textAlign = "center"
        ctx.font = "400 50px Dongle"
        ctx.fillStyle = fg
        ctx.fillText(params.labels[axis][score],X,height-70)
        let image = <HTMLImageElement> new Image()
        image.src = "assets/" + params.images[axis][score]
        image.addEventListener(
            'load',
            () => ctx.drawImage(image,X-40,height-40,80,80), 
            false
            )
    }
}

function drawCircle(ctx: CanvasRenderingContext2D, X:number, Y:number, radius:number, color:string): void {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(X,Y,radius,0,2*Math.PI)
    ctx.fill()
}