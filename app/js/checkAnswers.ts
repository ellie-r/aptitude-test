import {UserAnswers, UserAnswerWithNotesData} from "./interfaces/UserAnswers";

var questionAmount


document.querySelector('#finish').addEventListener('click', () => {
    finishTest(false)
})

/**
 * called when clicking finish button in dialogue box
 */
function finishTest(pageLeft) {
    showResults(pageLeft)
    document.querySelector<HTMLElement>('#overview_page').style.display = 'none'
    document.querySelector<HTMLElement>('#result_page').style.display = 'none'
    document.removeEventListener("mouseleave", pageLeaveAlert);
    document.removeEventListener("visibilitychange", cancelTest);
}

/**
 * checks the users answers against api answers
 *
 * @param userAnswers answers provided by user
 *
 * @return Promise - containing the result object ready for the api
 */
async function checkAnswers(userAnswers: UserAnswers): Promise<any> {
    let userScore = 0
    let answers = await getAnswers()

    if (answers.success) {
        answers = answers.data
        answers.forEach(function (answerItem) {
            if (answerItem.answer == userAnswers[answerItem.id]) {
                userScore++
            }
        })
        let result = {
            uid: parseInt(getCookie('uid') as string, 10), // typecast to string as getCookie shouldnt ever return false
            answers: userAnswers,
            score: userScore,
            time: parseFloat(getTimeForApi()),
            testLength: questionAmount
        }
        return result
    }
    return answers
}

/**
 * gets correct answers from api
 *
 * @return Promise - containing the correct answers
 */
async function getAnswers() {
    let baseUrl = getBaseUrl()
    let data = await fetch(baseUrl + "answer", {method: 'get'})
    return data.json()
}

/**
 * gets answers the user provided from the DOM
 *
 * @return Object of users answers
 */
function getUserAnswers(): UserAnswerWithNotesData {
    questionAmount = document.querySelectorAll('#questions .question').length
    let answerElements = document.querySelectorAll('#questions .question .answers')
    let userAnswers = {answers:[]}

    answerElements.forEach(function(answerElement: HTMLInputElement) {
        let selectedAnswer = answerElement.querySelector<HTMLInputElement>('input:checked') ? answerElement.querySelector<HTMLInputElement>('input:checked').value : null
        let id = answerElement.dataset.qid
        let notes = answerElement.parentElement.querySelector<HTMLInputElement>('textarea').value
        let userAnswerObject = {
            questionNumber: id,
            selectedAnswer: selectedAnswer,
            notes: notes
        }
        userAnswers.answers.push(userAnswerObject)
    })

    return userAnswers
}


function removeNotes(userAnswers: UserAnswerWithNotesData): UserAnswers {
    const answers = userAnswers.answers
    const object : UserAnswers = {}
    answers.forEach((answer) => {
       object[answer.questionNumber] = answer.selectedAnswer
    })
    console.log(object)
    return object
}


/**
 * gets percentage of user score
 *
 * @param userScore user score
 * @param questionAmount total number of questions
 *
 * @return Integer percentage of user score
 */
function getPercentResult(userScore: number, questionAmount: number): number {
    return Math.round(userScore / questionAmount * 100)
}

/**
 * showing and calculating result in points and percents
 *
 * @param earnedPoints total amount of right questions
 * @param earnedPercentage percentage of total number of right questions
 * @param answeredQuestions total number of questions that have an answer
 */
function displayResult(earnedPoints: number, earnedPercentage: number, answeredQuestions: number) {
    document.querySelector(".score").innerHTML = earnedPoints as any as string
    document.querySelector(".answered_questions").innerHTML = answeredQuestions as any as string
    document.querySelector(".score_percentage").innerHTML = earnedPercentage as any as string
}

/**
 * function adds event listeners to .question and listens for click event within here
 * it then updates the class of the span containing the question number allowing styling to be applied
 *
 */
function addAnswerEventListeners() {
    document.querySelectorAll('.question').forEach(function (input) {
        input.addEventListener('click', function(e: any) {
            if (e.target.tagName == 'INPUT') {
                let id = parseInt(this.dataset['questionOrderId']) - 1
                document.querySelector('#question-nav').children[id].classList.add('answered-nav-box')
            }
        })
    })
}

/**
 * function removes current status from all questions and then adds current status
 * to the current question allowing styling to be applied
 *
 * @param id is the id of the active question
 */
function trackActiveQuestion(id: number) {
    let activeQuestion = document.querySelector('.nav-item.current-nav-box')
    if (activeQuestion) {
        activeQuestion.classList.remove('current-nav-box')
    }
    document.querySelector('#question-nav').children[id - 1].classList.add('current-nav-box')
}

/**
 * this checks the answers and marks them to show the finishing page
 */
function showResults(pageLeft) {
    resetReapplyCounter()
    clearInterval(interval)
    const userAnswers = removeNotes(getUserAnswers())
    checkAnswers(userAnswers).then(function (result) {
        let percentResult
        let answered
        if (result.score || result.score === 0) {
            if (pageLeft) {
                document.querySelector<HTMLElement>('.userMessage').innerHTML = `<h1>Test cancelled!</h1>
                <p>This test has ended because you clicked away from the page</p>
                <p>Please contact the office to discuss further</p>`
                result.score = 0
            } else {
                document.querySelector<HTMLElement>('.userMessage').innerHTML = `<h1>Thank You!</h1>
                <p>You have completed the test!</p>
                <p>Please contact the office if you would like to find out your results</p>`
            }
            document.querySelector<HTMLElement>('#question_page').style.display = 'none'
            document.querySelector<HTMLElement>('#overview_page').style.display = 'none'
            document.querySelector<HTMLElement>('#result_page').style.display = 'block'
            percentResult = getPercentResult(result.score, questionAmount)
            answered = document.querySelectorAll('#questions .question .answers input:checked').length
            displayResult(result.score, percentResult, answered)
            handleResponseFromAPI(sendUserResults(result))
        } else {
            let body = document.querySelector('body')
            let html = body.innerHTML
            html += '<p class="error_message text-danger">Please contact admin. Answers cannot be checked at present.</p>'
            body.innerHTML = html
        }
    })
}