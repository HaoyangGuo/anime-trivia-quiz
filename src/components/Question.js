import React from "react"
import { nanoid } from "nanoid"

export default function Question(props) {
    const answersElements = (props.anwsers).map(a => {
        return <button 
            key={nanoid()} 
            onClick={ 
                props.checkingResult ? () => {return } : () => props.selectThisAnwser(props.id, a)
            }
            className={
                `${(props.selected_answer === a && props.checkingResult === false) ? "selected" : ""}` + " " + 
                `${(props.selected_answer === a && props.checkingResult === true && props.correct === a) ? "correct" : ""}` + " " +
                `${(props.selected_answer === a && props.checkingResult === true && props.correct !== a) ? "incorrect" : ""}` + " " +
                `${(props.selected_answer !== a && props.checkingResult === true) ? "locked" : ""}`
            }
        >
        {a}
        </button>
    })
    return (
        <div>
            <div className="quiz-page--question">{props.question}</div>
            <div className="quiz-page--anwsers">
                {answersElements}
            </div>
            <hr style={{
                color: "#DBDEF0",
                backgroundColor: "#DBDEF0",
                height: 2
            }}/>
        </div> 
    )
}