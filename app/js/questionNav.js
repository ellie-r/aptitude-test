var current = 1

/**
*adds active to the first question
* function in called when questions are inserted into html
 */
function active() {
    document.querySelector(".q_" + current).classList.add("active")
    document.querySelector("h4").textContent = current + "/30"
    trackActiveQuestion(current)
}

/**
*adds active class to next question, removes from current question
* makes the prev and next buttons appear when needed
 */
function next() {
    current++
    let nextQuestion = document.querySelector(".q_" + current)
    document.querySelector("h4").textContent = current + "/30"

    if (current !== 1) {
        document.querySelector(".prev").style.display = "block"
    }
    if (current === 30) {
        document.querySelector(".next").style.display = "none"
    }
    if (nextQuestion !== null) {
        document.querySelector(".active").classList.remove("active")
        document.querySelector(".q_" + current).classList.add("active")
        trackActiveQuestion(current)
    }
    updateFlagStatus()
}

/**
*adds active class to prev question, removes from current question
* makes the prev and next buttons appear when needed
 */
function prev() {
    current--
    let prevQuestion = document.querySelector(".q_" + current)
    document.querySelector("h4").textContent = current + "/30"

    if (current === 1) {
        document.querySelector(".prev").style.display = "none"
        document.querySelector(".next").style.display = "block"
    }
    if (current !== 30) {
        document.querySelector(".next").style.display = "block"
    }
    if (prevQuestion !== null) {
        document.querySelector(".active").classList.remove("active")
        document.querySelector(".q_" + current).classList.add("active")
        trackActiveQuestion(current)
    }
    updateFlagStatus()
}

function updateFlagStatus() {
    let question =  document.querySelector('.question.active')
    let qId  = question.dataset.id
    let navItem = document.querySelector('#question-nav').children[qId - 1]
    document.querySelector('#flag-checkbox').checked = flaggedQuestions[qId]
    //('#questions-nav') is a placeholder for the page's number on the navbar
    if(flaggedQuestions[qId]) {
        navItem.querySelector('.flag').classList.add('glyphicon','glyphicon-flag')
    } else {
        navItem.querySelector('.flag').classList.remove('glyphicon','glyphicon-flag')
    }
}

document.querySelector(".next").addEventListener("click", next)
document.querySelector(".prev").addEventListener("click", prev)
document.querySelector('#flag-checkbox').addEventListener('change', updateFlagStatus)


/*
 * Fills the question navbar with clickable elements that takes you to the given question number.
 */
function fillNav() {
    let nav = document.querySelector("#question-nav")
    let questions = document.querySelectorAll('.question')
    let counter = 1
    questions.forEach(function (question) {
        nav.innerHTML += '<span class="nav-item unanswered-nav-box">' +
            '<p>' + question.dataset['id'] + '</p>' +
            '<div class="flag"></div>' +
            '</span>'
        counter++
    })
}