import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
    const [watched, setWatched] = useState(() => {
        const watchedMovies = localStorage.getItem(key);
        return watchedMovies ? JSON.parse(watchedMovies) : initialState;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(watched));
    }, [watched, key]);
    return [watched, setWatched];
}