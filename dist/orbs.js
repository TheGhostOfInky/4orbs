import { makeCanvas } from "./canvas.js";
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return parseFloat(pair[1]);
        }
    }
    return (NaN);
}
window.onload = async () => {
    const canvas = document.getElementById("orbcanvas");
    let params = await fetch("json/params.json")
        .then(response => response.json());
    //console.log(params)
    let score = {
        "econ": (100 - getQueryVariable("e")),
        "dipl": (100 - getQueryVariable("d")),
        "govt": getQueryVariable("g"),
        "scty": (100 - getQueryVariable("s"))
    };
    makeCanvas(canvas, score, params);
};
//# sourceMappingURL=orbs.js.map