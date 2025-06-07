import Album from "./Album";
import "../../styles/artist profile/discog-page.css";

const DiscographyScroll = ({ discography }) => {
    return (
        <div className="scrollable-album-row-container">
            <div className="discography-scroll-grid">
                {discography.map((album, i) => (
                <Album key={i} imageSrc={album.images[0].url} title={album.name} variant="discography" />
                ))}
            </div>
        </div>

    );
}

export default DiscographyScroll;