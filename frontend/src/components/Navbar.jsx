/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect, useRef } from "react";
import { MainContext } from "../Messenger";

function Navbar() {
  const {
    favorites,
    setFavorites,
    users,
    id,
    logoutAndMove,
    setActiveElement,
    setMemberFilter,
    setAddMenuToggle,
    setGroupAddMode,
    setCollapse,
    handleProfile,
    newGroup,
  } = useContext(MainContext);

  function toggleFav() {
    if (!favorites) {
      setFavorites(true);
    }
    setActiveElement(null);
    setMemberFilter(false);
    if (!newGroup) {
      setAddMenuToggle(false);
      setGroupAddMode(false);
      setCollapse("right");
    }
  }

  function untoggleFav() {
    if (favorites) {
      setFavorites(false);
    }
    if (!newGroup) {
      setAddMenuToggle(false);
      setGroupAddMode(false);
    }
    setActiveElement(null);
    setMemberFilter(false);
    setCollapse("right");
  }

  return (
    <div className="left">
      <svg
        onClick={logoutAndMove}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-log-out"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      {/* <p>Logged in as:</p>
          <p>{user.substring(9, user.length - 1)}</p> */}
      <svg
        onClick={untoggleFav}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-users"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <svg
        onClick={toggleFav}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-star"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      <div
        className="avatar whiteborder"
        style={{
          backgroundImage:
            'url("' +
            (users.filter((ele) => ele[1]._id === id)[0]
              ? users.filter((ele) => ele[1]._id === id)[0][1].avatar
              : "") +
            '")',
        }}
        onClick={handleProfile}
        val={id}
      ></div>
    </div>
  );
}

export default Navbar;
