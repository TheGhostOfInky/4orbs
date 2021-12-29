export function makeCanvas(canvas, score, params){
    let ctx = canvas.getContext("2d")
    canvas.width = 800
    canvas.height = 850
    ctx.fillStyle = "#DDD"
    ctx.fillRect(0,0,800,850)
    ctx.fillStyle = "#000"
    ctx.textAlign="left"
    ctx.font="700 80px Montserrat"
    ctx.fillText("4Orbs", 20, 90)
    ctx.textAlign="right"
    ctx.font="300 30px Montserrat"
    ctx.fillText("theghostofinky.github.io/4orbs", 780, 60)
    ctx.fillText("proof of concept", 780, 90)
    drawScore(ctx,score.econ,params,"econ",250)
    drawScore(ctx,score.dipl,params,"dipl",425)
    drawScore(ctx,score.govt,params,"govt",600)
    drawScore(ctx,score.scty,params,"scty",775)
}

function drawScore(ctx,score,params,axis,height){
    let fg = "#000"
    ctx.fillStyle = fg
    ctx.fillRect(100,height-2,600,4)
    for(let i:number = 0; i < 7; i++){
        let X = 100 + 100*i
        ctx.fillStyle = fg
        ctx.beginPath()
        ctx.arc(X,height,12,0,2*Math.PI)
        ctx.fill()
        ctx.fillStyle = params.colors[axis][i]
        ctx.beginPath()
        ctx.arc(X,height,8,0,2*Math.PI)
        ctx.fill()
    }
    if(score<=100 && score>=0){
        let match = Math.round((score/100)*6)
        let X = 100 + 100*match
        ctx.fillStyle = fg
        ctx.beginPath()
        ctx.arc(X,height,60,0,2*Math.PI)
        ctx.fill()
        ctx.fillStyle = params.colors[axis][match]
        ctx.beginPath()
        ctx.arc(X,height,52,0,2*Math.PI)
        ctx.fill()
        ctx.textAlign="center"
        ctx.font="300 30px Montserrat"
        ctx.fillStyle= "#000"
        ctx.fillText(params.labels[axis][match],X,height-70)
        let image = new Image()
        image.src = "assets/" + params.images[axis][match]
        image.addEventListener('load',() => ctx.drawImage(image,X-40,height-40,80,80), false)
    }
}

