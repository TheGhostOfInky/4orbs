import { Orbs, cleanUrl, scoreParser, loadJson } from "./commons.js"
import type { QuizParams, HeaderParams } from "./types"

const windowLoaded = new Promise<void>(resolve => {
    window.addEventListener("load", () => {
        resolve();
    });
});

const [pars, _] = await Promise.all(
    [loadJson<QuizParams>("params"), windowLoaded]
);

const orbsCanvas = <HTMLCanvasElement>document.getElementById("orb-canvas")!

const orbs = new Orbs(orbsCanvas, pars);

const [quiz, rawScores] = scoreParser.decode(window.location.search.substring(1));
const scores = Object.fromEntries(pars.axes.map((x, i) => [x, rawScores[i]])) as Record<string, number>;

const params: HeaderParams = {
    title: document.title,
    url: cleanUrl(window.location, "results"),
    version: pars.version,
    edition: quiz
};

orbs.drawAll(params, scores);

document.getElementById("download-button")!.onclick = () => {
    Orbs.downloadCanvas(orbsCanvas);
};
