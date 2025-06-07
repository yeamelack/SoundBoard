import "../../styles/Header/SearchBar.css";

function SearchBar({
  value,
  onChange,
  onFocus,
  inputRef,
  className,
  placeholder,
}) {
  return (
    <input
      ref={inputRef}
      className={className}
      type="search"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      onFocus={onFocus}
    />
  );
}

export default SearchBar;
