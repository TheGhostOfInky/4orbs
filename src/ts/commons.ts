import type { CanvasParams, HeaderParams, QuizParams, NumObj } from "./types";

export class Orbs {
    ctx: CanvasRenderingContext2D;
    params: CanvasParams;
    quizParams: QuizParams;
    constructor(canvas: HTMLCanvasElement, qParams: QuizParams) {
        this.ctx = canvas.getContext("2d")!;
        this.quizParams = qParams;
        this.params = this.quizParams.canvasParams;
        canvas.height = this.params.height;
        canvas.width = this.params.width;
        this.ctx.fillStyle = this.params.bg;
        this.ctx.fillRect(0, 0, this.params.width, this.params.height);
    }

    drawHeader(params: HeaderParams): void {
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = this.params.fg;
        this.ctx.font = this.params.titleFont;
        this.ctx.fillText(params.title, 20, 100, this.params.width - 160);

        this.ctx.textAlign = "right";
        this.ctx.font = this.params.bodyFont;
        const leftSide = this.params.width - 20;
        this.ctx.fillText(params.url, leftSide, 40);
        this.ctx.fillText(params.version, leftSide, 70);
        this.ctx.fillText(params.edition, leftSide, 100);
    }

    protected drawCircle(x: number, y: number, r: number, color: string = this.params.fg): void {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    protected checkValue(val: number): boolean {
        return (Number.isInteger(val) && val > -1 && val < 7);
    }

    protected async drawImage(url: string, x: number, y: number): Promise<void> {
        const image = new Image();
        image.src = "./assets/icons/" + url;
        return new Promise<void>((resolve, reject) => {
            image.addEventListener("load", () => {
                this.ctx.drawImage(image, x - 40, y - 40, 80, 80);
                resolve();
            });
            image.addEventListener("abort", error => {
                reject(error);
            });
        });
    }

    drawAxis(axis: string, score: number): Promise<void> {
        const index = this.quizParams.axes.indexOf(axis);
        const height = 250 + 175 * index;
        const range = this.params.width - 250;
        this.ctx.fillStyle = this.params.fg;
        this.ctx.fillRect(125, height, range, 4);

        const rangeSteps = new Array(7).fill(0).map(
            (_, i) => 125 + (range / 6) * i
        );
        for (const [ind, dot] of rangeSteps.entries()) {
            this.drawCircle(dot, height, 12);
            const color = this.quizParams.colors[axis][ind];
            this.drawCircle(dot, height, 8, color);
        }
        if (this.checkValue(score)) {
            const bigX = rangeSteps[score];
            const color = this.quizParams.colors[axis][score];
            const ideo = this.quizParams.labels[axis][score];
            this.ctx.textAlign = "center";
            this.ctx.font = this.params.bodyFont;
            this.ctx.fillStyle = this.params.fg;
            this.ctx.fillText(ideo, bigX, height - 70, 225)
            this.drawCircle(bigX, height, 60);
            this.drawCircle(bigX, height, 52, color);
            const img = this.quizParams.images[axis][score];
            return this.drawImage(img, bigX, height);
        } else
            return new Promise<void>(r => r());
    }

    drawAll(hParams: HeaderParams, scores: NumObj): void {
        this.drawHeader(hParams);
        for (const [k, v] of Object.entries(scores)) {
            if (this.checkValue(v))
                this.drawAxis(k, v);
            else
                throw new Error(`Invalid score: ${k}: ${v}`);
        }
    }
    static downloadCanvas(canvas: HTMLCanvasElement): void {
        const link = document.createElement("a");
        const date = (new Date).toISOString();
        link.download = `${document.title}-${date}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    }
}

export function cleanUrl(loc: Location, pageName: string | null = null): string {
    let baseLoc = loc.search ? loc.href.split(loc.search)[0] : loc.href;
    baseLoc = baseLoc.replace(/^https?\:\/\//gmi, "");
    baseLoc = baseLoc.replace(/\/$/gmi,"");
    const page = new RegExp(`\/${pageName}(.htm[l]?)?$`, "gmi")
    if (baseLoc.match(page)) {
        baseLoc = baseLoc.replace(page, "");
    }
    return baseLoc;
}

export function b64enc(input: string): string {
    const encoder: TextEncoder = new TextEncoder();
    const unicodeBuffer: Uint8Array = encoder.encode(input);

    return window.btoa(
        String.fromCharCode(
            ...unicodeBuffer
        )
    );
}

export function b64dec(input: string): string {
    const rawDecode: string = window.atob(input);

    const unicodeBuffer: Uint8Array = new Uint8Array(
        [...rawDecode].map(
            (_, i) => rawDecode.charCodeAt(i)
        )
    );
    const decoder: TextDecoder = new TextDecoder("utf-8");
    return decoder.decode(unicodeBuffer);
}