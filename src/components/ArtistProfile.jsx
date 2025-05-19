import '../App.css';
import Album from './Album';
import Header from './Header';
import ArtistInfo from './ArtistInfo';
import ArtistRating from './ArtistRating';
import ArtistNavBar from './ArtistNavBar';
import PopularTracks from './PopularTracks';
import downloadImg from '../assets/icons/download.png';
import Discography from './Discography';



function ArtistProfile({ artistImg, name, totalRatings, avgRating, yourRating, popularSongs, discography }) {
    return (
        <>
            <Header/>
            <div className='artist-profile-page-grid'>
                <div className='artist-header'>
                    <ArtistInfo artistImg={artistImg} name={name}/>
                    <ArtistRating totalRatings={totalRatings} avgRating={avgRating} yourRating={yourRating}/>
                </div>
                <ArtistNavBar/>
                <div className='grid-below-navbar'>
                    <div className='left-grid'>
                        <div className='popular-tracks'>Popular tracks</div>
                        <div className='popular-tracks-grid'>
                            <PopularTracks popularSongs={popularSongs}/>
                        </div>

                        <div class="discography-container">
                            <p class="discography-title"> Discography</p>
                        </div>
                        <div class="discography-grid-container">
                            <Discography discography={discography}/>
                        </div>

                    </div>




                    <div className='right-grid'>

                    </div>
                </div>
                
                
                

            </div>

        </>
    )
}

export default ArtistProfile;