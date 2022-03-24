import React from "react"
import Question from "./components/Question"
import { nanoid } from "nanoid"
import "./style.css"
import asuka from "./imgs/asuka.png"
import shinji from "./imgs/shinji.png"

export default function App() {
    const [inQuiz, setInQuiz] = React.useState(() => false)
    const [newGame, setNewGame] = React.useState(0)
    const [questions, setQuestions] = React.useState([])
    const [resultPage, setResultPage] = React.useState({activated: false, correctNum: 0})

    function startQuiz() {
        setInQuiz(true)
    }

    function checkResult() {
        setResultPage(prevState => {
            let num = 0;
            questions.forEach(q => {
                if (q.selected_answer === q.correct_answer) {
                    num = num + 1
                }
            })
            return (
                {   
                    correctNum: num,
                    activated: true,
                }
            )
        })
        setQuestions(prevState => {
            return (
                prevState.map(question => {
                    return {
                        ...question,
                        checkingResult: true
                    }
                })
            )
        })
    }

    function startNewGame() {
        setNewGame(prevState => prevState + 1)
        setResultPage(prevState => {
            return (
                {   
                    activated: false,
                    correctNum: 0
                }
            )
        })
    }

    const htmlDecode = (input) => {
        const doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    React.useEffect(() => {
        async function getQuestions() {
            try {
                // trying to use new API - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            } catch (error) {
                // just a fallback for older browsers
                window.scrollTo(0, 0);
            }
            const res = await fetch("https://opentdb.com/api.php?amount=6&category=31&difficulty=medium&type=multiple")
            const data = await res.json()
            const questionsTemplate = []

            function shuffleArray(array) {
                let arrayCopy = array
                for (let i = arrayCopy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
                }
                return arrayCopy
            }

            data.results.forEach(q => {
                questionsTemplate.push({
                    id: nanoid(),
                    question: htmlDecode(q.question),
                    correct_answer: htmlDecode(q.correct_answer),
                    incorrect_answers: q.incorrect_answers.map(a => htmlDecode(a)),
                    selected_answer: "",
                    checkingResult: false,
                    answers: shuffleArray(q.incorrect_answers.map(a => htmlDecode(a)).concat(htmlDecode(q.correct_answer)))
                })
            })

            setQuestions(questionsTemplate)
        }
        getQuestions()
        console.log("fire once")
    }, [inQuiz, newGame])

    function selectThisAnwser(id, answer) {
        setQuestions(prevState => {
            return (
                prevState.map(question => {
                    if (question.id === id) {
                        if (question.selected_answer !== answer)
                            return {
                                ...question,
                                selected_answer: answer
                            }
                        else {
                            return {
                                ...question,
                                selected_answer: ""
                            }
                        }
                    }
                    else {
                        return question
                    }
                })
            )
        })
    }

    const questionElements = questions.map(question => {
        return (
            <Question
                key={question.id}
                id={question.id}
                anwsers={question.answers}
                correct={question.correct_answer}
                question={question.question}
                selected_answer={question.selected_answer}
                selectThisAnwser={selectThisAnwser}
                checkingResult={question.checkingResult}
            />
        )
    })

    console.log(questions)

    return (
        <div className="container">
            <div className={`quiz-window ${inQuiz ? "quiz-page" : "starter-page"}`} >
                {
                inQuiz ?   
                <div className="quiz-page">
                    <img className="quiz-page--img1" src={asuka} alt="" />
                    <img className="quiz-page--img2" src={shinji} alt="" />
                    <div className="quiz-page--questions">
                        {questionElements}
                    </div>
                    <div className="quiz-page--submit">
                        {resultPage.activated && <div>{`You scored ${resultPage.correctNum}/6 correct answers`}</div>}
                        <button className="quiz-page--btn" onClick={resultPage.activated ? startNewGame : checkResult}>
                            {resultPage.activated ? "Play again" : "Check answers"}
                        </button>
                    </div>
                </div>
                    
            :   <div className="starter-page--items">
                    <div className="starter-page--title">
                        Anime Quizzical
                    </div>
                    <div className="starter-page--info">
                        114 Miller Drive
                    </div>
                    <button className="starter-page--btn" onClick={startQuiz}>
                        Start quiz
                    </button>
                </div>}
            </div>
        </div>
    )
}