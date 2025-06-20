import "../styles/Album page/AlbumPage.css";
import Header from "../components/Header/Header.jsx";

import AlbumArt from "../components/Album page/AlbumArt.jsx";
import AlbumTitle from "../components/Album page/AlbumTitle.jsx";
import AlbumMetaInfo from "../components/Album page/AlbumMetaInfo.jsx";
import ArtistButton from "../components/Album page/ArtistButton.jsx";
import ArtistRatings from "../components/Album page/ArtistRating.jsx";
import AlbumPageNavigationBar from "../components/Album page/AlbumPageNavigationBar";
import TopTracks from "../components/Album page/TopTracks.jsx";
import UsersReviews from "../components/Album page/UsersReviews";
import SpotifyReviewButtons from "../components/Album page/SpotifyReviewButtons";
import MoreFromSection from "../components/Album page/MoreFromSection";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

function AlbumPage() {
  const { artistId, albumId } = useParams();
  const [albumInfo, setAlbumInfo] = useState(null);
  const [artistInfo, setArtistInfo] = useState(null);

  const [artistAlbums, setArtistAlbums] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    setFadeIn(false); // Reset fade
    const timer = setTimeout(() => setFadeIn(true), 450);

    console.log("Current fade state:", fadeIn);
    return () => clearTimeout(timer);
  }, [albumId]);

  useEffect(() => {
    const url = `http://localhost:8484/albums?q=${artistId}`;
    async function fetchAlbums() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setArtistAlbums(json);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchAlbums();
  }, [artistId]);

  useEffect(() => {
    const getArtistInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("artists")
          .select("*")
          .eq("artistid", artistId)
          .single();

        if (data) {
          setArtistInfo({
            artistName: data.artistName,
            artistid: data.artistid,
            profilepic: data.profilepic,
          });
        } else if (!data) {
          const response = await fetch(
            `http://localhost:8484/artist?q=${artistId}`
          );
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
          const json = await response.json();
          setArtistInfo({
            artistid: json.id,
            artistName: json.name,
            profilepic: json.images[0].url,
          });

          const { error: insertError } = await supabase.from("artists").insert([
            {
              artistid: json.id,
              artistName: json.name,
              profilepic: json.images[0].url,
            },
          ]);
          if (insertError) {
            console.error("Error inserting album:", insertError.message);
          }
        }
      } catch (error) {
        console.error("Error in getArtistInfo:", error.message);
      }
    };
    getArtistInfo();
  }, [artistId]);

  //album info
  useEffect(() => {
    const fetchAndMaybeInsertAlbum = async () => {
      try {
        // Check if album exists in DB
        const { data, error } = await supabase
          .from("music")
          .select("*")
          .eq("albumid", albumId)
          .single();

        if (data) {
          setAlbumInfo({
            albumid: data.albumid,
            title: data.title,
            releasedate: data.releasedate,
            spotifylink: data.spotifylink,
            coverart: data.coverart,
            artistid: data.artistid,
            tracks: data.tracks,
            type: data.type,
          });

          return;
        }

        //Fetch from external API if not in DB
        const response = await fetch(
          `http://localhost:8484/getAlbumInfo?q=${albumId}`
        );
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setAlbumInfo({
          albumid: json.id,
          artistid: json.artists[0].id,
          title: json.name,
          spotifylink: json.external_urls.spotify,
          coverart: json.images[0].url,
          releasedate: json.release_date,
          tracks: json.tracks,
          type: json.album_type,
        });

        //Insert into Supabase
        const { error: insertError } = await supabase.from("music").insert([
          {
            albumid: json.id,
            artistid: json.artists[0].id,
            title: json.name,
            spotifylink: json.external_urls.spotify,
            coverart: json.images[0].url,
            releasedate: json.release_date,
            tracks: json.tracks,
            type: json.album_type,
          },
        ]);

        if (insertError) {
          console.error("Error inserting album:", insertError.message);
        }
      } catch (error) {
        console.error("Error in fetchAndMaybeInsertAlbum:", error.message);
      }
    };
    fetchAndMaybeInsertAlbum();
  }, [albumId]);

  if (
    !albumInfo ||
    !albumInfo.coverart ||
    !artistInfo ||
    !artistInfo.artistid
  ) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className={`album-page-wrapper ${fadeIn ? "fade-in" : "fade-out"}`}>
        <div className="margin">
          <div className="album-banner-container">
            <div className="album-banner-rows">
              <AlbumArt
                artLink={albumInfo.coverart}
                albumName={albumInfo.title}
              />
              <div className="album-info-container">
                <div className="flex-text-container">
                  <AlbumTitle title={albumInfo.title} />
                  <AlbumMetaInfo
                    type={
                      albumInfo.type.charAt(0).toUpperCase() +
                      String(albumInfo.type).slice(1)
                    }
                    year={new Intl.DateTimeFormat("en-US").format(new Date(albumInfo.releasedate))}
                    trackCount={albumInfo?.tracks.total}
                  />
                  <ArtistButton
                    artistPicture={artistInfo.profilepic} //consistent with Supabase
                    artistName={artistInfo.artistName}
                  />
                </div>
              </div>
              <div className="ratings-flex-container">
                <ArtistRatings albumInfo={albumInfo} />
              </div>
            </div>

            {/* Navigation */}
            <AlbumPageNavigationBar
              setShowReviews={setShowReviews}
              showReviews={showReviews}
            />

            {/* Main Grid or Review Section */}
            {showReviews ? (
              <div className="grid-below-nav">
                {/* Left Side: Reviews */}
                <div className="left-grid">
                  <div className="left-grid-row">
                    <div className="review-page-section">
                      <UsersReviews amountOfReviews={0} />
                      {/* Optional: Add your review form here */}
                    </div>
                  </div>
                </div>

                {/* Right Side stays the same */}
                <div className="right-side">
                  <SpotifyReviewButtons
                    spotifyLink={albumInfo?.spotify}
                    result={albumInfo}
                  />

                  {artistAlbums.filter((album) => album.id !== albumId).length >
                    0 && (
                    <>
                      <div className="more-from-title">
                        More From {artistInfo.artistName}
                      </div>
                      <MoreFromSection
                        artistId={artistInfo.artistid}
                        albumId={albumId}
                        artistAlbums={artistAlbums}
                      />
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid-below-nav">
                {/* Left Side: Tracklist */}
                <div className="left-grid">
                  <div className="left-grid-row">
                    <div className="track-list">
                      <p className="tracks-font">Tracklist</p>
                      <TopTracks trackList={albumInfo.tracks} />
                    </div>
                    <div className="reviews-box">
                      <p className="review-text">Reviews</p>
                      <UsersReviews amountOfReviews={0} />
                    </div>
                  </div>
                </div>

                {/* Right Side stays the same */}
                <div className="right-side">
                  <SpotifyReviewButtons
                    spotifyLink={albumInfo.spotifylink}
                    result={albumInfo}
                  />

                  {artistAlbums.filter((album) => album.id !== albumId).length >
                    0 && (
                    <>
                      <div className="more-from-title">
                        More From {artistInfo.artistName}
                      </div>
                      <MoreFromSection
                        artistId={artistInfo.artistid}
                        albumId={albumId}
                        artistAlbums={artistAlbums}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AlbumPage;
