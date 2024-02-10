import type { QuizParams, Question, QuizObj, QuizButton } from "./types";
import { loadJson, scoreParser, randomizeArray } from "./commons.js";

const quizText = <HTMLParagraphElement>document.getElementById("question-text")!;
const quizNumber = <HTMLHeadingElement>document.getElementById("question-number")!;
const buttonholder = <HTMLDivElement>document.getElementById("button-holder")!;

class Quiz {
    private questions: Question[];
    private index: number;
    private scores: number[];

    constructor(questions: Question[]) {
        this.questions = questions;
        this.scores = Array(this.questions.length).fill(0);
        this.index = 0;
    }

    next(weight: number): boolean {
        this.scores[this.index] = weight;
        return ++this.index < this.questions.length;
    }

    prev(): boolean {
        return --this.index >= 0;
    }

    get text(): string {
        return this.questions[this.index].question;
    }

    get qn(): string {
        return `Question ${this.index + 1} of ${this.questions.length}`;
    }

    get score(): number[] {
        const keys = Object.keys(this.questions[0].effect);

        const weightedScores = keys.map(k => this.scores.map((x, i) => this.questions[i].effect[k] * x));
        const maxScores = keys.map(k => this.questions.map(x => Math.abs(x.effect[k])).reduce((pv, nv) => pv + nv, 0));

        const reducedScores = weightedScores.map((x, i) => (x.reduce((pv, nv) => pv + nv, 0) + maxScores[i]) / (2 * maxScores[i]));
        return reducedScores.map(x => Math.floor(x * 7));
    }
}


function addButtons<T>(buttonList: T[], fn: (b: T) => HTMLButtonElement, reset = true): void {
    if (reset) {
        while (buttonholder.firstChild) {
            buttonholder.removeChild(buttonholder.firstChild);
        }
    }
    const buttons = buttonList.map(fn);
    buttons.forEach(x => buttonholder.appendChild(x));
}

function updateQuestions(quiz: Quiz): void {
    quizText.textContent = quiz.text;
    quizNumber.textContent = quiz.qn;
}

async function loadQuiz(quizParams: QuizObj, buttons: Record<string, QuizButton>, random: boolean): Promise<void> {
    let questions = await loadJson<Question[]>(quizParams.url);
    if (random) {
        questions = randomizeArray(questions);
    }

    document.title = `4Orbs - ${quizParams.name}`;
    const quiz = new Quiz(questions);

    addButtons(Object.entries(buttons), ([k, v]) => {
        const btn = document.createElement("button");
        btn.textContent = v.text;
        btn.classList.add("button", k);

        btn.addEventListener("click", () => {
            if (quiz.next(v.weight)) {
                updateQuestions(quiz);
            } else {
                const score = quiz.score;
                const enc = scoreParser.encode(score, quizParams.name);
                location.href = `results.html?${enc}`;
            }
        });

        return btn;
    });

    addButtons([null], (_) => {
        const btn = document.createElement("button");
        btn.textContent = "back";
        btn.classList.add("small-button");

        btn.addEventListener("click", () => {
            if (quiz.prev()) {
                updateQuestions(quiz);
            } else {
                initialize();
            }
        });

        return btn;
    }, false);

    updateQuestions(quiz);
}

async function initialize(): Promise<void> {
    const params = await loadJson<QuizParams>("params");

    quizText.textContent = "Select a test to take:";
    quizNumber.textContent = "Test selection";
    document.title = "4Orbs - Quiz selection";

    const quizzes = Object.values(params.quizzes).map(x => [[x, false], [x, true]]).flat(1) as [QuizObj, boolean][];

    addButtons(quizzes, ([v, rand]) => {
        const btn = document.createElement("button");
        btn.textContent = v.name + (rand ? " (random)" : "");
        btn.classList.add("button");
        btn.addEventListener("click", () => loadQuiz(v, params.buttons, rand));
        return btn;
    });
}

window.addEventListener("load", () => initialize()
    .catch(e => {
        console.error(e);
        alert(String(e));
    })
);