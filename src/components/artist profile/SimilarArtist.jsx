import "../../styles/artist profile/artist-profile.css";

const SimilarArtist = ({ artistPic, artistName }) => {
    return (
        <div className="flex-box-container">
            <div className="indv-flex-box">
                <div className="similar-artist-pic">
                    <img className="artist-pic" src={artistPic} alt=""></img>
                </div>
                <div className="similar-artist-name">
                    <p>{artistName}</p>
                </div>
            </div>
        </div>
    )


}
export default SimilarArtist;