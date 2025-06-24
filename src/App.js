import "./App.css";
import Header from "./components/Header/Header";
import AlbumPage from "./pages/AlbumPage";
import ArtistProfile from "./pages/ArtistProfile";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <div className="whole-site-css">
      <Header/>
      <AlbumPage />
      <ArtistProfile />
      <ResultsPage/>
    </div>
  );
}
export default App;
