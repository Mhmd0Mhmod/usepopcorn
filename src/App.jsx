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
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function onCloseMovie() {
    setSelectedId(null);
  }
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
        if (!response.ok) throw new Error("An error occurred. Please try again later.");
        const data = await response.json();
        if (data.Response === "False") throw new Error("No results found.");
        setMovies(data.Search);
      } catch (e) {
        setError(e.message);
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
    return () => {
      console.log("cleanup");
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
            <MovieDetails selectedId={selectedId} onCloseMovie={onCloseMovie} />
          ) : (
            <>
              <Summary watched={watched} />
              <MoviesToWatch watched={watched} />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}
