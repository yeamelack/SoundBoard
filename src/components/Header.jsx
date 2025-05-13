import searchIcon from '../assets/images/search-icon.svg';
import userIcon from '../assets/images/user-icon.svg';

function Header() {
  return (
    <div className="header">
      <div className="left-section">
        <p className="logo">LOGO GOES HERE</p>
      </div>
      <div className="middle-section">
        <input className="search-bar" type="search" placeholder="Search" />
        <button className="search-button">
          <img className="search-icon" src={searchIcon} alt="Search" />
        </button>
      </div>
      <div className="right-section">
        <button className="chart-button">
          <p className="button-text">Charts</p>
        </button>
        <button className="review-button">
          <p className="button-text">Review</p>
        </button>
        <button className="user-button">
          <img className="user-icon" src={userIcon} alt="User" />
        </button>
      </div>
    </div>
  );
}

export default Header;
