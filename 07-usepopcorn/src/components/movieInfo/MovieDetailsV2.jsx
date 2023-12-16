import { useEffect, useRef, useState } from "react";
import StarRating from "../rating/StarRating";
import { APIKEY } from "../App";
import Loader from "../loadingIndicators/Loader";
import { useKey } from "../customHooks/useKey";

export default function MovieDetails({
    selectedID,
    onCloseMovie,
    onAddWatched,
    watched,
}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");
    // add a ref to track number of times user rates a movies
    const countRef = useRef(0);

    const hasWatched = watched.map((item) => item.imdbID).includes(selectedID);
    const watchedUserRating = watched.find(
        (movie) => movie.imdbID === selectedID
    )?.userRating;

    const {
        Title: title,
        Poster: poster,
        Year: year,
        Runtime: runTime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    // track no. of times user rates
    useEffect(() => {
        if (userRating) countRef.current++;
    }, [userRating]);

    useKey("Escape", onCloseMovie);

    useEffect(() => {
        async function fetchMovieData() {
            setIsLoading(true);
            const result = await fetch(
                `http://www.omdbapi.com/?apikey=${APIKEY}&i=${selectedID}`
            );
            const data = await result.json();
            setMovie(data);
            setIsLoading(false);
        }
        fetchMovieData();
    }, [selectedID]);

    useEffect(() => {
        console.log(title);
        if (!title) return;
        document.title = `Movie | ${title}`;
        return () => {
            console.log(title, " at cleanu");
            document.title = "usePopcorn";
        };
    }, [title]);

    const handleAdd = function () {
        const newWatchedMovie = {
            imdbID: selectedID,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runTime: Number(runTime.split(" ").at(0)),
            userRating,
            countRatingDecisions: countRef.current,
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    };

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`${title} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runTime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {!hasWatched ? (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAdd}
                                        >
                                            + Add To Watched List
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>
                                    You rated this movie {watchedUserRating}{" "}
                                    stars.
                                </p>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}
