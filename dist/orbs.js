import { makeCanvas } from "./canvas.js";
window.onload = async () => {
    const canvas = document.getElementById("orbcanvas");
    const params = await fetch("json/params.json")
        .then(response => response.json());
    try {
        const scores = JSON.parse(atob(window.location.search.substring(1)));
        makeCanvas(canvas, scores, params);
    }
    catch (e) {
        const ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = 400;
        ctx.fillStyle = "#DDD";
        ctx.fillRect(0, 0, 400, 400);
        ctx.textAlign = "left";
        ctx.font = "400 50px Dongle";
        ctx.fillStyle = "#000";
        const error = e.toString();
        const x = 23;
        for (let i = 0; i * x < error.length; i++) {
            ctx.fillText(error.substring(i * x, (i + 1) * x), 30, 50 + i * 30);
        }
    }
};
//# sourceMappingURL=orbs.js.map