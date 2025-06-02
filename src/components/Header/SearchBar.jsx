import "../../styles/Header/SearchBar.css";

function SearchBar({ value, onChange, onFocus, inputRef }) {
  return (
    <input
      ref={inputRef}
      className="search-bar"
      type="search"
      placeholder="Search"
      onChange={onChange}
      value={value}
      onFocus={onFocus}
    />
  );
}

export default SearchBar;
