/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";

function SearchAndSelect() {
  const { setSelect, setSearch } = useContext(MainContext);
  function handleSelect(e) {
    setSelect(e.currentTarget.value);
  }
  function handleSearch(e) {
    setSearch(e.currentTarget.value.toLowerCase());
  }
  return (
    <div className="chatmenubot">
      <select className="select" id="select" onChange={handleSelect}>
        <option value="displayName">Display/Group Name</option>
        <option value="username">Username(@)</option>
      </select>
      <input
        type="search"
        className="searchbar"
        onChange={handleSearch}
      ></input>
    </div>
  );
}

export default SearchAndSelect;
