import { useEffect, useState } from "react";
import WatchedMovieList from "./userWatchedMovies/WatchedMovieList";
import WatchSummary from "./userWatchedMovies/WatchSummary";
import MovieList from "./movieInfo/MovieList";
import MovieDetails from "./movieInfo/MovieDetails";
import Box from "./structural/Box";
import Main from "./structural/Main";
import NumResults from "./header/NumResults";
import Search from "./header/Search";
import Logo from "./header/Logo";
import NavBar from "./header/NavBar";
import ErrorMessage from "./loadingIndicators/ErrorMessage";
import Loader from "./loadingIndicators/Loader";
import "../app.css";

export const APIKEY = "8b2a2c6c";

export const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedID, setSelectedID] = useState(null);

    const handleSelectMovie = function (id) {
        setSelectedID((curID) => (curID === id ? null : id));
    };

    const handleCloseMovie = function () {
        setSelectedID(null);
    };

    const handleAddWatched = function (movie) {
        setWatched((all) => [...all, movie]);
    };

    const handleDeleteWatched = function (id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    };

    // registers a side Effect to be executed after a component has been rendered
    useEffect(() => {
        const controller = new AbortController();
        async function fetchMovies() {
            try {
                // indicate data is being fetched
                setIsLoading(true);
                // clear any previous err message
                setErrorMsg("");
                const result = await fetch(
                    `http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`,
                    { signal: controller.signal }
                );

                // throw error from unsucessful request from network connection
                if (!result.ok)
                    throw new Error(
                        "Something went wrong with fetching movies."
                    );

                const data = await result.json();

                // throw error if move name does not exists
                if (data.Response === "False") {
                    throw new Error("Movie name does not exist");
                }
                // update state with fetched movie data
                setMovies(data.Search);
                setErrorMsg("");
            } catch (err) {
                if (err.name !== "AbortError") setErrorMsg(err.message);
                // handle and update error state to err message
            } finally {
                // indicate data has being fetched
                setIsLoading(false);
            }
        }

        // return if query length too short
        if (query.length < 3) {
            setMovies([]);
            setErrorMsg("");
            return;
        }

        handleCloseMovie();
        fetchMovies();
        return function () {
            console.log("after");
            controller.abort();
        };
    }, [query]);

    return (
        <>
            <NavBar>
                <Logo />
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </NavBar>

            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!errorMsg && !isLoading && (
                        <MovieList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                        />
                    )}
                    {errorMsg && <ErrorMessage error={errorMsg} />}
                </Box>
                <Box>
                    {selectedID ? (
                        <MovieDetails
                            selectedID={selectedID}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchSummary watched={watched} />
                            <WatchedMovieList
                                watched={watched}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}
