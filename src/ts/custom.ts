import { Orbs, cleanUrl } from "./commons.js";
import type { NumObj, QuizParams, HeaderParams } from "./types";

class TouchOrbs extends Orbs {
    state: NumObj = {};
    canvasElm: HTMLCanvasElement;
    hPars: HeaderParams;
    constructor(canvas: HTMLCanvasElement, qParams: QuizParams) {
        super(canvas, qParams);
        this.canvasElm = canvas;
        this.canvasElm.addEventListener("click", ev => this.touchEvent(ev, this.canvasElm));

        for (const key of this.quizParams.axes) {
            this.state[key] = 3;
        }

        this.hPars = {
            title: "Touch to change name",
            url: cleanUrl(window.location, "custom"),
            version: this.quizParams.version,
            edition: "Custom"
        };
        this.drawAll(this.hPars, this.state);
        this.preload();
    }
    private blank(index: number): void {
        const height = 150 + (175 * index);
        this.ctx.fillStyle = this.params.bg;
        this.ctx.fillRect(0, height, this.params.width, 180);
    }
    private blankHeader(): void {
        this.ctx.fillStyle = this.params.bg;
        this.ctx.fillRect(0, 0, this.params.width, 150);
    }
    async preload(): Promise<void> {
        for(const axis of Object.values(this.quizParams.images)) {
            for(const img of axis) {
                const elm = new Image();
                elm.src = `./assets/icons/${img}`;
            }
        }
    }

    async touchEvent(event: MouseEvent, canvas: HTMLCanvasElement): Promise<void> {
        const bounds = canvas.getBoundingClientRect();
        const [x, y] = [
            (event.clientX - bounds.left) * (this.quizParams.canvasParams.width / bounds.width),
            (event.clientY - bounds.top) * (this.quizParams.canvasParams.height / bounds.height)
        ];
        if (y > 175 && x > 50 && x < (this.params.width - 40)) {
            const height = (y - 175) % 175;
            if (height > 150)
                return;
            
            const tier = Math.floor((y - 175) / 175);
            const range = this.params.width - 100;
            const level = Math.floor(((x - 50) / range) * 7);
            const key = this.quizParams.axes[tier];
            this.state[key] = level;
            
            const imgSrc = this.getImage(key, level);
            const image = imgSrc ? await this.loadImage(imgSrc): null;
            this.blank(tier);
            this.fillAxis(key, level, image);

        } else if (y < 110 && y > 40 && x < (this.params.width - 180) && x > 40) {
            const name = window.prompt("Enter the desired name: ")?.trim();
            if (name) {
                this.hPars.title = name;
                this.blankHeader();
                this.drawHeader(this.hPars);
            }
        }
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

const orbsCanvas = <HTMLCanvasElement>document.getElementById("custom-canvas")!;

const _orbs = new TouchOrbs(orbsCanvas, await pars.json());

const downloadButton = <HTMLButtonElement>document.getElementById("download-button")!;
downloadButton.addEventListener("click", () => Orbs.downloadCanvas(orbsCanvas));