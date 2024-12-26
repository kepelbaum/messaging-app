/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function AddMenu() {
  const {
    addMenuToggle,
    setAddMenuToggle,
    setGroupAddMode,
    setMemberFilter,
    newGroup,
  } = useContext(MainContext);

  function addMenu() {
    if (addMenuToggle) {
      setAddMenuToggle(false);
      setGroupAddMode(false);
      setMemberFilter(false);
    } else {
      setAddMenuToggle(true);
    }
  }

  return (
    <div>
      {!addMenuToggle && !newGroup && (
        <svg
          onClick={addMenu}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-user-plus"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      )}
      {addMenuToggle && !newGroup && (
        <svg
          onClick={addMenu}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-user-x"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="18" y1="8" x2="23" y2="13"></line>
          <line x1="23" y1="8" x2="18" y2="13"></line>
        </svg>
      )}
    </div>
  );
}

export default AddMenu;
