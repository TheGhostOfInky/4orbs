import { Orbs, b64dec, cleanUrl } from "./commons.js"
import type { QuizParams, HeaderParams, ScoreObj } from "./types"

const windowLoaded = new Promise<void>(resolve => {
    window.addEventListener("load", () => {
        resolve();
    });
});

const [pars, _] = await Promise.all(
    [fetch("./dist/json/params.json"), windowLoaded]
);

const orbsCanvas = <HTMLCanvasElement>document.getElementById("orb-canvas")!

const quizParams: QuizParams = await pars.json();

const orbs = new Orbs(orbsCanvas, quizParams);

const urlSearch = b64dec(window.location.search.substring(1));

const scores: ScoreObj = JSON.parse(urlSearch);

const params: HeaderParams = {
    title: document.title,
    url: cleanUrl(window.location, "results"),
    version: quizParams.version,
    edition: scores.quiz
};

orbs.drawAll(params, scores.scores);

document.getElementById("download-button")!.onclick = () => {
    Orbs.downloadCanvas(orbsCanvas);
};
