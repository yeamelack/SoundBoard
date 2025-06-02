import "../../styles/artist profile/artist-profile.css";
import SimilarArtist from "./SimilarArtist";


const SimilarArtistList = ({ relatedArtists }) => {
    return (
        <>
            <div className="similar-artists-background">
                {relatedArtists.map((artist, i) => (
                    <SimilarArtist  key={i + 1} artistPic={artist.images[0]?.url} artistName={artist.name}/>
                ))}
            </div>
        
        </>
    )
}


export default SimilarArtistList;