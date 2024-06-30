import { useEffect, useState } from "react";
import { KEY } from "../config";
import StarRating from "../StarRating";
import Loader from "./Loader";

export default function MovieDetails({ selectedId, onCloseMovie, handleAddWatchList, watched }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState("");
  useEffect(() => {
    async function getMovieDetails() {
      setLoading(true);
      try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`, {
          referrerPolicy: "unsafe-url",
        });
        const data = await response.json();
        if (data.Error) throw new Error(data.Error);
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);
  useEffect(() => {
    function close(e) {
      if (e.code == "Escape") onCloseMovie();
    }
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("keydown", close);
    };
  }, [onCloseMovie]);
  const {
    Title: title,
    Year: year,
    imdbRating,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director,
    Actors: actors,
    Plot: plot,
  } = data;
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);
  const isWated = watched.find((movie) => movie.imdbID === selectedId);

  return (
    <div className="details">
      {loading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poseter of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
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
              {isWated ? (
                <p>You rated this Movie With {isWated?.userRating} ⭐ </p>
              ) : (
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                  <button
                    className="btn-add"
                    onClick={() => {
                      const newWatchedMovie = {
                        imdbID: selectedId,
                        title,
                        year,
                        poster,
                        imdbRating: Number(imdbRating),
                        userRating: Number(userRating),
                        released,
                        runtime: Number(runtime.split(" ")[0]),
                        genre,
                        director,
                        actors,
                        plot,
                      };
                      handleAddWatchList(newWatchedMovie);
                      onCloseMovie();
                    }}
                  >
                    + add to list
                  </button>
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
              <p>Staring {actors}</p>
              <p>Directed by {director}</p>
            </p>
          </section>
        </>
      )}
    </div>
  );
}
