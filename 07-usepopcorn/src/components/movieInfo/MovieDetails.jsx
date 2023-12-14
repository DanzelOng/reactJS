import { useEffect, useState } from "react";
import StarRating from "../rating/StarRating";
import { APIKEY } from "../App";
import Loader from "../loadingIndicators/Loader";

// function ListBox({ children }) {
//     const [isOpen1, setIsOpen1] = useState(true);
//     return (
//         <div className="box">
//             <button
//                 className="btn-toggle"
//                 onClick={() => setIsOpen1((open) => !open)}
//             >
//                 {isOpen1 ? "–" : "+"}
//             </button>
//             {isOpen1 && children}
//         </div>
//     );
// }
// function WatchedBox() {
//     const [watched, setWatched] = useState(tempWatchedData);
//     const [isOpen2, setIsOpen2] = useState(true);
//     return (
//         <div className="box">
//             <button
//                 className="btn-toggle"
//                 onClick={() => setIsOpen2((open) => !open)}
//             >
//                 {isOpen2 ? "–" : "+"}
//             </button>
//             {isOpen2 && (
//                 <>
//                     <WatchSummary watched={watched} />
//                     <WatchedMovieList watched={watched} />
//                 </>
//             )}
//         </div>
//     );
// }

export default function MovieDetails({
    selectedID,
    onCloseMovie,
    onAddWatched,
    watched,
}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

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

    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.code === "Escape") {
                onCloseMovie();
                console.log("Escaped");
            }
        });
    }, [onCloseMovie]);

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
