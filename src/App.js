import "./App.css";
import Header from "./components/Header/Header";
import AlbumPage from "./pages/AlbumPage";
import ArtistProfile from "./pages/ArtistProfile";

function App() {
  return (
    <div className="whole-site-css">
      <Header/>
      <AlbumPage />
      <ArtistProfile/>
    </div>
  );
}
export default App;
