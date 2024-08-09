/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Messenger = ({ delay }) => {
  const { chats, setChats, user, token, setToken, setUser, logout, id } =
    useContext(AppContext);

  const [page, setPage] = useState(null);

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
    setTimeout(() => {
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
          console.log(result[0][1]);
          setChats(result[0][1]);
        })
        .catch((error) => console.error(error));
    });
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
    let val = e.target.attributes.getNamedItem("val").value;
    setPage(val);
    console.log(await val);
  }

  return (
    (chats && (
      <div className="body">
        <div className="left">
          <p onClick={logout}>Logout</p>
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
                  <div className="avatar"></div>
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

                  {/* {page &&
                    page === ele._id &&
                    ele.messages.map((elem) => {
                      return (
                        <h4 key={elem._id}>
                          {elem.user.displayName}
                          {elem.text}
                        </h4>
                      );
                    })} */}
                </div>
              );
            })}
          {/* {!page && <h4>No pages active.</h4>} */}
        </div>
        <div className="wrapper">
          {chats &&
            chats.map((ele) => {
              return (
                <div className="wrapp" key={ele._id}>
                  {page &&
                    page === ele._id &&
                    ele.messages.map((elem) => {
                      return (
                        <h4 key={elem._id}>
                          {elem.user.displayName}
                          {elem.text}
                        </h4>
                      );
                    })}
                </div>
              );
            })}
          {!page && <h4>No pages active.</h4>}
        </div>
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Messenger;
