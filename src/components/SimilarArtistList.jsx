import "../styles/artist-profile.css"
import SimilarArtist from "./SimilarArtist";


const SimilarArtistList = ({ relatedArtists }) => {
    return (
        <>
            <div className="similar-artists-background">
                {relatedArtists.map((artist) => (
                    <SimilarArtist  key={artist.idx} artistPic={artist.artistPic} artistName={artist.artistName}/>
                ))}
            </div>
        
        </>
    )
}


export default SimilarArtistList;