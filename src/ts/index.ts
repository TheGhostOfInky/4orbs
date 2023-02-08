import type { QuizParams, HeaderParams, NumObj } from "./types";
import { Orbs, cleanUrl } from "./commons.js";

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
        this.drawAll(this.hpars, this.genRandom());
    }

    blankFull(): void {
        this.ctx.fillStyle = this.params.bg;
        this.ctx.fillRect(0, 0, this.params.width, this.params.height);
    }

    genRandom(): NumObj {
        const rnd06 = (): number => Math.floor(Math.random() * 7);
        const scores: NumObj = {};
        for (const axis of this.quizParams.axes) {
            scores[axis] = rnd06();
        }
        return scores;
    }

    drawRandom(): void {
        this.blankFull();
        this.drawAll(this.hpars, this.genRandom());
    }
}

const windowLoaded = new Promise<void>(resolve => {
    window.addEventListener("load", () => {
        resolve();
    });
});

const [pars, _] = await Promise.all(
    [fetch("./dist/json/params.json"), windowLoaded]
);

const canvasElm = <HTMLCanvasElement>document.getElementById("demo-canvas")!;

const orbs = new BlankableCanvas(canvasElm, await pars.json());

const interval = setInterval(() => orbs.drawRandom(), 2500);