/* eslint-disable react/react-in-jsx-scope */
import { useContext, useEffect, useRef } from "react";
import { MainContext } from "../Messenger";

function Messagebox() {
  const {
    id,
    token,
    message,
    setMessage,
    handleMemberFilter,
    setMemberFilter,
    collapse,
    setCollapse,
    collapseRight,
    page,
    setPage,
    dummyChat,
    setDummyChat,
    chats,
    users,
    upForDeletion,
    setUpForDeletion,
    activeElement,
    setActiveElement,
    handleProfile,
    groupAddMode,
    setGroupAddMode,
    setAddMenuToggle,
    movePage,
    scrollState,
    setScrollState,
  } = useContext(MainContext);

  useEffect(() => {
    let div = document.querySelector(".messagemasterwrapper");
    if (div !== null) {
      const isNotScrolling =
        div.scrollHeight - div.clientHeight <= div.scrollTop + 1;
      if (scrollState[1] === null || div.scrollHeight > scrollState[1]) {
        if (scrollState[0] === true) {
          scrollToBottom();
          setScrollState([true, div.scrollHeight]);
        } else {
          setScrollState([false, div.scrollHeight]);
        }
      } else if (isNotScrolling) {
        setScrollState([true, div.scrollHeight]);
      } else {
        setScrollState([false, div.scrollHeight]);
      }
    }
  }, [chats]);

  function areyousurechat(e) {
    setActiveElement(null);
    setMessage("");
    setUpForDeletion(e.currentTarget.attributes.getNamedItem("val").value);
    setGroupAddMode(false);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function undelete() {
    setUpForDeletion(null);
  }

  function handleDelete() {
    fetch(
      "https://messaging-app-production-6dff.up.railway.app/messages/" +
        page +
        "/" +
        upForDeletion,
      {
        mode: "cors",
        method: "DELETE",
        headers: {
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      },
    )
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        if (response.result === "Chat deleted") {
          setPage(null);
        } else if (!response.result) {
          throw new Error(Object.entries(response));
        }
      })
      .catch((error) => console.error(error));
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

  function areyousure(e) {
    setActiveElement(null);
    setMessage("");
    setUpForDeletion(e.currentTarget.attributes.getNamedItem("val").value);
  }

  function handleEdit(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    if (val === activeElement) {
      setActiveElement(null);
      setMessage("");
    } else {
      setMessage(e.currentTarget.attributes.getNamedItem("text").value);
      setActiveElement(val);
      setUpForDeletion(null);
    }
  }

  function handleSubmit() {
    if (message !== "" && activeElement === null) {
      fetch(
        "https://messaging-app-production-6dff.up.railway.app/messages/" + page,
        {
          mode: "cors",
          method: "POST",
          body: JSON.stringify({
            message: message,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: "Bearer " + (token ? token.toString() : ""),
          },
        },
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.result) {
            setMessage("");
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    } else if (activeElement !== null) {
      fetch(
        "https://messaging-app-production-6dff.up.railway.app/messages/" +
          activeElement,
        {
          mode: "cors",
          method: "PUT",
          body: JSON.stringify({
            message: message,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: "Bearer " + (token ? token.toString() : ""),
          },
        },
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.result) {
            setMessage("");
            setActiveElement(null);
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    }
  }

  const messagesEndRef = useRef(null);
  // const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [page]);

  function handleDummySubmit() {
    if (message !== "") {
      fetch("https://messaging-app-production-6dff.up.railway.app/chats", {
        mode: "cors",
        method: "POST",
        body: JSON.stringify({
          message: message,
          users: [dummyChat],
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.result && response.result !== "Chat already exists") {
            setMessage("");
            setDummyChat(null);
            setTimeout(setPage(response.result), 500);
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    }
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

  function convertTime(time) {
    let hrs = Number(time.substring(0, 2));
    hrs = hrs >= 12 ? (hrs - 12).toString() + "PM" : hrs.toString() + "AM";
    if (hrs.length === 3) {
      hrs = "0" + hrs;
    }
    return (
      hrs.substring(0, 2) + time.substring(2, 10) + " " + hrs.substring(2, 4)
    );
  }

  function doNothing() {}

  function handleImg() {
    document.getElementById("image").click();
  }

  function uploadImg(e) {
    const formData = new FormData();
    formData.append("image", e.currentTarget.files[0]);
    if (!dummyChat) {
      fetch(
        "https://messaging-app-production-6dff.up.railway.app/messages/img/" +
          page,
        {
          mode: "cors",
          method: "POST",
          body: formData,
          headers: {
            // "Content-type": "multipart/form_data",
            authorization: "Bearer " + (token ? token.toString() : ""),
          },
        },
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.result === "Image uploaded") {
            //do nothing
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    } else {
      const formData = new FormData();
      formData.append("image", e.currentTarget.files[0]);
      // console.log(formData.getAll("image"), dummyChat);
      fetch(
        "https://messaging-app-production-6dff.up.railway.app/chats/" +
          dummyChat,
        {
          mode: "cors",
          method: "POST",
          body: formData,
          headers: {
            // "Content-type": "multipart/form_data",
            authorization: "Bearer " + (token ? token.toString() : ""),
          },
        },
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.result && response.result !== "Chat already exists") {
            setDummyChat(null);
            setPage(response.result);
            setAddMenuToggle(false);
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    }
  }

  return (
    <div
      className={collapse === "right" ? "messagebox collapse" : "messagebox"}
    >
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
      {page &&
        chats &&
        chats
          .filter((ele) => page === ele._id)
          .map((ele) => {
            return (
              <div
                // ref={messagesContainerRef}
                className="messagemasterwrapper"
                key={ele._id}
              >
                {ele.messages.map((elem, index) => {
                  return (
                    <div className="messagewrapper" key={elem._id}>
                      <div className="daywrapper">
                        <div className="line"></div>
                        {(index === 0 ||
                          new Date(ele.messages[index - 1].date)
                            .toISOString()
                            .substring(0, 10) !==
                            new Date(elem.date)
                              .toISOString()
                              .substring(0, 10)) && (
                          <div className="day">
                            <h4 className="border">
                              {new Date(elem.date)
                                .toISOString()
                                .substring(0, 10)}
                            </h4>
                          </div>
                        )}
                        <div className="line"></div>
                      </div>
                      <div
                        className={
                          elem.user._id === id && elem._id === activeElement
                            ? "message right orange"
                            : elem.user._id === id
                              ? "message right"
                              : "message"
                        }
                      >
                        {elem._id === upForDeletion && (
                          <div className="messagedeletediv">
                            <h3>
                              Are you sure you want to delete this message?
                            </h3>{" "}
                            <div className="yesorno">
                              <button className="yes" onClick={handleDelete}>
                                Yes
                              </button>
                              <button className="no" onClick={undelete}>
                                No
                              </button>
                            </div>
                          </div>
                        )}
                        {elem.user._id !== id && (
                          <div
                            className="avatar"
                            val={elem.user._id}
                            onClick={handleProfile}
                            style={{
                              backgroundImage:
                                'url("' + elem.user.avatar + '")',
                            }}
                          ></div>
                        )}
                        <div>
                          <div className={elem.img ? "imgmessage" : "azure"}>
                            <h4>{elem.user.displayName}</h4>
                            {!elem.img && (
                              <p className="textmessage">{elem.text}</p>
                            )}
                            {elem.img && <img src={elem.img}></img>}
                            <h5 className="date">
                              {convertTime(
                                new Date(elem.date)
                                  .toISOString()
                                  .substring(11, 19),
                              )}
                            </h5>
                          </div>
                        </div>
                        {elem.user._id === id && (
                          <div
                            className="avatar"
                            val={id}
                            onClick={handleProfile}
                            style={{
                              backgroundImage:
                                'url("' + elem.user.avatar + '")',
                            }}
                          ></div>
                        )}
                        {elem.user._id === id && (
                          <div className="editdelwrapper">
                            {!elem.img ? (
                              <div className="div">
                                <svg
                                  className="edit"
                                  onClick={handleEdit}
                                  val={elem._id}
                                  text={elem.text}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-edit"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="div">
                              <svg
                                className="delete"
                                onClick={areyousure}
                                val={elem._id}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-x"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </div>
                          </div>
                        )}
                        {/* <p className="small">
                  {new Date(elem.date).toLocaleTimeString()}
                </p> */}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            );
          })}
      {dummyChat && users && <div className="messagemasterwrapper"></div>}
      {dummyChat && users && (
        <div className="bottomsection">
          <textarea
            maxLength={500}
            value={message}
            onChange={handleChange}
            id="entermessage"
            placeholder="Enter message here..."
          ></textarea>
          <div className="smallgap">
            <button onClick={handleImg}>Img</button>
            <button className="enterbutton" onClick={handleDummySubmit}>
              Enter
            </button>
          </div>
        </div>
      )}
      {page &&
        chats &&
        chats
          .filter((ele) => page === ele._id)
          .map((ele) => {
            return (
              <div className="bottomsection" key={ele._id}>
                <textarea
                  maxLength={500}
                  value={message}
                  onChange={handleChange}
                  id="entermessage"
                  placeholder="Enter message here..."
                ></textarea>
                <div className="smallgap">
                  <button onClick={handleImg}>Img</button>
                  <button className="enterbutton" onClick={handleSubmit}>
                    Enter
                  </button>
                </div>
              </div>
            );
          })}
      <input
        type="file"
        accept="image/*"
        name="image"
        id="image"
        onChange={uploadImg}
      ></input>
    </div>
  );
}

export default Messagebox;
