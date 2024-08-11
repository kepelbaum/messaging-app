/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Messenger = ({ delay }) => {
  const { chats, setChats, user, token, setToken, setUser, logout, id, setId } =
    useContext(AppContext);

  const [page, setPage] = useState(null);
  const [message, setMessage] = useState("");
  const [scrollState, setScrollState] = useState([true, null]); //true = scrolled to the bottom
  const [activeElement, setActiveElement] = useState(null);
  const [upForDeletion, setUpForDeletion] = useState(null);

  const navigate = useNavigate();

  const movePage = (url) => {
    navigate(url);
  };

  function areyousurechat(e) {
    setActiveElement(null);
    setMessage("");
    setUpForDeletion(e.currentTarget.attributes.getNamedItem("val").value);
  }

  function logoutAndMove() {
    logout();
    movePage("/");
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
        if ((response.result = "Chat deleted")) {
          setPage(null);
          movePage("/app");
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
        if ((response.result = "Left the chat")) {
          setPage(null);
          movePage("/app");
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
    }
  }

  const messagesEndRef = useRef(null);
  // const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

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

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      if (seconds < 31536000 * 2 && seconds > 31535999) {
        return Math.floor(interval) + " year ago";
      } else {
        return Math.floor(interval) + " years ago";
      }
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      if (seconds < 2592000 * 2 && seconds > 2591999) {
        return Math.floor(interval) + " month ago";
      } else {
        return Math.floor(interval) + " months ago";
      }
    }
    interval = seconds / 86400;
    if (interval > 1) {
      if (seconds < 86400 * 2 && seconds > 86399) {
        return Math.floor(interval) + " day ago";
      } else {
        return Math.floor(interval) + " days ago";
      }
    }
    interval = seconds / 3600;
    if (interval > 1) {
      if (seconds < 7200 && seconds > 3599) {
        return Math.floor(interval) + " hour ago";
      } else {
        return Math.floor(interval) + " hours ago";
      }
    }
    interval = seconds / 60;
    if (interval > 1) {
      if (seconds < 120 && seconds > 59) {
        return Math.floor(interval) + " minute ago";
      } else {
        return Math.floor(interval) + " minutes ago";
      }
    }
    return Math.floor(seconds) + " seconds ago";
  }

  useEffect(() => {
    scrollToBottom();
  }, [page]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://messaging-app-production-6dff.up.railway.app/chats", {
        mode: "cors",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          var result = Object.keys(response).map((key) => [key, response[key]]);
          // console.log(result[0][1]);
          if (result[0][1].toString() === "You are not signed in.") {
            logoutAndMove();
          }
          setChats(result[0][1]);
        })
        .catch((error) => console.error(error));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetch("https://messaging-app-production-6dff.up.railway.app/", {
        mode: "cors",
        headers: {
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message) {
            setUser(response.message);
          } else {
            setUser(response.result);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [token]);

  async function showChat(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    setPage(val);
    // console.log(await val);
  }

  return (
    (chats && token && (
      <div className="body">
        <div className="left">
          <p onClick={logoutAndMove}>Logout</p>
          <p>Logged in as:</p>
          <p>{user.substring(9, user.length - 1)}</p>
        </div>
        <div className="mid">
          <div className="chatmenu">
            <h2>Chats</h2>
          </div>
          {chats &&
            chats.map((ele) => {
              return (
                <div
                  className="wrap"
                  onClick={showChat}
                  val={ele._id}
                  key={ele._id}
                >
                  <div className="avatar chatavatar"></div>
                  <div className="chatinfo">
                    <h3>
                      {ele.groupName
                        ? ele.groupName
                        : ele.users[0]._id === id
                          ? ele.users[1].displayName
                          : ele.users[0].displayName}
                    </h3>
                    <p>{ele.lastMessage.text}</p>
                  </div>
                  <div className="ago">
                    {timeSince(new Date(ele.lastMessage.date).getTime())}
                  </div>
                </div>
              );
            })}
        </div>
        {(page && (
          <div className="messagebox">
            <div className="chatinfotop">
              <div className="grouped">
                <div className="avatar"></div>
                {chats &&
                  chats
                    .filter((ele) => page === ele._id)
                    .map((ele) => {
                      return (
                        <div className="groupinfo" key={ele._id}>
                          <h3>
                            {ele.groupName
                              ? ele.groupName
                              : ele.users[0]._id === id
                                ? ele.users[1].displayName
                                : ele.users[0].displayName}
                          </h3>
                          <p>
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
              </div>
              {chats &&
                chats
                  .filter((ele) => page === ele._id && ele.groupName)
                  .map((ele) => {
                    return (
                      <div className="topbuttons" key="topbuttons">
                        {ele._id === upForDeletion && (
                          <div className="grouped">
                            <h3>Are you sure you want to leave this chat?</h3>
                            <button onClick={handleLeave}>Yes</button>
                            <button onClick={undelete}>No</button>
                          </div>
                        )}
                        {ele._id !== upForDeletion && (
                          <button onClick={areyousurechat} val={ele._id}>
                            Leave Chat
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
                      {ele.messages.map((elem) => {
                        return (
                          <div className="messagewrapper" key={elem._id}>
                            <div
                              className={
                                elem.user._id === id &&
                                elem._id === activeElement
                                  ? "message right orange"
                                  : elem.user._id === id
                                    ? "message right"
                                    : "message"
                              }
                            >
                              {elem._id === upForDeletion && (
                                <div className="deletiondiv">
                                  <h3>
                                    Are you sure you want to delete this
                                    message?
                                  </h3>
                                  <button onClick={handleDelete}>Yes</button>
                                  <button onClick={undelete}>No</button>
                                </div>
                              )}
                              {elem.user._id !== id && (
                                <div className="avatar"></div>
                              )}
                              <div className="azure">
                                <h4>{elem.user.displayName}</h4>
                                <p>{elem.text}</p>
                              </div>
                              {elem.user._id === id && (
                                <div className="avatar"></div>
                              )}
                              {elem.user._id === id && (
                                <div className="editdelwrapper">
                                  <div
                                    className="edit"
                                    onClick={handleEdit}
                                    val={elem._id}
                                    text={elem.text}
                                  >
                                    Edit
                                  </div>
                                  <div
                                    className="delete"
                                    onClick={areyousure}
                                    val={elem._id}
                                  >
                                    Delete
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
            {page &&
              chats &&
              chats
                .filter((ele) => page === ele._id)
                .map((ele) => {
                  return (
                    <div className="bottomsection" key={ele._id}>
                      <textarea
                        value={message}
                        onChange={handleChange}
                        id="entermessage"
                        placeholder="Enter message here..."
                      ></textarea>
                      <button className="enterbutton" onClick={handleSubmit}>
                        Enter
                      </button>
                    </div>
                  );
                })}
          </div>
        )) || <div className="imgcontainer"></div>}
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Messenger;
