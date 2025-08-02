import searchIcon from "../../assets/icons/search-icon.svg";
import "../../styles/Header/SearchButton.css";

function SearchButton() {
  return (
    <button className="search-button">
      <img className="search-icon" src={searchIcon} alt="Search" />
    </button>
  );
}

export default SearchButton;
