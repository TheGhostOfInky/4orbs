import { makeCanvas } from "./canvas.js";
import type { param, score } from "./types";

window.onload = async (): Promise<void> => {
    const canvas = <HTMLCanvasElement> document.getElementById("orbcanvas")
    let params: param = await fetch("json/params.json")
        .then(response => response.json())
    try {
        let scores: score = JSON.parse(atob(window.location.search.substring(1)))
        makeCanvas(canvas,scores,params)
    }
    catch(e) {
        let ctx = <CanvasRenderingContext2D> canvas.getContext("2d")
        canvas.width = 400
        canvas.height = 400
        ctx.fillStyle = "#DDD"
        ctx.fillRect(0,0,400,400)
        ctx.textAlign = "left"
        ctx.font = "400 50px Dongle"
        ctx.fillStyle = "#000"
        let error:string = e.toString()
        let x: number = 23
        for (let i:number= 0;i*x<error.length;i++){
            ctx.fillText(error.substring(i*x,(i+1)*x),30,50+i*30)
        }
    }
}