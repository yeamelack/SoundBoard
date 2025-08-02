// import Album from "../artist profile/Album";
// import "../../styles/artist profile/discog-page.css";

// const AlbumResults = ({ discography }) => {
//     return (
//         <div className="results-grid-container2">
//             <div className="album-grid">
//                 {discography.map((album, i) => (
//                     <Album key={i} imageSrc={album.images[0].url} title={album.name} variant="discography" />
                    
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default AlbumResults;

import Album from "../artist profile/Album";
import "../../styles/artist profile/discog-page.css";
import PopularAlbum from "../Homepage/PopularAlbum";

const AlbumResults = ({ discography }) => {
    return (
       
            <div className="results-grid-container">
                {discography.map((album, i) => (
                    <PopularAlbum
                    key={album.id}
                    artist={album.artists[0]?.name || "Unknown Artist"}
                    imgLink={album.images?.[1]?.url || album.images?.[0]?.url}
                    title={album.name}
                    artistId={album.artists[0]?.id}
                    albumId={album.id}
                  />
                  
                ))}
            </div>
        
    );
}

export default AlbumResults;