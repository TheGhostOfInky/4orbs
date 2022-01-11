let questions
let qn = 0
let max_econ, max_dipl, max_govt, max_scty; // Max possible scores
max_econ = max_dipl = max_govt = max_scty = 0;
let econ_array
let dipl_array
let govt_array
let scty_array 
window.onload = async () => {
    questions = await fetch("json/questions.json")
        .then(response => response.json())
    econ_array = new Array(questions.length);
    dipl_array = new Array(questions.length);
    govt_array = new Array(questions.length);
    scty_array = new Array(questions.length);
    for (let i: number = 0; i < questions.length; i++) {
        max_econ += Math.abs(questions[i].effect.econ)
        max_dipl += Math.abs(questions[i].effect.dipl)
        max_govt += Math.abs(questions[i].effect.govt)
        max_scty += Math.abs(questions[i].effect.scty)
    }
    init_question();
}
function init_question() {
    document.getElementById("question-text").innerHTML = questions[qn].question;
    document.getElementById("question-number").innerHTML = "Question " + (qn + 1) + " of " + (questions.length);
}

function next_question(mult) {
    econ_array[qn] = mult*questions[qn].effect.econ
    dipl_array[qn] = mult*questions[qn].effect.dipl
    govt_array[qn] = mult*questions[qn].effect.govt
    scty_array[qn] = mult*questions[qn].effect.scty
    qn++;
    if (qn < questions.length) {
        init_question();
    } else {
        results();
    }
}

function prev_question() {
    if (qn == 0) {
        window.history.back()
    }
    qn--;
    init_question();
}

function calc_score(score,max) {
    return (100*(max+score)/(2*max)).toFixed(1)
}

function results() {
    let final_econ = econ_array.reduce((a, b) => a + b, 0)
    let final_dipl = dipl_array.reduce((a, b) => a + b, 0)
    let final_govt = govt_array.reduce((a, b) => a + b, 0)
    let final_scty = scty_array.reduce((a, b) => a + b, 0)
    location.href = `results.html`
        + `?e=${calc_score(final_econ,max_econ)}`
        + `&d=${calc_score(final_dipl,max_dipl)}`
        + `&g=${calc_score(final_govt,max_govt)}`
        + `&s=${calc_score(final_scty,max_scty)}`
}