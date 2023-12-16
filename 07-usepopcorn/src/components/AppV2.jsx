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
import { useMovies } from "./customHooks/useMovies";
import { useLocalStorageState } from "./customHooks/useLocalStorageState";
import "../app.css";

export const average = (arr) =>
    arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

export default function App() {
    const [query, setQuery] = useState("");
    const [selectedID, setSelectedID] = useState(null);

    // custom hooks
    const [watched, setWatched] = useLocalStorageState([], "watched");
    const { movies, isLoading, errorMsg } = useMovies(query);

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

    useEffect(() => {
        localStorage.setItem("watched", JSON.stringify(watched));
    }, [watched]);

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
