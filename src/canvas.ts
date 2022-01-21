import type { param, score } from "./types"
//Draws the base of the canvas and orders the drawing of each axis
export function makeCanvas(canvas: HTMLCanvasElement, scores: score, params: param): void {
    const ctx = <CanvasRenderingContext2D> canvas.getContext("2d")
    const H: number = 200 + 175*params.axes.length //Calculates height based on the number of axes
    canvas.width = 850
    canvas.height = H
    ctx.fillStyle = "#DDD" //Draws canvas 
    ctx.fillRect(0,0,850,H)
    ctx.fillStyle = "#000" //Draws information text
    ctx.textAlign = "left"
    ctx.font = "700 120px Dongle" 
    ctx.fillText("4Orbs", 20, 90)
    ctx.textAlign = "right"
    ctx.font = "400 50px Dongle"
    ctx.fillText("theghostofinky.github.io/4orbs", 830, 60)
    ctx.fillText("proof of concept", 830, 90)
    for(let i: number = 0; i < params.axes.length; i++ ){ //Draws each axis
        drawScore(ctx, scores[params.axes[i]], params, params.axes[i],250+175*i)
    }
}
//Draws each axis 1 by 1 
function drawScore(ctx: CanvasRenderingContext2D, score: number, params: param, axis:string, height:number): void {
    const fg: string = "#000"
    ctx.fillStyle = fg
    ctx.fillRect(125,height-2,600,4)
    for(let i:number = 0; i < 7; i++){ //Draws each circle in the axis with the colors in the parameters 
        const X:number = 125 + 100*i
        drawCircle(ctx,X,height,12,fg)
        drawCircle(ctx,X,height,8,params.colors[axis][i])
    }
    if(score<=6 && score>=0 && Number.isInteger(score)){ //Checks if score is valid
        const X: number = 125 + 100*score
        drawCircle(ctx,X,height,60,fg) //Draws large circle
        drawCircle(ctx,X,height,52,params.colors[axis][score])
        ctx.textAlign = "center"
        ctx.font = "400 50px Dongle" 
        ctx.fillStyle = fg
        ctx.fillText(params.labels[axis][score],X,height-70)
        const image = <HTMLImageElement> new Image() //Creates new image element
        image.src = "assets/" + params.images[axis][score]
        image.addEventListener( //Once image has loaded, draws the icon on canvas
            'load',
            () => ctx.drawImage(image,X-40,height-40,80,80), 
            false
            )
    } else { //Draws "invalid value" if invalid score
        ctx.textAlign = "center"
        ctx.font = "400 50px Dongle"
        ctx.fillStyle = fg
        ctx.fillText("Invalid value",425,height-30)
    }
}
//Draws a circle with the fed parameters
function drawCircle(ctx: CanvasRenderingContext2D, X:number, Y:number, radius:number, color:string): void {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(X,Y,radius,0,2*Math.PI)
    ctx.fill()
}