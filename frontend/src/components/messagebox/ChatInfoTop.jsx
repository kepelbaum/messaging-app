/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";

function ChatInfoTop({ undelete }) {
  const {
    id,
    token,
    dummyChat,
    page,
    setPage,
    movePage,
    users,
    chats,
    upForDeletion,
    setUpForDeletion,
    groupAddMode,
    setGroupAddMode,
    handleMemberFilter,
    setAddMenuToggle,
    setMemberFilter,
    collapseRight,
    setCollapse,
    handleProfile,
    setMessage,
    setActiveElement,
  } = useContext(MainContext);

  function doNothing() {}
  function areyousurechat(e) {
    setActiveElement(null);
    setMessage("");
    setUpForDeletion(e.currentTarget.attributes.getNamedItem("val").value);
    setGroupAddMode(false);
  }

  function toggleGroupMode(e) {
    if (groupAddMode) {
      setGroupAddMode(false);
      setAddMenuToggle(false);
      setMemberFilter(false);
      // e.currentTarget.classList.add("borderless");
    } else {
      setGroupAddMode(true);
      setAddMenuToggle(true);
      setMemberFilter(false);
      setCollapse("right");
    }
  }

  function handleLeave() {
    fetch(
      "https://messaging-app-production-6dff.up.railway.app/chats/" + page,
      {
        mode: "cors",
        method: "PUT",
        body: JSON.stringify({
          change: "leave",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      },
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.result === "Left the chat") {
          setPage(null);
          movePage("/app");
          setMemberFilter(false);
        } else {
          throw new Error(Object.entries(response));
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="chatinfotop">
      <div className="grouped">
        <div className="collright">
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
        <div
          className="avatar"
          onClick={handleProfile}
          val={page ? page : dummyChat}
          style={{
            backgroundImage:
              'url("' +
              (dummyChat
                ? users.filter((ele) => dummyChat === ele[1]._id)[0][1].avatar
                : !chats.filter((ele) => ele._id === page)[0]
                  ? ""
                  : chats.filter((ele) => ele._id === page)[0].groupName
                    ? chats.filter((ele) => ele._id === page)[0].avatar
                    : chats.filter((ele) => ele._id === page)[0].users[0]
                          ._id === id
                      ? chats.filter((ele) => ele._id === page)[0].users[1]
                          .avatar
                      : chats.filter((ele) => ele._id === page)[0].users[0]
                          .avatar) +
              '")',
          }}
        ></div>
        {chats &&
          page &&
          chats
            .filter((ele) => page === ele._id)
            .map((ele) => {
              return (
                <div className="groupinfo" key={ele._id}>
                  <h3>
                    {(ele.groupName
                      ? ele.groupName
                      : ele.users[0]._id === id
                        ? ele.users[1].displayName
                        : ele.users[0].displayName
                    ).length > 13
                      ? (ele.groupName
                          ? ele.groupName
                          : ele.users[0]._id === id
                            ? ele.users[1].displayName
                            : ele.users[0].displayName
                        ).substring(0, 9) + "..."
                      : ele.groupName
                        ? ele.groupName
                        : ele.users[0]._id === id
                          ? ele.users[1].displayName
                          : ele.users[0].displayName}
                  </h3>
                  <p
                    className={ele.groupName ? "highlight" : ""}
                    onClick={ele.groupName ? handleMemberFilter : doNothing}
                  >
                    {ele.groupName
                      ? ele.users.length > 1
                        ? ele.users.length + " members"
                        : ele.users.length + " member"
                      : ele.users[0]._id === id
                        ? "@" + ele.users[1].username
                        : "@" + ele.users[0].username}
                  </p>
                </div>
              );
            })}
        {dummyChat &&
          users &&
          users
            .filter((ele) => dummyChat === ele[1]._id)
            .map((ele) => {
              return (
                <div className="groupinfo" key={dummyChat}>
                  <h3>{ele[1].displayName}</h3>
                  <p>{"@" + ele[1].username}</p>
                </div>
              );
            })}
      </div>
      {chats &&
        page &&
        chats
          .filter((ele) => page === ele._id && ele.groupName)
          .map((ele) => {
            return (
              <div className="topbuttons" key="topbuttons">
                {!upForDeletion && (
                  <button onClick={toggleGroupMode}>
                    {groupAddMode ? "-" : "+"}
                  </button>
                )}

                {ele._id === upForDeletion && (
                  <div className="chatdeletediv">
                    <h3>Are you sure you want to leave this chat?</h3>
                    <div className="buttonsmobile">
                      <button className="yes" onClick={handleLeave}>
                        Yes
                      </button>
                      <button className="no" onClick={undelete}>
                        No
                      </button>
                    </div>
                  </div>
                )}
                {ele._id !== upForDeletion && (
                  <button onClick={areyousurechat} val={ele._id}>
                    Leave
                  </button>
                )}
              </div>
            );
          })}
    </div>
  );
}
export default ChatInfoTop;
