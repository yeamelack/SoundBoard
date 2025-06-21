import React, { useEffect } from "react";
import "../../styles/Header/SuggestionDropdown.css";
import { Link } from "react-router-dom";
import supabase from "../../supabase/supabaseClient";

function SuggestionDropdown({
  results,
  onClick,
  dropdownRef,
  className,
  route,
  popUpOnClick,
}) {
  function getRoute(route, results) {
    console.log("getRoute called with:", route, results);
    console.log(`/${results.artists?.[0]?.id}/album/${results.id}`);
    console.log(results);

    if (route === "album page") {
      return `/${results.artists?.[0]?.id}/album/${results.id}`;
    } else if (route === "quick review") {
      return `/artist/${results.artists?.[0]?.id}`;
    } else {
      return `/unknown`;
    }
  }

  useEffect(() => {
    const addToDatabase = async () => {
      for (const result of results) {
        try {
          // Get album tracks
          const tracksResponse = await fetch(
            `http://localhost:8484/getAlbumInfo?q=${result.id}`
          );
          if (!tracksResponse.ok) {
            throw new Error(`Track fetch failed: ${tracksResponse.status}`);
          }
          const tracksJson = await tracksResponse.json();

          // Get artist image
          const artistResponse = await fetch(
            `http://localhost:8484/artist?q=${result.artists[0].id}`
          );
          if (!artistResponse.ok) {
            throw new Error(`Artist fetch failed: ${artistResponse.status}`);
          }
          const artistJson = await artistResponse.json();
          const artistImage = artistJson.images[0].url;

          const { data: artistExisting, error: artistFetchError } =
            await supabase
              .from("artists")
              .select("artistid")
              .eq("artistid", result.artists[0].id)
              .single();

          if (!artistExisting) {
            const { error: insertError } = await supabase
              .from("artists")
              .insert({
                artistid: result.artists[0].id,
                artistName: result.artists[0].name,
                profilepic: artistImage,
              });
            if (insertError) {
              console.error("Insert error:", insertError.message);
            }
          }

          const { data: existing, error: fetchError } = await supabase
            .from("music")
            .select("albumid")
            .eq("albumid", result.id)
            .single();

          // Insert into Supabase
          if (!existing) {
            const { error } = await supabase.from("music").insert({
              albumid: result.id,
              artistid: result.artists[0].id,
              title: result.name,
              spotifylink: result.external_urls.spotify,
              coverart: result.images[0].url,
              releasedate: result.release_date,
              type: result.album_type,
              tracks: tracksJson.tracks,
            });
            if (error) {
              console.error("Insert error:", error.message);
            }
          }
        } catch (error) {
          console.error("Data fetch or insert error:", error.message);
        }
      }
    };

    if (results && results.length > 0) {
      addToDatabase();
    }
  }, [results]);

  return (
    <div ref={dropdownRef} className={className}>
      {results.map((result, index) => (
        <Link
          key={result.id}
          to={getRoute(route, result)}
          onClick={(e) => {
            if (route === "quick review") {
              e.preventDefault();
              popUpOnClick(result);
            }
          }}
        >
          <div
            key={index}
            className="suggestion-item"
            onClick={() => onClick(result.name)}
          >
            <div className="search-img-container">
              <img className="search-img" src={result.images[0].url} alt="" />
            </div>
            <div className="search-suggestions-titles-container">
              <div className="suggested-result-album-title">
                <span className="suggested-result-font">{result.name}</span>
                {result.isExplicit && <span className="explicit-tag">E</span>}
              </div>
              <div className="suggested-result-artist-name">
                <span className="suggested-result-font-artist">
                  {result.artists[0].name}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SuggestionDropdown;
