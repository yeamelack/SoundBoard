//import "../styles/artist profile/artist-profile.css"
import "../../styles/artist profile/artist-profile.css";


const Tracks = ({ idx, trackName, ranking }) => {
    return (
        <div className="popular-track">
            <div className="left">{idx}</div>
            <div className="middle">{trackName}</div>
            <div className="right">{ranking}</div>
        </div>
    )


}
export default Tracks;