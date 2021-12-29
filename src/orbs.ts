import { makeCanvas } from "./canvas.js";

function getQueryVariable(variable):number{
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

window.onload = async () => {
    const canvas = <HTMLCanvasElement> document.getElementById("orbcanvas")
    let params = await fetch("json/params.json")
        .then(response => response.json())
    let score = {
        "econ" : (100-getQueryVariable("e")),
        "dipl" : (100-getQueryVariable("d")),
        "govt" : getQueryVariable("g"),
        "scty" : (100-getQueryVariable("s"))
    }
    makeCanvas(canvas,score,params)

}



