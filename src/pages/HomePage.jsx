import Header from "../components/Header/Header";
import "../styles/HomePage/HomePage.css";
import PopularThisWeek from "../components/Homepage/PopularThisWeek.jsx";
function HomePage() {
  return (
    <div className="homepage-grid">
      <div>
        <Header />
      </div>
      <div className="review-section">
        <PopularThisWeek />
      </div>

      <div className="popular-this-week">
        <span>Pool</span>
      </div>
    </div>
  );
}

export default HomePage;
