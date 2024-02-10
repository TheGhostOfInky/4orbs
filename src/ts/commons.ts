import type { CanvasParams, HeaderParams, QuizParams, ScoreObj } from "./types";

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

    protected loadImage(url: string): Promise<HTMLImageElement> {
        const image = new Image();
        image.src = "./assets/icons/" + url;
        return new Promise<HTMLImageElement>((resolve, reject) => {
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("abort", reject);
        });
    }

    protected drawImage(image: HTMLImageElement, x: number, y: number): void {
        this.ctx.drawImage(image, x - 40, y - 40, 80, 80);
    }

    protected getImage(axis: string, score: number): string | null {
        if (!this.checkValue(score)) {
            return null;
        }
        return this.quizParams.images[axis][score]
    }

    private getRangeSteps(range: number): number[] {
        return Array(7).fill(0).map(
            (_, i) => 125 + (range / 6) * i
        );
    }

    protected fillAxis(axis: string, score: number, image: HTMLImageElement | null): void {
        const index = this.quizParams.axes.indexOf(axis);
        const height = 250 + 175 * index;
        const range = this.params.width - 250;

        this.ctx.fillStyle = this.params.fg;
        this.ctx.fillRect(125, height, range, 4);
        const rangeSteps = this.getRangeSteps(range);

        for (const [ind, dot] of rangeSteps.entries()) {
            this.drawCircle(dot, height, 12);
            const color = this.quizParams.colors[axis][ind];
            this.drawCircle(dot, height, 8, color);
        }
        if (image) {
            const bigX = rangeSteps[score];
            const color = this.quizParams.colors[axis][score];
            const ideo = this.quizParams.labels[axis][score];
            this.ctx.textAlign = "center";
            this.ctx.font = this.params.bodyFont;
            this.ctx.fillStyle = this.params.fg;
            this.ctx.fillText(ideo, bigX, height - 70, 225)
            this.drawCircle(bigX, height, 60);
            this.drawCircle(bigX, height, 52, color);
            this.drawImage(image, bigX, height);
        }
    }

    async drawAxis(axis: string, score: number): Promise<void> {
        const imgSrc = this.getImage(axis, score);
        const image = imgSrc ? await this.loadImage(imgSrc) : null;
        this.fillAxis(axis, score, image);
    }

    drawAll(hParams: HeaderParams, scores: Record<string, number>): Promise<void[]> {
        this.drawHeader(hParams);
        const promises = [];
        for (const [k, v] of Object.entries(scores)) {
            if (this.checkValue(v))
                promises.push(this.drawAxis(k, v));
            else
                throw new Error(`Invalid score: ${k}: ${v}`);
        }
        return Promise.all(promises);
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
    baseLoc = baseLoc.replace(/\/$/gmi, "");
    const page = new RegExp(`\/${pageName}(.htm[l]?)?$`, "gmi")
    if (baseLoc.match(page)) {
        baseLoc = baseLoc.replace(page, "");
    }
    return baseLoc;
}

function buffToB64(input: ArrayBuffer): string {
    const u8Arr = new Uint8Array(input);

    return btoa(
        String.fromCharCode(...u8Arr)
    );
}

function b64toBuff(input: string): Uint8Array {
    return new Uint8Array(
        [...atob(input)].map(x => x.charCodeAt(0))
    );
}

export async function loadJson<T>(file: string): Promise<T> {
    const cached = sessionStorage.getItem(`cached-${file}`);
    if (cached) {
        return JSON.parse(cached) as T;
    }

    const resp = await fetch(`./dist/json/${file}.json`);
    const ctype = resp.headers.get("Content-Type");

    if (!ctype || !ctype.toLowerCase().startsWith("application/json")) {
        throw new Error(`Invalid response Content-Type: ${ctype}`);
    }

    if (resp.status > 299) {
        throw new Error(`Recieved error response: ${resp.status}; Text: ${resp.text}`);
    }

    const text = await resp.text();
    sessionStorage.setItem(`cached-${file}`, text);

    return JSON.parse(text) as T;
}

function concatBuffers(...buffers: ArrayBuffer[]): Uint8Array {
    const sizes = buffers.map(x => x.byteLength);
    const fullSize = sizes.reduce((pn, cn) => pn + cn, 0);

    const concatBuff = new Uint8Array(fullSize);

    for (const [i, buf] of buffers.entries()) {
        const offset = i >= 1 ? sizes[i - 1] : 0;
        concatBuff.set(new Uint8Array(buf), offset);
    }

    return concatBuff;
}

function scoreToBuff(score: number[]): Uint8Array {
    const size = score.length;
    if (size > 255) {
        throw new Error("Score array too large");
    }

    const arr = [size];
    for (let i = 0; i < size; i += 2) {
        const [a, b] = [score[i], score[i + 1] ?? 0];
        arr.push((a << 4) | b);
    }

    return new Uint8Array(arr);
}

function buff2score(buff: ArrayBuffer): [name: string, scores: number[]] {
    const u8arr = new Uint8Array(buff);
    const scoreSize = u8arr[0];
    const numBound = Math.ceil(scoreSize / 2) + 1;

    const numberSlice = new Uint8Array(u8arr.slice(1, numBound));
    const scores = [] as number[];

    for (const elm of numberSlice) {
        const [a, b] = [(elm & 0xF0) >> 4, elm & 0xF];
        scores.push(a, b);
    }

    if (scores.length > scoreSize) {
        scores.pop();
    }

    const name = (new TextDecoder).decode(u8arr.slice(numBound));

    return [name, scores];
}

function randInt(upper: number): number {
    return Math.floor(Math.random() * upper);
}

export function randomizeArray<T>(input: T[]): T[] {
    const clone = structuredClone(input);

    for (let i = clone.length; i > 1; i--) {
        const n = randInt(i);
        [clone[i - 1], clone[n]] = [clone[n], clone[i - 1]];
    }
    return clone;
}

export const scoreParser = {
    encode: function (score: number[], name: string): string {
        const scoreBuff = scoreToBuff(score);
        const nameBuff = (new TextEncoder).encode(name);
        const concatBuff = concatBuffers(scoreBuff, nameBuff);

        return buffToB64(concatBuff);
    },

    decode: function (input: string): [name: string, scores: number[]] {
        if (input.startsWith("eyJxdWl6I")) {
            //DEPRECATED: Fallback for old versions
            const dec = (new TextDecoder).decode(b64toBuff(input));
            const { quiz, scores } = JSON.parse(dec) as ScoreObj;
            return [quiz, Object.values(scores)];
        } else {
            const dec = b64toBuff(input);
            return buff2score(dec);
        }
    }
}