import "../../styles/artist profile/artist-profile.css";

const ArtistNavBar = ({ setSelectedTab }) => {
    return (
        <div className="artist-page-navbar">
            <div className="home-button-grid">
                <div className="button-container">
                    <div className="home-nav-button-container">
                        <button className="home-button">Home</button>
                    </div>
                    <div className="under-button">
                        <div></div>
                    </div>
                </div>
                <div className="underglow"></div>
            </div>
            <div className="home-button-grid">
                <div className="button-container">
                    <div className="home-nav-button-container">
                        <button 
                            className="discog-button"
                            onClick={() => setSelectedTab("discography")}
                        >
                            Discography
                        </button>
                    </div>
                </div>
                <div className="underglow"></div>
            </div>
        </div>
    )
}

export default ArtistNavBar;