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

function AlbumPage() {
  const { artistId, albumId } = useParams();
  const [albumInfo, setAlbumInfo] = useState("");
  const albumUrl = `http://localhost:8484/getAlbumInfo?q=${albumId}`;

  const [artistAlbums, setArtistAlbums] = useState([]);

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
    async function getAlbumData() {
      try {
        const response = await fetch(albumUrl);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setAlbumInfo(json);
      } catch (error) {
        console.error(error.message);
      }
    }
    getAlbumData();
  }, [albumUrl]);

  const [artistInfo, setArtistInfo] = useState([]);
  const artistUrl = `http://localhost:8484/artist?q=${artistId}`;

  useEffect(() => {
    async function getArtistInfo() {
      try {
        const response = await fetch(artistUrl);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setArtistInfo(json);
      } catch (error) {
        console.error(error.message);
      }
    }
    getArtistInfo();
  }, [artistUrl]);

  if (
    !albumInfo ||
    !albumInfo.images?.length ||
    !albumInfo.artists?.length ||
    !albumInfo.artists[0]?.id ||
    !artistInfo?.images?.length
  ) {
    return <div style={{ color: "white" }}>Loading album info...</div>;
  }

  return (
    <div>
      <Header />
      <div className="margin">
        <div className="album-banner-container">
          <div className="album-banner-rows">
            {console.log(albumInfo)}
            <AlbumArt
              artLink={albumInfo.images[0].url}
              albumName={albumInfo.name}
            />
            <div className="album-info-container">
              <div className="flex-text-container">
                <AlbumTitle title={albumInfo.name} />
                <AlbumMetaInfo
                  type={
                    albumInfo.album_type.charAt(0).toUpperCase() +
                    String(albumInfo.album_type).slice(1)
                  }
                  year={new Date(albumInfo.release_date).getFullYear()}
                  trackCount={albumInfo.total_tracks}
                />
                <ArtistButton
                  artistPicture={artistInfo.images[0].url}
                  artistName={artistInfo.name}
                />
              </div>
            </div>
            <div className="ratings-flex-container">
              <ArtistRatings albumInfo={albumInfo} />
            </div>
          </div>
          {/* Navigation */}
          <AlbumPageNavigationBar />
          {/* Main Grid */}
          <div className="grid-below-nav">
            {/* Left Side */}
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
            {/* Right Side */}
            <div className="right-side">
              <SpotifyReviewButtons
                spotifyLink={albumInfo.external_urls.spotify}
                result={albumInfo}
              />

              {artistAlbums.filter((album) => album.id !== albumId).length >
                0 && (
                <>
                  <div className="more-from-title">
                    More From {albumInfo.artists[0].name}
                  </div>
                  <MoreFromSection
                    artistId={albumInfo.artists[0].id}
                    albumId={albumId}
                    artistAlbums={artistAlbums}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumPage;
