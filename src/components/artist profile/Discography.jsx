import Album from "./Album";
import "../../styles/artist profile/discog-page.css";

const Discography = ({ discography }) => {
    return (
        <div className="discography-page">
            <div className="discography-grid">
                {discography.slice(0, 8).map((album, i) => (
                    <Album key={i} imageSrc={album.images[0].url} title={album.name} variant="discography" />
                ))}
            </div>
        </div>
    );
}

export default Discography;
