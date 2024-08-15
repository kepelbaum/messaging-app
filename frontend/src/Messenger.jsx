/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Messenger = () => {
  const { chats, setChats, user, token, setUser, logout, id } =
    useContext(AppContext);

  const [page, setPage] = useState(null);
  const [users, setUsers] = useState(null);
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");
  const [scrollState, setScrollState] = useState([true, null]); //true = scrolled to the bottom
  const [activeElement, setActiveElement] = useState(null);
  const [upForDeletion, setUpForDeletion] = useState(null);
  const [addMenuToggle, setAddMenuToggle] = useState(false);
  const [groupAddMode, setGroupAddMode] = useState(false);
  const [dummyChat, setDummyChat] = useState(null);
  const [newGroup, setNewGroup] = useState(null);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("displayName");
  const [favorites, setFavorites] = useState(false);

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
  function addMenu() {
    if (addMenuToggle) {
      setAddMenuToggle(false);
      setGroupAddMode(false);
    } else {
      setAddMenuToggle(true);
    }
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

  function handleSearch(e) {
    setSearch(e.currentTarget.value.toLowerCase());
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
      // } else if (activeElement !== null) {
      //   fetch(
      //     "https://messaging-app-production-6dff.up.railway.app/messages/" +
      //       activeElement,
      //     {
      //       mode: "cors",
      //       method: "PUT",
      //       body: JSON.stringify({
      //         message: message,
      //       }),
      //       headers: {
      //         "Content-type": "application/json; charset=UTF-8",
      //         authorization: "Bearer " + (token ? token.toString() : ""),
      //       },
      //     },
      //   )
      //     .then((response) => response.json())
      //     .then((response) => {
      //       if (response.result) {
      //         setMessage("");
      //         setActiveElement(null);
      //       } else {
      //         throw new Error(Object.entries(response));
      //       }
      //     })
      //     .catch((error) => console.error(error));
      // }
    }
  }
  function timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

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
          let result = Object.keys(response).map((key) => [key, response[key]]);
          console.log(result[0][1]);
          if (result[0][1].toString() === "You are not signed in.") {
            logoutAndMove();
          } else {
            setChats(result[0][1]);
          }
        })
        .catch((error) => console.error(error));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://messaging-app-production-6dff.up.railway.app/users", {
        mode: "cors",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          let result = Object.keys(response).map((key) => [key, response[key]]);
          setUsers(result);
          // if (result[0][1].toString() === "You are not signed in.") {
          //   logoutAndMove();
          // } else {
          //   setChats(result[0][1]);
          // }
        })
        .catch((error) => console.error(error));
    }, 1000);
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
            setFriends(response.friends);
          } else {
            setUser(response.result);
          }
        })
        .catch((error) => console.error(error));
    });
  }, []);

  function untoggleFav() {
    if (favorites) {
      setFavorites(false);
    }
  }

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
      console.log(formData.getAll("image"), dummyChat);
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

  function handleFav(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    let newFriends = [...friends];
    if (!friends.includes(val)) {
      fetch("https://messaging-app-production-6dff.up.railway.app/users", {
        mode: "cors",
        method: "PUT",
        body: JSON.stringify({
          friends: newFriends.concat(val),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if ((response.result = "Settings updated")) {
            setFriends(newFriends.concat(val));
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    } else {
      let index = friends.indexOf(val);
      let removedUser = newFriends.splice(index, 1);
      fetch("https://messaging-app-production-6dff.up.railway.app/users", {
        mode: "cors",
        method: "PUT",
        body: JSON.stringify({
          friends: newFriends,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if ((response.result = "Settings updated")) {
            setFriends(newFriends);
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    }
  }

  function toggleFav() {
    if (!favorites) {
      setFavorites(true);
    }
  }

  function showChat(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    setDummyChat(null);
    setMessage("");
    setPage(val);
    // console.log(await val);
  }

  function newChat() {
    if (newGroup.message !== "" && newGroup.groupName !== "") {
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

  function handleSelect(e) {
    setSelect(e.currentTarget.value);
  }

  function handleGroupNameChange(e) {
    setNewGroup({ ...newGroup, groupName: e.currentTarget.value });
  }

  function handleGroupMessageChange(e) {
    setNewGroup({ ...newGroup, message: e.currentTarget.value });
  }

  function addToGroup(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    if (e.currentTarget.textContent === "Chat") {
      let findChat = chats.filter(
        (ele) =>
          !ele.groupName &&
          (ele.users[0]._id === val || ele.users[1]._id === val),
      );
      if (findChat.length === 1) {
        setPage(findChat[0]._id);
      } else {
        setMessage("");
        setActiveElement(null);
        setPage(null);
        setDummyChat(val);
      }
    } else if (newGroup) {
      if (e.currentTarget.textContent === "Add") {
        e.currentTarget.textContent = "Remove";
        e.currentTarget.classList.add("red");
        let newUsers = newGroup.users.concat(val);
        setNewGroup({ ...newGroup, users: newUsers });
      } else {
        e.currentTarget.textContent = "Add";
        e.currentTarget.classList.remove("red");
        let index = newGroup.users.indexOf(val);
        let newUsers = [...newGroup.users];
        let removedUser = newUsers.splice(index, 1);
        setNewGroup({ ...newGroup, users: newUsers });
      }
    } else {
      fetch(
        "https://messaging-app-production-6dff.up.railway.app/chats/" + page,
        {
          mode: "cors",
          method: "PUT",
          body: JSON.stringify({
            change: "add",
            newUser: val,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: "Bearer " + (token ? token.toString() : ""),
          },
        },
      )
        .then((response) => response.json())
        .then((response) => {
          if ((response.result = "Change complete")) {
            //do nothing
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
      // e.currentTarget.classList.add("borderless");
    } else {
      setGroupAddMode(true);
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
      // console.log(users);
      setNewGroup({
        users: [],
        groupName: null,
        message: "",
      });
    }
  }

  return (
    (chats && token && user && users && (
      <div className="body">
        <div className="left">
          <p onClick={logoutAndMove}>Logout</p>
          <p>Logged in as:</p>
          <p>{user.substring(9, user.length - 1)}</p>
          <h1 onClick={untoggleFav}>UNFAV</h1>
          <h1 onClick={toggleFav}>FAV</h1>
        </div>
        <div className="mid">
          <div className="chatmenu">
            <div className="chatmenutop">
              <h2>{addMenuToggle ? "Users" : "Chats"}</h2>
              <div className="row">
                <div>
                  {!addMenuToggle && !newGroup && <h1 onClick={addMenu}>+</h1>}
                  {addMenuToggle && !newGroup && <h1 onClick={addMenu}>-</h1>}
                </div>
                <h2 onClick={makeNewGroup}>{newGroup ? "X" : "NG"}</h2>
              </div>
            </div>
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
          </div>
          <div className="overflowdiv">
            {chats &&
              !addMenuToggle &&
              chats
                .filter((ele) =>
                  ele.groupName && select === "displayName"
                    ? ele.groupName.toLowerCase().startsWith(search) &&
                      ele.groupName.length >= search.length
                    : true,
                )
                .filter((ele) =>
                  !ele.groupName &&
                  select === "displayName" &&
                  ele.users[0]._id === id
                    ? ele.users[1].displayName
                        .toLowerCase()
                        .startsWith(search) &&
                      ele.users[1].displayName.length >= search.length
                    : !ele.groupName && select === "displayName"
                      ? ele.users[0].displayName
                          .toLowerCase()
                          .startsWith(search) &&
                        ele.users[0].displayName.length >= search.length
                      : true,
                )
                .filter((ele) =>
                  select === "username" &&
                  !ele.groupName &&
                  ele.users[0]._id === id
                    ? ele.users[1].username.toLowerCase().startsWith(search) &&
                      ele.users[1].username.length >= search.length
                    : !ele.groupName && select === "username"
                      ? ele.users[0].username
                          .toLowerCase()
                          .startsWith(search) &&
                        ele.users[0].username.length >= search.length
                      : ele.groupName && select === "username"
                        ? false
                        : true,
                )
                .filter((ele) => (favorites ? friends.includes(ele._id) : true))
                .sort((first, second) => {
                  var x = []
                    .concat(first.messages)
                    .sort((a, b) => {
                      return new Date(b.date - a.date);
                    })
                    .reverse()[0].date;
                  var y = []
                    .concat(second.messages)
                    .sort((a, b) => {
                      return new Date(b.date - a.date);
                    })
                    .reverse()[0].date;
                  return new Date(y) - new Date(x);
                })
                .map((ele) => {
                  return (
                    <div
                      className="wrap"
                      onClick={showChat}
                      val={ele._id}
                      key={ele._id}
                    >
                      <h5 onClick={handleFav} className="favicon" val={ele._id}>
                        {friends.includes(ele._id) ? "U" : "*"}
                      </h5>
                      <div className="avatar chatavatar"></div>
                      <div className="chatinfo">
                        <h3>
                          {ele.groupName
                            ? ele.groupName
                            : ele.users[0]._id === id
                              ? ele.users[1].displayName
                              : ele.users[0].displayName}
                        </h3>
                        {[]
                          .concat(ele.messages)
                          .sort((a, b) => {
                            return new Date(b.date - a.date);
                          })
                          .reverse()[0].text.length > 21
                          ? []
                              .concat(ele.messages)
                              .sort((a, b) => {
                                return new Date(b.date - a.date);
                              })
                              .reverse()[0]
                              .text.substring(0, 17) + "..."
                          : []
                              .concat(ele.messages)
                              .sort((a, b) => {
                                return new Date(b.date - a.date);
                              })
                              .reverse()[0]
                              .text.substring(0, 20)}
                      </div>
                      <div className="ago">
                        {timeSince(
                          new Date(
                            []
                              .concat(ele.messages)
                              .sort((a, b) => {
                                return new Date(b.date - a.date);
                              })
                              .reverse()[0].date,
                          ).getTime(),
                        )}
                      </div>
                    </div>
                  );
                })}
            {chats &&
              addMenuToggle &&
              users &&
              users
                .filter((ele) => ele[1]._id !== id)
                .filter((ele) =>
                  groupAddMode && !newGroup
                    ? !chats
                        .filter((chat) => chat._id === page)[0]
                        .users.map((user) => user._id)
                        .includes(ele[1]._id)
                    : ele,
                )
                .filter((ele) =>
                  select === "displayName"
                    ? ele[1].displayName.toLowerCase().startsWith(search) &&
                      ele[1].displayName.length >= search.length
                    : ele[1].username.toLowerCase().startsWith(search) &&
                      ele[1].username.length >= search.length,
                )
                .map((ele) => {
                  return (
                    <div className="wrap" key={ele[1]._id}>
                      <div className="avatar chatavatar"></div>
                      <div className="chatinfo">
                        <h3>{ele[1].displayName}</h3>
                        {<p>{"@" + ele[1].username}</p>}
                      </div>
                      <div className="chatbutton">
                        <button onClick={addToGroup} val={ele[1]._id}>
                          {groupAddMode ? "Add" : "Chat"}
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
        {((page || dummyChat) && (
          <div className="messagebox">
            <div className="chatinfotop">
              <div className="grouped">
                <div className="avatar"></div>
                {chats &&
                  page &&
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
                        <button onClick={toggleGroupMode}>
                          {groupAddMode ? "-" : "+"}
                        </button>
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
                                  <h4>
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
                                  </h3>{" "}
                                  <button onClick={handleDelete}>Yes</button>
                                  <button onClick={undelete}>No</button>
                                </div>
                              )}
                              {elem.user._id !== id && (
                                <div className="avatar"></div>
                              )}
                              <div
                                className={elem.img ? "imgmessage" : "azure"}
                              >
                                <h4>{elem.user.displayName}</h4>
                                {!elem.img && (
                                  <p className="textmessage">{elem.text}</p>
                                )}
                                {elem.img && <img src={elem.img}></img>}
                              </div>
                              {/* {elem.img && (
                                <div className="imgmessage">
                                  <h4>{elem.user.displayName}</h4>
                                  <img src={elem.img}></img>
                                </div>
                              )} */}
                              {elem.user._id === id && (
                                <div className="avatar"></div>
                              )}
                              {elem.user._id === id && (
                                <div className="editdelwrapper">
                                  {elem.user.img ? (
                                    <div
                                      className="edit"
                                      onClick={handleEdit}
                                      val={elem._id}
                                      text={elem.text}
                                    >
                                      Edit
                                    </div>
                                  ) : (
                                    ""
                                  )}
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
            {dummyChat && users && <div className="messagemasterwrapper"></div>}
            {dummyChat && users && (
              <div className="bottomsection">
                <textarea
                  value={message}
                  onChange={handleChange}
                  id="entermessage"
                  placeholder="Enter message here..."
                ></textarea>
                <button onClick={handleImg}>Img</button>
                <button className="enterbutton" onClick={handleDummySubmit}>
                  Enter
                </button>
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
                        value={message}
                        onChange={handleChange}
                        id="entermessage"
                        placeholder="Enter message here..."
                      ></textarea>
                      <button onClick={handleImg}>Img</button>
                      <button className="enterbutton" onClick={handleSubmit}>
                        Enter
                      </button>
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
        )) ||
          (newGroup && users && (
            <div className="newgroup">
              <h2>Create New Group</h2>
              <label htmlFor="groupname">Group Name:</label>
              <input
                id="groupname"
                type="text"
                min="1"
                max="50"
                placeholder="Enter group name here..."
                onChange={handleGroupNameChange}
              ></input>
              <label htmlFor="firstmessage">Enter the first message.</label>
              <input
                type="text"
                id="firstmessage"
                placeholder="Enter first message here..."
                onChange={handleGroupMessageChange}
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
                          <div className="avatar"></div>
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
              <button type="submit" onClick={newChat}>
                Submit!
              </button>
            </div>
          )) || <div className="imgcontainer"></div>}
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Messenger;
