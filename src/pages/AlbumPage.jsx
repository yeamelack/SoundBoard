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
import { useAuth0 } from "@auth0/auth0-react";
import supabase from "../supabase/supabaseClient";
import useFetchArtist from "../hooks/useFetchArtist";
import useInsertArtist from "../hooks/useInsertArtist";
import { useClickContext } from "../misc/ClickContext";
import useFetchMusic from "../hooks/useFetchMusic";
import useInsertMusic from "../hooks/useInsertMusic";

function AlbumPage() {
  const { user } = useAuth0();
  const { artistId, albumId } = useParams();
  const [albumInfo, setAlbumInfo] = useState(null);
  const [artistInfo, setArtistInfo] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [updatedReview, setUpdatedReview] = useState([]);
  const [displayedReview, setDisplayedReviews] = useState([]); //ArtistRating to see albums displayed
  const insertArtist = useInsertArtist();
  const insertMusic = useInsertMusic();
  const fetchArtist = useFetchArtist();
  const fetchMusic = useFetchMusic();

  useEffect(() => {
    if (!artistId) return;
    const fetchAndHandleArtist = async () => {
      setArtistInfo(null);

      try {
        const artistData = await fetchArtist(artistId);
        console.log("artist data 44", artistData);
        setArtistInfo(artistData);
      } catch (error) {
        console.log("artistData:", error.message);

        try {
          const insertedArtist = await insertArtist(artistId);
          const artistData = await fetchArtist(artistId);
          setArtistInfo(artistData);
          console.log("Artist inserted after fetch error");
          console.log("artistInfo has been set", artistInfo);
        } catch (err) {
          console.error("Insert artist failed:", err.message);
        }
      }
    };

    fetchAndHandleArtist();
  }, [artistId, albumId]);

  useEffect(() => {
    setAlbumInfo(null);

    if (!albumId) return;

    const fetchAndHandleMusic = async () => {
      try {
        const musicData = await fetchMusic(albumId);
        console.log("musicData", musicData);

        if (!musicData || musicData.length === 0) {
          console.log("No music data found, inserting music...");

          const insertedMusic = await insertMusic(albumId);
          const musicData = await fetchMusic(albumId);

          console.log("Inserted music:", insertedMusic);

          setAlbumInfo(musicData[0]);
          return;
        }

        setAlbumInfo(musicData[0]);
      } catch (error) {
        console.error("fetchMusic error:", error.message);
      }
    };

    fetchAndHandleMusic();
  }, [albumId, artistId]);

  useEffect(() => {
    setFadeIn(false); // Reset fade
    const timer = setTimeout(() => setFadeIn(true), 450);
    return () => clearTimeout(timer);
  }, [albumId]);

  useEffect(() => {
    const url = `http://localhost:8484/albums?q=${artistId}`;
    async function fetchAlbums() {
      setArtistAlbums([]);
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

  const navigate = useNavigate();
  const goToArtistProfile = () => {
    console.log("Navigating to:", `/artist/${artistInfo.artistid}`);
    navigate(`/artist/${artistInfo.artistid}`);
  };

  // //album info
  // useEffect(() => {
  //   const fetchAndMaybeInsertAlbum = async () => {
  //     try {
  //       // Check if album exists in DB
  //       const { data, error } = await supabase
  //         .from("music")
  //         .select("*")
  //         .eq("albumid", albumId)
  //         .single();

  //       if (data) {
  //         setAlbumInfo({
  //           albumid: data.albumid,
  //           title: data.title,
  //           releasedate: data.releasedate,
  //           spotifylink: data.spotifylink,
  //           coverart: data.coverart,
  //           artistid: data.artistid,
  //           tracks: data.tracks,
  //           type: data.type,
  //         });
  //         // console.log(`data FAMIA: ${data}`);
  //         return;
  //       }

  //       //Fetch from external API if not in DB
  //       const response = await fetch(
  //         `http://localhost:8484/getAlbumInfo?q=${albumId}`
  //       );
  //       if (!response.ok) {
  //         throw new Error(`Response status: ${response.status}`);
  //       }

  //       const json = await response.json();

  //       let normalizedReleaseDate = json.release_date;

  //       // Normalize if only year or year-month are provided
  //       if (/^\d{4}$/.test(normalizedReleaseDate)) {
  //         normalizedReleaseDate += "-01-01";
  //       } else if (/^\d{4}-\d{2}$/.test(normalizedReleaseDate)) {
  //         normalizedReleaseDate += "-01";
  //       }

  //       setAlbumInfo({
  //         albumid: json.id,
  //         artistid: json.artists[0].id,
  //         title: json.name,
  //         spotifylink: json.external_urls.spotify,
  //         coverart: json.images[0].url,
  //         releasedate: normalizedReleaseDate,
  //         tracks: json.tracks,
  //         type: json.album_type,
  //       });

  //       //if theres more than one artist add the other artist to the db
  //       if (json.artists.length > 1) {
  //         await Promise.all(
  //           json.artists.map(async (artistInfo) => {
  //             try {
  //               const response = await fetch(
  //                 `http://localhost:8484/artist?q=${artistInfo.id}`
  //               );

  //               if (!response.ok) {
  //                 throw new Error(`Fetch failed: ${response.status}`);
  //               }

  //               const artistJson = await response.json();

  //               const { error } = await supabase.from("artists").upsert(
  //                 {
  //                   artistid: artistJson.id,
  //                   artistName: artistJson.name,
  //                   profilepic: artistJson.images?.[0]?.url ?? null,
  //                 },
  //                 { onConflict: "artistid" }
  //               );

  //               if (error) {
  //                 console.error(
  //                   `Supabase insert error for ${artistJson.name}:`,
  //                   error
  //                 );
  //               }
  //             } catch (err) {
  //               console.error(`Failed to insert artist ${artistInfo.id}:`, err);
  //             }
  //           })
  //         );
  //       }

  //       const { error: insertError } = await supabase.from("music").insert([
  //         {
  //           albumid: json.id,
  //           artistid: json.artists[0].id,
  //           title: json.name,
  //           spotifylink: json.external_urls.spotify,
  //           coverart: json.images[0].url,
  //           releasedate: new Date(normalizedReleaseDate).toISOString(), // always valid timestamp
  //           tracks: json.tracks,
  //           type: json.album_type,
  //         },
  //       ]);

  //       if (insertError) {
  //         console.error("Error inserting album:", insertError.message);
  //       }
  //     } catch (error) {
  //       console.error("Error in fetchAndMaybeInsertAlbum:", error.message);
  //     }
  //   };
  //   fetchAndMaybeInsertAlbum();
  // }, [albumId]);

  if (
    !albumInfo ||
    !albumInfo.coverart ||
    !artistInfo ||
    !artistInfo.artistid ||
    !displayedReview
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
                  <div className="album-title-container">
                    <AlbumTitle title={albumInfo.title} />
                  </div>
                  <div className="album-info">
                    <AlbumMetaInfo
                      type={
                        albumInfo.type.charAt(0).toUpperCase() +
                        String(albumInfo.type).slice(1)
                      }
                      year={new Intl.DateTimeFormat("en-US").format(
                        new Date(albumInfo.releasedate)
                      )}
                      trackCount={albumInfo?.tracks.total}
                    />
                  </div>
                  <ArtistButton
                    artistPicture={artistInfo.profilepic}
                    artistName={artistInfo.artistName}
                    onClick={goToArtistProfile}
                  />
                </div>
              </div>
              <div className="ratings-flex-container">
                <ArtistRatings
                  displayedReview={displayedReview}
                  albumInfo={albumInfo}
                  setUpdatedReview={setUpdatedReview}
                />
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
                      <UsersReviews
                        albumId={albumId}
                        setDisplayedReviews={setDisplayedReviews}
                        updatedReview={updatedReview}
                      />
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
                      <UsersReviews
                        albumId={albumId}
                        limit={3}
                        setDisplayedReviews={setDisplayedReviews}
                        updatedReview={updatedReview}
                      />
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
