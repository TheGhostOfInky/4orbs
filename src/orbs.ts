import { makeCanvas } from "./canvas.js";
import type { param } from "./canvas";
type score = {
    [key: string]: Number;
}

function getQueryVariable(variable): number {
       let query: string = window.location.search.substring(1)
       let vars: Array<string> = query.split("&")
       for (let i: number=0; i<vars.length; i++) {
               let pair: Array<string> = vars[i].split("=")
               if(pair[0] == variable) {
                   return parseFloat(pair[1])
                }
       }
       return(NaN);
}

window.onload = async (): Promise<void> => {
    const canvas = <HTMLCanvasElement> document.getElementById("orbcanvas")
    let params: param = await fetch("json/params.json")
        .then(response => response.json())
    let score: score = {
        "econ" : getQueryVariable("e"),
        "dipl" : getQueryVariable("d"),
        "govt" : getQueryVariable("g"),
        "scty" : getQueryVariable("s")
    }
    makeCanvas(canvas,score,params)

}



