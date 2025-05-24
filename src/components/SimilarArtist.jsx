import "../styles/artist-profile.css"

const SimilarArtist = ({ artistPic, artistName }) => {
    return (
        <div class="flex-box-container">
            <div class="indv-flex-box">
                <div class="similar-artist-pic">
                    <img class="artist-pic" src={artistPic} alt=""></img>
                </div>
                <div class="similar-artist-name">
                    <p>{artistName}</p>
                </div>
            </div>
        </div>
    )


}
export default SimilarArtist;