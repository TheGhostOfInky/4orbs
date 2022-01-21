let questions;
let qn;
let max;
let userScore;
let params;
window.onload = () => select_quiz();
async function select_quiz() {
    params = await fetch("json/params.json")
        .then(response => response.json());
    document.getElementById("question-text").innerHTML = "Select a test to take:";
    document.getElementById("question-number").innerHTML = "Test selection";
    const buttonholder = document.getElementById("button_holder");
    while (buttonholder.firstChild) {
        buttonholder.removeChild(buttonholder.firstChild);
    }
    for (const quiz in params.quizzes) {
        const newbutton = document.createElement("BUTTON");
        newbutton.innerHTML = params.quizzes[quiz].name;
        newbutton.classList.add("button");
        newbutton.addEventListener("click", () => parse_questions(params.quizzes[quiz].url));
        buttonholder.appendChild(newbutton);
    }
}
async function parse_questions(url) {
    qn = 0;
    max = {};
    userScore = {};
    questions = await fetch(url)
        .then(response => response.json());
    const buttonholder = document.getElementById("button_holder");
    while (buttonholder.firstChild) {
        buttonholder.removeChild(buttonholder.firstChild);
    }
    for (const button in params.buttons) {
        const newbutton = document.createElement("BUTTON");
        newbutton.innerHTML = params.buttons[button].text;
        newbutton.classList.add("button");
        newbutton.classList.add(button);
        newbutton.addEventListener("click", () => next_question(params.buttons[button].weight));
        buttonholder.appendChild(newbutton);
    }
    let newbutton = document.createElement("BUTTON");
    newbutton.innerHTML = "back";
    newbutton.classList.add("small_button");
    newbutton.addEventListener("click", () => prev_question());
    buttonholder.appendChild(newbutton);
    for (const i in params.axes) {
        const axis = params.axes[i];
        userScore[axis] = new Array(questions.length);
        max[axis] = 0;
    }
    for (let i = 0; i < questions.length; i++) {
        for (const n in params.axes) {
            const axis = params.axes[n];
            max[axis] += Math.abs(questions[i].effect[axis]);
        }
    }
    init_question();
}
function init_question() {
    document.getElementById("question-text").innerHTML = questions[qn].question;
    document.getElementById("question-number").innerHTML = "Question " + (qn + 1) + " of " + (questions.length);
}
function next_question(mult) {
    for (const i in params.axes) {
        const axis = params.axes[i];
        userScore[axis][qn] = mult * questions[qn].effect[axis];
    }
    qn++;
    if (qn < questions.length) {
        init_question();
    }
    else {
        results();
    }
}
function prev_question() {
    if (qn == 0) {
        select_quiz();
    }
    else {
        qn--;
        init_question();
    }
}
function results() {
    let finalScores = {};
    for (const i in params.axes) {
        const axis = params.axes[i];
        const total = userScore[axis].reduce((a, b) => a + b, 0);
        const ratio = (max[axis] + total) / (2 * max[axis]);
        finalScores[axis] = Math.round(ratio * 6.98 - 0.49);
    }
    location.href = "results.html?" + btoa(JSON.stringify(finalScores));
}
export {};
//# sourceMappingURL=quiz.js.map