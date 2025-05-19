import Album from "./Album"
import "../styles/discog-page.css";

const Discography = ({ discography }) => {
    return (
        <div className="discography-grid">
            {discography.map((album) => (
                <Album key={album.idx} imageSrc={album.imageSrc} title={album.title} variant="discography"/>
            ))}
        </div>

    )
}

export default Discography;