function FinishedScreen({ dispatch, points, maxPossiblePoints, highScore }) {
    const percentage = (points / maxPossiblePoints) * 100;
    return (
        <>
            <p className='result'>
                You scored <strong>{points}</strong> out of {maxPossiblePoints}{' '}
                ({Math.ceil(percentage)}%)
            </p>
            <p className='highscore'>(Highscore: {highScore} points)</p>
            <button
                className='btn btn-ui'
                onClick={() => dispatch({ type: 'reset' })}
            >
                Restart Quiz
            </button>
        </>
    );
}

export default FinishedScreen;
