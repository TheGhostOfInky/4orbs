import type { QuizParams, HeaderParams } from "./types";
import { Orbs, cleanUrl, loadJson } from "./commons.js";

class BlankableCanvas extends Orbs {
    hpars: HeaderParams;
    constructor(elm: HTMLCanvasElement, params: QuizParams) {
        super(elm, params);
        this.hpars = {
            title: document.title,
            url: cleanUrl(window.location, "index"),
            version: this.quizParams.version,
            edition: "demo"
        }
    }

    blankFull(): void {
        this.ctx.fillStyle = this.params.bg;
        this.ctx.fillRect(0, 0, this.params.width, this.params.height);
    }

    genRandom(): Record<string, number> {
        const rnd06 = (): number => Math.floor(Math.random() * 7);
        const scores = {} as Record<string, number>;
        for (const axis of this.quizParams.axes) {
            scores[axis] = rnd06();
        }
        return scores;
    }

    drawRandom(): Promise<void[]> {
        this.blankFull();
        return this.drawAll(this.hpars, this.genRandom());
    }
}

const windowLoaded = new Promise<void>(resolve => {
    window.addEventListener("load", () => {
        resolve();
    });
});

const [pars, _] = await Promise.all(
    [loadJson<QuizParams>("params"), windowLoaded]
);

const canvasImg = <HTMLImageElement>document.getElementById("demo-canvas1")!;
const canvasImgBg = <HTMLImageElement>document.getElementById("demo-canvas2")!;
const canvasElm = document.createElement("canvas");

const orbs = new BlankableCanvas(canvasElm, pars);

async function drawCanvas() {
    canvasImgBg.src = canvasElm.toDataURL("image/png");
    canvasImg.classList.add("transparent")
    await Promise.all(
        [orbs.drawRandom(),
        new Promise(r => setTimeout(r, 1250))]
    );
    canvasImg.src = canvasElm.toDataURL("image/png");
    canvasImg.classList.remove("transparent");
}

await orbs.drawRandom();
drawCanvas();

const interval = setInterval(drawCanvas, 2500);

