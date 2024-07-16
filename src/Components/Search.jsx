import { useEffect, useRef } from "react";
import { useKey } from "../hooks/useKey";

function Search({ query, setQuery }) {
  const inputElement = useRef(null);
  // useEffect(
  //   function () {
  //     function callBack(e) {
  //       if (document.activeElement === inputElement.current) return;
  //       if (e.code === "Enter") {
  //         inputElement.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     return document.addEventListener("keydown", callBack);
  //   },
  //   [setQuery]
  // );
  useKey("Enter", function () {
    if (document.activeElement === inputElement.current) return;
    inputElement.current.focus();
    setQuery("");
  });
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}
export default Search;
