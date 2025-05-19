import "../styles/artist-profile.css"
import Tracks from "./Tracks";

const PopularTracks = ({ popularSongs }) => {
    return (
        <>
            <div className="popular-tracks-grid">
                {popularSongs.map((song) => (
                    <Tracks key={song.idx} idx={song.idx} trackName={song.trackName} ranking={song.ranking}/>
                ))}
            </div>
        
        </>
    )
}


export default PopularTracks;