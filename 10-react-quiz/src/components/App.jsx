import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishedScreen from './FinishedScreen';
import Footer from './Footer';
import Timer from './Timer';

const SECS_PER_QUESTION = 20;
const initialState = {
    questions: [],
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: null,
};

const reducer = function (state, action) {
    const question = state.questions.at(state.index);
    switch (action.type) {
        case 'dataReceived':
            return { ...state, questions: action.payload, status: 'ready' };
        case 'dataFailed':
            return { ...state, status: 'error' };
        case 'start':
            return {
                ...state,
                status: 'active',
                secondsRemaining: state.questions.length * SECS_PER_QUESTION,
            };
        case 'newAnswer':
            return {
                ...state,
                answer: action.payload,
                points:
                    action.payload === question.correctOption
                        ? state.points + question.points
                        : state.points,
            };
        case 'nextQuestion':
            return { ...state, index: state.index + 1, answer: null };
        case 'finished':
            return {
                ...state,
                status: 'finished',
                highScore:
                    state.points > state.highScore
                        ? state.points
                        : state.highScore,
            };
        case 'reset':
            return {
                ...state,
                status: 'ready',
                index: 0,
                answer: null,
                points: 0,
                highScore: 0,
            };
        case 'tick':
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status:
                    state.secondsRemaining === 0 ? 'finished' : state.status,
            };
        default:
            throw new Error('Action Unknown');
    }
};

function App() {
    const [
        {
            questions,
            status,
            index,
            answer,
            points,
            highScore,
            secondsRemaining,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce(
        (acc, cur) => acc + cur.points,
        0
    );

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:8000/questions');
                const data = await response.json();
                dispatch({ type: 'dataReceived', payload: data });
            } catch (err) {
                dispatch({ type: 'dataFailed' });
            }
        }
        console.log('useEffect');
        fetchData();
    }, []);

    return (
        <div className='app'>
            <Header />
            <Main>
                {status === 'loading' && <Loader />}
                {status === 'error' && <Error />}
                {status === 'ready' && (
                    <StartScreen dispatch={dispatch} length={numQuestions} />
                )}
                {status === 'active' && (
                    <>
                        <Progress
                            index={index}
                            numQuestions={numQuestions}
                            points={points}
                            maxPossiblePoints={maxPossiblePoints}
                            answer={answer}
                        />
                        <Question
                            dispatch={dispatch}
                            question={questions[index]}
                            answer={answer}
                        />
                        <Footer>
                            <NextButton
                                dispatch={dispatch}
                                answer={answer}
                                index={index}
                                numQuestions={numQuestions}
                            />
                            <Timer
                                dispatch={dispatch}
                                secondsRemaining={secondsRemaining}
                            />
                        </Footer>
                    </>
                )}
                {status === 'finished' && (
                    <FinishedScreen
                        dispatch={dispatch}
                        points={points}
                        maxPossiblePoints={maxPossiblePoints}
                        highScore={highScore}
                    />
                )}
            </Main>
        </div>
    );
}

export default App;
