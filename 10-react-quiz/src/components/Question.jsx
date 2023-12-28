import Options from './Options';

function Question({ dispatch, question, answer }) {
    return (
        <div>
            <h4>{question.question}</h4>
            <Options dispatch={dispatch} question={question} answer={answer} />
        </div>
    );
}

export default Question;
