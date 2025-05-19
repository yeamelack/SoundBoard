import "../styles/artist-profile.css"

const Tracks = ({ idx, trackName, ranking }) => {
    return (
        <div className="popular-track">
            <div class="left">{idx}</div>
            <div class="middle">{trackName}</div>
            <div class="right">{ranking}</div>
        </div>
    )


}
export default Tracks;