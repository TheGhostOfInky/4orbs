export function makeCanvas(canvas, score: Object, params){
    let ctx = <CanvasRenderingContext2D> canvas.getContext("2d")
    let H: number = 150 + 175*params.axes.length
    canvas.width = 800
    canvas.height = H
    ctx.fillStyle = "#DDD"
    ctx.fillRect(0,0,800,H)
    ctx.fillStyle = "#000"
    ctx.textAlign="left"
    ctx.font="700 80px Montserrat"
    ctx.fillText("4Orbs", 20, 90)
    ctx.textAlign="right"
    ctx.font="300 30px Montserrat"
    ctx.fillText("theghostofinky.github.io/4orbs", 780, 60)
    ctx.fillText("proof of concept", 780, 90)
    for(let i: number = 0; i < params.axes.length; i++ ){
        drawScore(ctx, score[params.axes[i]], params, params.axes[i],250+175*i)
    }
}

function drawScore(ctx, score:number, params, axis:string, height:number){
    let fg: string = "#000"
    ctx.fillStyle = fg
    ctx.fillRect(100,height-2,600,4)
    for(let i:number = 0; i < 7; i++){
        let X:number = 100 + 100*i
        drawCircle(ctx,X,height,12,fg)
        drawCircle(ctx,X,height,8,params.colors[axis][i])
    }
    if(score<=100 && score>=0){
        let match: number = Math.round((score/100)*6)
        let X: number = 100 + 100*match
        drawCircle(ctx,X,height,60,fg)
        drawCircle(ctx,X,height,52,params.colors[axis][match])
        ctx.textAlign="center"
        ctx.font="300 30px Montserrat"
        ctx.fillStyle= fg
        ctx.fillText(params.labels[axis][match],X,height-70)
        let image = new Image()
        image.src = "assets/" + params.images[axis][match]
        image.addEventListener(
            'load',
            () => ctx.drawImage(image,X-40,height-40,80,80), 
            false
            )
    }
}

function drawCircle(ctx, X:number, Y:number, radius:number, color:string){
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(X,Y,radius,0,2*Math.PI)
    ctx.fill()
}