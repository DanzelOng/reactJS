import { useState, useEffect } from "react";

const APIKEY = "8b2a2c6c";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
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

        fetchMovies();
        return function () {
            controller.abort();
        };
    }, [query]);
    return { movies, isLoading, errorMsg };
}
