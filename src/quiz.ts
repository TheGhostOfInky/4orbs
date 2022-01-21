import type {param, question, score, scoreList} from "./types";
let questions: Array<question>
let qn: number
let max: score
let userScore: scoreList
let params: param

//Once the browser window has loaded, runs the selection menu
window.onload = () => select_quiz()

//Displays the selection menu for picking each quiz
async function select_quiz(): Promise<void> {
    params = await fetch("json/params.json") //Fetches test paramters
        .then(response => response.json())
    document.getElementById("question-text")!.innerHTML = "Select a test to take:"
    document.getElementById("question-number")!.innerHTML = "Test selection"
    const buttonholder = <HTMLDivElement> document.getElementById("button_holder")
    while (buttonholder.firstChild) { //Deletes all buttons
        buttonholder.removeChild(buttonholder.firstChild);
    }
    for (const quiz in params.quizzes) { //Creates new buttons based on the available quizzes
        const newbutton = <HTMLButtonElement> document.createElement("BUTTON")
        newbutton.innerHTML = params.quizzes[quiz].name
        newbutton.classList.add("button")
        newbutton.addEventListener("click",() => parse_questions(params.quizzes[quiz].url))
        buttonholder.appendChild(newbutton)
    }
}

//Parses the questions from the selected quiz and creates the buttons
async function parse_questions(url:string): Promise<void> {
    qn = 0
    max = {}
    userScore = {}
    questions = await fetch(url)
        .then(response => response.json())
    const buttonholder = <HTMLDivElement> document.getElementById("button_holder")
    while (buttonholder.firstChild) { //Deletes all buttons
        buttonholder.removeChild(buttonholder.firstChild);
    }
    for (const button in params.buttons) { //Adds all question buttons
        const newbutton = <HTMLButtonElement> document.createElement("BUTTON")
        newbutton.innerHTML = params.buttons[button].text
        newbutton.classList.add("button")
        newbutton.classList.add(button)
        newbutton.addEventListener("click",() => next_question(params.buttons[button].weight))
        buttonholder.appendChild(newbutton)
    }
    let newbutton = <HTMLButtonElement> document.createElement("BUTTON") //Adds back button
    newbutton.innerHTML = "back"
    newbutton.classList.add("small_button")
    newbutton.addEventListener("click",() => prev_question())
    buttonholder.appendChild(newbutton)
    for (const i in params.axes) { //Creates maximum score object and answer arrays 
        const axis: string = params.axes[i]
        userScore[axis] = new Array(questions.length)
        max[axis] = 0
    }
    for (let i: number = 0; i < questions.length; i++) { //Calculates maximum score
        for(const n in params.axes){ 
            const axis: string = params.axes[n]
            max[axis] += Math.abs(questions[i].effect[axis])
        }
    }
    init_question();
}

//Initializes the current question
function init_question(): void {
    document.getElementById("question-text")!.innerHTML = questions[qn].question;
    document.getElementById("question-number")!.innerHTML = "Question " + (qn + 1) + " of " + (questions.length);
}

//Proceeds to the next question
function next_question(mult: number):void {
    for(const i in params.axes){
        const axis: string = params.axes[i]
        userScore[axis][qn] = mult*questions[qn].effect[axis]
    }
    qn++;
    if (qn < questions.length) { //Re-initializes questions if questions are left, otherwise goes to results
        init_question();
    } else {
        results();
    }
}

//Returns to the previous question
function prev_question():void {
    if (qn == 0) { //If first question returns to quiz selection menu
        select_quiz()
    } else { //Otherwise rolls question number 1 back and re-initalizes questions
        qn--;
        init_question();
    }
}

//Calculates final scores and transfers them to the results page
function results(): void {
    let finalScores: score = {}
    for(const i in params.axes){
        const axis: string = params.axes[i]
        const total: number = userScore[axis].reduce((a, b) => a + b, 0)
        const ratio: number = (max[axis]+total)/(2*max[axis])
        finalScores[axis] = Math.round(ratio*6.98 - 0.49)
    }
    location.href = "results.html?" + btoa(JSON.stringify(finalScores)) //Jumps to location of results page + base64 encoded json with answers
}