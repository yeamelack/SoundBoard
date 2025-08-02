import Album from "./Album";
import "../../styles/artist profile/discog-page.css";

const DiscographyScroll = ({ discography, artistId }) => {
    return (
        <div className="scrollable-album-row-container">
            <div className="discography-scroll-grid">
                {discography.map((album, i) => (
                <Album key={i} albumId={album.id}  artistId={artistId} imageSrc={album.images[0].url} title={album.name} variant="discography" />
                ))}
            </div>
        </div>

    );
}

export default DiscographyScroll;