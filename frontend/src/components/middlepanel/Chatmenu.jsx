/* eslint-disable react/react-in-jsx-scope */
import SearchAndSelect from "./SearchAndSelect";
import CollapseLeftSvg from "./CollapseLeftSvg";
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function Chatmenu() {
  const {
    setPage,
    setDummyChat,
    setActiveElement,
    setProfile,
    newGroup,
    setNewGroup,
    addMenuToggle,
    setAddMenuToggle,
    setGroupAddMode,
    setBioEdit,
    setPassEdit,
    setMemberFilter,
    setCollapse,
    setUpForDeletion,
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

  function makeNewGroup() {
    if (newGroup) {
      setNewGroup(null);
      setAddMenuToggle(false);
      setGroupAddMode(false);
    } else {
      setActiveElement(null);
      setUpForDeletion(null);
      setAddMenuToggle(true);
      setGroupAddMode(true);
      setDummyChat(null);
      setPage(null);
      setProfile(null);
      setBioEdit(false);
      setPassEdit(false);
      setMemberFilter(false);
      setCollapse("left");
      setNewGroup({
        users: [],
        groupName: null,
        message: "",
      });
    }
  }

  return (
    <div className="chatmenu">
      <CollapseLeftSvg />
      <div className="chatmenutop">
        <h2>{addMenuToggle ? "Users" : "Chats"}</h2>
        <div className="row">
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
                className="feather feather-user"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
          {newGroup ? (
            <svg
              onClick={makeNewGroup}
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
          ) : (
            <svg
              onClick={makeNewGroup}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
              />
            </svg>
          )}
        </div>
      </div>
      <SearchAndSelect />
    </div>
  );
}
export default Chatmenu;
