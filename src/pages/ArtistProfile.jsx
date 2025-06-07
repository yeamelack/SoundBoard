import '../App.css';
import Album from '../components/artist profile/Album';
import Header from "../components/Header/Header";
import ArtistInfo from '../components/artist profile/ArtistInfo';
import ArtistRating from '../components/artist profile/ArtistRating';
import ArtistNavBar from '../components/artist profile/ArtistNavBar';
import PopularTracks from '../components/artist profile/PopularTracks';
// import downloadImg from '../assets/icons/artist profile icons/download.png';
import Discography from '../components/artist profile/Discography';
import OptionMenu from '../components/artist profile/OptionMenu';
import SimilarArtistList from '../components/artist profile/SimilarArtistList';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DiscographyScroll from '../components/artist profile/DiscographyScroll';





function ArtistProfile({ artistImg, name, totalRatings, avgRating, yourRating, popularSongs, discography }) {
    
    const { artistId, albumId } = useParams();
    const [albumInfo, setAlbumInfo] = useState("");
    const [artistData, setArtistData] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState([]);
    const [popularTracks, setPopularTracks] = useState([]);
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [selectedTab, setSelectedTab] = useState("home");



    useEffect(() => {
        const url = `http://localhost:8484/albums?q=${artistId}`;
        async function fetchAlbums() {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json();
            console.log("albums fetched :", json);
            setArtistAlbums(json);
          } catch (error) {
            console.error(error.message);
          }
        }
        fetchAlbums();
      }, [artistId]);

    useEffect(() => {
        async function fetchArtistInfo() {
        try {
            const response = await fetch(`http://localhost:8484/artist?q=${artistId}`);
            if (!response.ok) throw new Error("Failed to fetch artist data");
            const json = await response.json();
            console.log("Fetched artist data:", json);
            setArtistData(json);
        } catch (error) {
            console.error(error);
        }
        }
        fetchArtistInfo();
    }, [artistId]);

    useEffect(() => {
        async function fetchTopTracks() {
          try {
            const res = await fetch(`http://localhost:8484/getTopTracks?q=${artistId}`);
            if (!res.ok) throw new Error("Failed to fetch top tracks");
            const tracks = await res.json();
            console.log("Fetched top tracks:", tracks);
            setPopularTracks(tracks); // assuming your backend returns an array of strings
          } catch (error) {
            console.error("Error fetching top tracks:", error);
          }
        }
        
        fetchTopTracks();
      }, [artistId]);

      

      useEffect(() => {
        async function fetchRelatedArtists() {
          try {
            const res = await fetch(`http://localhost:8484/relatedArtists?q=${artistId}`);
            if (!res.ok) throw new Error("Failed to fetch related artists");
            const artists = await res.json();
            console.log("related artists:", artists);
            setRelatedArtists(artists);
          } catch (error) {
            console.error("Error fetching related artists:", error);
          }
        }
      
        fetchRelatedArtists();
      }, [artistId]);
      
      

    if (!artistData) return <div style={{ color: "white" }}>Loading artist info...</div>;
        
        
    return (
        <>
            <Header/>
            <div className='artist-profile-page'>
              <div className='artist-profile-page-grid'>
                  <div className='artist-header'>
                      <ArtistInfo artistImg={artistData.images[0].url} name={artistData.name}/>
                      <ArtistRating totalRatings={totalRatings} avgRating={avgRating} yourRating={yourRating}/>
                  </div>
                  <ArtistNavBar setSelectedTab={setSelectedTab}/>


                  {selectedTab !== "discography" ? (
                    <>  
                  <div className='grid-below-navbar'>
                      <div className='artist-left-grid'>
                          <div className='popular-tracks'>Popular tracks</div>
                          <div className='popular-tracks-grid'>
                              <PopularTracks popularSongs={popularTracks}/>
                          </div>

                          <div className="discography-container">
                              <p className="discography-title"> Discography</p>
                          </div>
                          <div className="discography-grid-container">
                              <Discography discography={artistAlbums}/>
                          </div>

                      </div>




                      <div className='artist-right-grid'>
                          <OptionMenu/>
                          <div class="similar-artists">
                              Similar artists you may like
                          </div>
                          <div className="similar-artists-background">
                              <SimilarArtistList relatedArtists={relatedArtists}/>
                          </div>
                      </div>
                  </div>
                    </>
                  ) : <DiscographyScroll discography={artistAlbums}/>}

                  
                  
                  

              </div>
            </div>
            

        </>
    )
}

export default ArtistProfile;