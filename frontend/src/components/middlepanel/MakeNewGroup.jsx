/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";

function makeNewGroup() {
  const {
    newGroup,
    setNewGroup,
    setAddMenuToggle,
    setGroupAddMode,
    setActiveElement,
    setUpForDeletion,
    setDummyChat,
    setPage,
    setProfile,
    setBioEdit,
    setPassEdit,
    setMemberFilter,
    setCollapse,
  } = useContext(MainContext);

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
        groupName: "",
        message: "",
      });
    }
  }
  return (
    <div>
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
          className="feather feather-user"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ) : (
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
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )}
    </div>
  );
}
export default makeNewGroup;
