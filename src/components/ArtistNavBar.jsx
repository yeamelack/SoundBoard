import "../styles/artist-profile.css"

const ArtistNavBar = () => {
    return (
        <div class="artist-page-navbar">
            <div class="home-button-grid">
                <div class="button-container">
                    <div class="home-nav-button-container">
                        <button class="home-button">Home</button>
                    </div>
                    <div class="under-button">
                        <div></div>
                    </div>
                </div>
                <div class="underglow"></div>
            </div>
            <div class="home-button-grid">
                <div class="button-container">
                    <div class="home-nav-button-container">
                        <button class="discog-button">Discography</button>
                    </div>
                </div>
                <div class="underglow"></div>
            </div>
        </div>
    )
}

export default ArtistNavBar;