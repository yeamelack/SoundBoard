import "../../styles/artist profile/artist-profile.css";
import Tracks from "./Tracks";

const PopularTracks = ({ popularSongs }) => {
    return (
        <>
            <div className="popular-tracks-grid">
                {popularSongs.map((title, i) => (
                    <Tracks key={i} idx={i + 1} trackName={title} ranking={"-"}/>
                ))}
            </div>
        
        </>
    )
}


export default PopularTracks;