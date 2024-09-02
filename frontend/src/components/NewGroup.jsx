/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../Messenger";

function NewGroup() {
  const {
    token,
    users,
    greenButton,
    collapse,
    newGroup,
    setNewGroup,
    setGroupAddMode,
    setAddMenuToggle,
    collapseRight,
    setPage,
  } = useContext(MainContext);

  function newChat() {
    if (
      newGroup.message !== "" &&
      newGroup.groupName !== "" &&
      newGroup.groupName !== null
    ) {
      fetch("https://messaging-app-production-6dff.up.railway.app/chats", {
        mode: "cors",
        method: "POST",
        body: JSON.stringify({
          message: newGroup.message,
          groupName: newGroup.groupName,
          users: newGroup.users,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.result) {
            setNewGroup(null);
            setGroupAddMode(false);
            setAddMenuToggle(false);
            setTimeout(setPage(response.result), 500);
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    }
  }

  function handleGroupNameChange(e) {
    setNewGroup({ ...newGroup, groupName: e.currentTarget.value });
  }

  function handleGroupMessageChange(e) {
    setNewGroup({ ...newGroup, message: e.currentTarget.value });
  }

  return (
    <div className={collapse === "right" ? "newgroup collapse" : "newgroup"}>
      <div className="ngright">
        <svg
          onClick={collapseRight}
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-chevrons-left collrightsvg"
        >
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </div>
      <h2>Create New Group</h2>
      <label htmlFor="groupname">Group Name:</label>
      <input
        id="groupname"
        type="text"
        minLength={1}
        maxLength={50}
        placeholder="Enter group name here..."
        onChange={handleGroupNameChange}
      ></input>
      <label htmlFor="firstmessage">Enter the first message.</label>
      <input
        type="text"
        id="firstmessage"
        placeholder="Enter first message here..."
        onChange={handleGroupMessageChange}
        maxLength={500}
      ></input>
      <h3>Invited users will show up here.</h3>
      <h4>
        {newGroup.users.length === 0
          ? "No members added."
          : "You and " + newGroup.users.length + " other members:"}
      </h4>
      <div className="grid">
        {users
          .filter((ele) => newGroup.users.includes(ele[1]._id))
          .map((ele) => {
            return (
              <div className="useravatarwrapper" key={ele[1]._id}>
                <div className="newchatrow">
                  <div
                    className="avatar"
                    style={{
                      backgroundImage: 'url("' + ele[1].avatar + '")',
                    }}
                  ></div>
                  <h4>
                    {"@" +
                      (ele[1].username.length > 13
                        ? ele[1].username.substring(0, 10) + "..."
                        : ele[1].username)}
                  </h4>
                </div>
              </div>
            );
          })}
      </div>
      <button
        type="submit"
        className={greenButton ? "green" : "grey"}
        onClick={newChat}
      >
        {greenButton ? "Submit!" : "Invalid"}
      </button>
    </div>
  );
}

export default NewGroup;
