import { makeCanvas } from "./canvas.js";
import type { param, score } from "./types";

//Grabs the scores from the URL, parses them and sends them to the canvas drawing routine
window.onload = async (): Promise<void> => {
    const canvas = <HTMLCanvasElement> document.getElementById("orbcanvas")
    const params: param = await fetch("json/params.json")
        .then(response => response.json())
    try { //Tries to parse the score and draw a canvas
        const scores: score = JSON.parse(atob(window.location.search.substring(1)))
        makeCanvas(canvas,scores,params)
    }
    catch(e: any) { //Displays an error on the canvas in the case of failure
        const ctx = <CanvasRenderingContext2D> canvas.getContext("2d")
        canvas.width = 400
        canvas.height = 400
        ctx.fillStyle = "#DDD"
        ctx.fillRect(0,0,400,400)
        ctx.textAlign = "left"
        ctx.font = "400 50px Dongle"
        ctx.fillStyle = "#000"
        const error:string = e.toString()
        const x: number = 23
        for (let i:number= 0;i*x<error.length;i++){
            ctx.fillText(error.substring(i*x,(i+1)*x),30,50+i*30)
        }
    }
}