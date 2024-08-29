/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function CollapseLeftSvg() {
  const { profile, page, dummyChat, newGroup, setCollapse } =
    useContext(MainContext);
  function collapseLeft() {
    setCollapse("left");
  }
  return (
    <div className="collleft">
      {(profile || page || newGroup || dummyChat) && (
        <svg
          onClick={collapseLeft}
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-chevrons-right"
        >
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
      )}
    </div>
  );
}

export default CollapseLeftSvg;
