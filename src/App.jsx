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
import MovieDetails from "./Components/MovieDetails";
import Loader from "./Components/Loader";
import ErrorMessage from "./Components/ErrorMessage";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [query, setQuery] = useState("");
  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function () {
  //   const watched = localStorage.getItem("watched");
  //   return JSON.parse(watched);
  // });
  const [watched, setWatched] = useLocalStorage([], "watched");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
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
