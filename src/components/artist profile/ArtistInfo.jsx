import "../../styles/artist profile/artist-profile.css";


const ArtistInfo = ({artistImg, name}) => {
    return (
        <div className="artist-info-container">
            <div>
                <img className="artist-profile-img" src={artistImg} alt="Artist Image"></img>
            </div>
            <div className="artist-name-container">
                <p className="artist-name">{name}</p> 
            </div>
        </div>

    )
}

export default ArtistInfo;