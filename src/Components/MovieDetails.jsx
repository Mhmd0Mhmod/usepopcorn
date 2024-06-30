import { useEffect, useState } from "react";
import { KEY } from "../config";
import StarRating from "../StarRating";
import Loader from "./Loader";

export default function MovieDetails({ selectedId, onCloseMovie }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getMovieDetails() {
      setLoading(true);
      try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
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
  const {
    Title: title,
    Rated: rated,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director,
    Actors: actors,
    Plot: plot,
  } = data;
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
                {rated} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} />
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
