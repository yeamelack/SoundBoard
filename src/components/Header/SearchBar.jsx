import "../../styles/Header/SearchBar.css";

function SearchBar({
  value,
  onChange,
  onFocus,
  inputRef,
  className,
  placeholder,
  onKeyDown
}) {
  return (
    <input
      ref={inputRef}
      className={className}
      type="search"
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      onFocus={onFocus}
    />
  );
}

export default SearchBar;
