import type { QuizParams, Question, NumObj, ScoreList, ScoreObj, QuizObj } from "./types";
import { b64enc } from "./commons.js"
let questions: Question[]
let qn: number
let max: NumObj
let userScore: ScoreList
let params: QuizParams
let quizName: string

//Once the browser window has loaded, runs the selection menu
window.onload = select_quiz;

//Displays the selection menu for picking each quiz
async function select_quiz(): Promise<void> {
    params = await (await fetch("./dist/json/params.json")).json(); //Fetches test paramters
    document.getElementById("question-text")!.innerHTML = "Select a test to take:";
    document.getElementById("question-number")!.innerHTML = "Test selection";
    const buttonholder = <HTMLDivElement>document.getElementById("button-holder");
    while (buttonholder.firstChild) { //Deletes all buttons
        buttonholder.removeChild(buttonholder.firstChild);
    }
    for (const quiz of Object.values(params.quizzes)) { //Creates new buttons based on the available quizzes
        const newbutton = <HTMLButtonElement>document.createElement("BUTTON");
        newbutton.innerHTML = quiz.name;
        newbutton.classList.add("button");
        newbutton.addEventListener("click", () => parse_questions(quiz));
        buttonholder.appendChild(newbutton);
    }
}

//Parses the questions from the selected quiz and creates the buttons
async function parse_questions(quiz: QuizObj): Promise<void> {
    quizName = quiz.name;
    qn = 0;
    max = {};
    userScore = {};
    questions = await (await fetch(quiz.url)).json();
    const buttonholder = <HTMLDivElement>document.getElementById("button-holder")
    while (buttonholder.firstChild) { //Deletes all buttons
        buttonholder.removeChild(buttonholder.firstChild);
    }
    for (const [key, value] of Object.entries(params.buttons)) { //Adds all question buttons
        const newbutton = <HTMLButtonElement>document.createElement("BUTTON");
        newbutton.innerHTML = value.text;
        newbutton.classList.add("button");
        newbutton.classList.add(key);
        newbutton.addEventListener("click", () => next_question(value.weight));
        buttonholder.appendChild(newbutton);
    }
    let newbutton = <HTMLButtonElement>document.createElement("BUTTON"); //Adds back button
    newbutton.innerHTML = "back";
    newbutton.classList.add("small_button");
    newbutton.addEventListener("click", prev_question);
    buttonholder.appendChild(newbutton);
    for (const axis of params.axes) { //Creates maximum score object and answer arrays 
        userScore[axis] = new Array(questions.length);
        max[axis] = 0;
    }
    for (const question of questions) { //Calculates maximum score
        for (const axis of params.axes) {
            max[axis] += Math.abs(question.effect[axis]);
        }
    }
    init_question();
}

//Initializes the current question
function init_question(): void {
    document.getElementById("question-text")!.innerHTML = questions[qn].question;
    document.getElementById("question-number")!.innerHTML = `Question ${qn + 1} of ${questions.length}`;
}

//Proceeds to the next question
function next_question(mult: number): void {
    for (const axis of params.axes) {
        userScore[axis][qn] = mult * questions[qn].effect[axis];
    }
    qn++;
    if (qn < questions.length) { //Re-initializes questions if questions are left, otherwise goes to results
        init_question();
    } else {
        results();
    }
}

//Returns to the previous question
function prev_question(): void {
    if (qn == 0) { //If first question returns to quiz selection menu
        select_quiz();
    } else { //Otherwise rolls question number 1 back and re-initalizes questions
        qn--;
        init_question();
    }
}

//Calculates final scores and transfers them to the results page
function results(): void {
    const scoreObj: ScoreObj = {
        quiz: quizName,
        scores: {}
    };
    for (const axis of params.axes) {
        const total: number = userScore[axis].reduce((a, b) => a + b, 0);
        const ratio: number = (max[axis] + total) / (2 * max[axis]);
        scoreObj.scores[axis] = Math.floor(ratio * 7);
    }
    location.href = "results.html?" + b64enc(JSON.stringify(scoreObj)) //Jumps to location of results page + base64 encoded json with answers
}