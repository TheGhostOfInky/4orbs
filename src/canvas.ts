export type param = {
    axes: Array<string>;
    colors: {
        [key: string]: Array<string>;
    };
    labels: {
        [key: string]: Array<string>;
    };
    images: {
        [key: string]: Array<string>;
    };
}
export function makeCanvas(canvas: HTMLCanvasElement, score: Object, params: param): void {
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
        drawScore(ctx, score[params.axes[i]], params, params.axes[i],250+175*i)
    }
}

function drawScore(ctx: CanvasRenderingContext2D, score:number, params: param, axis:string, height:number): void {
    let fg: string = "#000"
    ctx.fillStyle = fg
    ctx.fillRect(125,height-2,600,4)
    for(let i:number = 0; i < 7; i++){
        let X:number = 125 + 100*i
        drawCircle(ctx,X,height,12,fg)
        drawCircle(ctx,X,height,8,params.colors[axis][i])
    }
    if(score<=100 && score>=0){
        let match: number = Math.round((score/100)*6.98 - 0.49)
        let X: number = 125 + 100*match
        drawCircle(ctx,X,height,60,fg)
        drawCircle(ctx,X,height,52,params.colors[axis][match])
        ctx.textAlign = "center"
        ctx.font = "400 50px Dongle"
        ctx.fillStyle = fg
        ctx.fillText(params.labels[axis][match],X,height-70)
        let image = <HTMLImageElement> new Image()
        image.src = "assets/" + params.images[axis][match]
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