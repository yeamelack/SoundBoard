import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Album from './components/Album';
import Header from './components/Header';
import ArtistProfile from './components/ArtistProfile'; // your full artist page
import downloadImg from './assets/icons/download.png';
import artistPhoto from './assets/icons/323dfc11dc957133e9fffaaa5fe2853c.1000x1000x1.jpg';

function App() {

  const [popularSongs, setPopularSongs] = useState([
    {
      idx: 1,
      trackName: "Be Nice 2 me",
      ranking: "ranking"

    },
    {
      idx: 2,
      trackName: "Amygdala",
      ranking: "ranking"
    },
    {
      idx: 3,
      trackName: "Drama",
      ranking: "ranking"
    },
    {
      idx: 4,
      trackName: "Reality Surf",
      ranking: "ranking"
    },
    {
      idx: 5,
      trackName: "Be Nice 2 Me",
      ranking: "ranking"
    },
    {
      idx: 6,
      trackName: "Amygdala",
      ranking: "ranking"
    }
  ])

  const [discography, setDiscography] = useState([
    {
      idx: 1,
      imageSrc: artistPhoto,
      title: "COLDVISIONS"

    },
    {
      idx: 2,
      imageSrc: artistPhoto,
      title: "COLDVISIONS"

    },
    {
      idx: 3,
      imageSrc: artistPhoto,
      title: "COLDVISIONS"

    },
    {
      idx: 4,
      imageSrc: artistPhoto,
      title: "COLDVISIONS"

    },
    {
      idx: 5,
      imageSrc: artistPhoto,
      title: "COLDVISIONS"

    },
    {
      idx: 6,
      imageSrc: artistPhoto,
      title: "COLDVISIONS"

    },
    {
      idx: 7,
      imageSrc: artistPhoto,
      title: "COLDVISIONS"

    },
    {
      idx: 8,
      imageSrc: artistPhoto,
      title: "COLDVISIONS"

    },
  ])



  return (
    <Router>
      <Header />

      <nav style={{ margin: '16px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/artist">Artist Profile</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <Album
              imageSrc={downloadImg}
              title="Dark Side of the Moon"
              artist="Pink Floyd"
            />
          }
        />
        <Route path="/artist" 
          element={
            <ArtistProfile
              artistImg={artistPhoto}
              name="Bladee"
              totalRatings={5}
              avgRating={4}
              yourRating={5}
              popularSongs={popularSongs}
              discography={discography}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
