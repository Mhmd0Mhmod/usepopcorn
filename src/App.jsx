import { useEffect, useState } from "react";
import ListBox from "./Components/ListBox";
import Logo from "./Components/Logo";
import Main from "./Components/Main";
import MoviesList from "./Components/MoviesList";
import MoviesToWatch from "./Components/MoviesToWatch";
import NavBar from "./Components/NavBar";
import Result from "./Components/Result";
import Search from "./Components/Search";
import Summary from "./Components/Summary";
import { KEY, tempMovieData, tempWatchedData } from "./config";
import MovieDetails from "./Components/MovieDetails";
import Loader from "./Components/Loader";
import ErrorMessage from "./Components/ErrorMessage";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function onCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatchList(newWatchedMovie) {
    setWatched((watched) => [
      ...watched.filter((movie) => movie.imdbID !== newWatchedMovie.imdbID),
      newWatchedMovie,
    ]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setError("");
        setIsLoading(true);
        const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("An error occurred. Please try again later.");
        const data = await response.json();
        console.log(data);
        if (data.Response == "False") throw new Error("No results found.");
        setMovies(data.Search);
      } catch (e) {
        console.log(e);
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchData();
    onCloseMovie();
    return function () {
      controller.abort();
    };
  }, [query]);
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </NavBar>
      <Main>
        <ListBox>
          {/* {isLoading ? <Loader /> : Error ? <ErrorMessage message={Error} /> : <MoviesList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MoviesList onSelectMovie={handleSelectMovie} movies={movies} />}
          {!isLoading && error && <ErrorMessage message={error} />}
        </ListBox>
        <ListBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={onCloseMovie}
              handleAddWatchList={handleAddWatchList}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <MoviesToWatch watched={watched} handleDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}
