/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function ChatList() {
  const {
    favorites,
    setPage,
    id,
    token,
    setDummyChat,
    setMessage,
    setActiveElement,
    setProfile,
    handleProfile,
    addMenuToggle,
    chats,
    setBioEdit,
    setPassEdit,
    setMemberFilter,
    setCollapse,
    friends,
    setFriends,
    select,
    search,
  } = useContext(MainContext);

  function timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      // if (seconds < 31536000 * 2 && seconds > 31535999) {
      //   return Math.floor(interval) + " year ago";
      // } else {
      //   return Math.floor(interval) + " years ago";
      // }
      return Math.floor(interval) + " y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      // if (seconds < 2592000 * 2 && seconds > 2591999) {
      //   return Math.floor(interval) + " month ago";
      // } else {
      //   return Math.floor(interval) + " months ago";
      // }
      return Math.floor(interval) + " mo";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      // if (seconds < 86400 * 2 && seconds > 86399) {
      //   return Math.floor(interval) + " day ago";
      // } else {
      //   return Math.floor(interval) + " days ago";
      // }
      return Math.floor(interval) + " d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      // if (seconds < 7200 && seconds > 3599) {
      //   return Math.floor(interval) + " hour ago";
      // } else {
      //   return Math.floor(interval) + " hours ago";
      // }
      if (seconds < 7200 && seconds > 3599) {
        return Math.floor(interval) + " hr";
      } else {
        return Math.floor(interval) + " hrs";
      }
    }
    interval = seconds / 60;
    if (interval > 1) {
      // if (seconds < 120 && seconds > 59) {
      //   return Math.floor(interval) + " minute ago";
      // } else {
      //   return Math.floor(interval) + " minutes ago";
      // }
      return Math.floor(interval) + " m";
    }
    // return Math.floor(seconds) + " seconds ago";
    return Math.floor(seconds) + " s";
  }

  function showChat(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    let ifprof = e.target.attributes.getNamedItem("ifprof");
    if (!ifprof) {
      setDummyChat(null);
      setMessage("");
      setActiveElement(null);
      setProfile(null);
      setPage(val);
      setBioEdit(false);
      setPassEdit(false);
      setMemberFilter(false);
      setCollapse("left");
    }
  }

  function handleFav(e) {
    e.stopPropagation();
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
          if (response.message === "Settings updated") {
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
          if (response.message === "Settings updated") {
            setFriends(newFriends);
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    }
  }

  return (
    <div>
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
              ? ele.users[1].displayName.toLowerCase().startsWith(search) &&
                ele.users[1].displayName.length >= search.length
              : !ele.groupName && select === "displayName"
                ? ele.users[0].displayName.toLowerCase().startsWith(search) &&
                  ele.users[0].displayName.length >= search.length
                : true,
          )
          .filter((ele) =>
            select === "username" && !ele.groupName && ele.users[0]._id === id
              ? ele.users[1].username.toLowerCase().startsWith(search) &&
                ele.users[1].username.length >= search.length
              : !ele.groupName && select === "username"
                ? ele.users[0].username.toLowerCase().startsWith(search) &&
                  ele.users[0].username.length >= search.length
                : ele.groupName && select === "username"
                  ? false
                  : true,
          )
          .filter((ele) => (favorites ? friends.includes(ele._id) : true))
          .sort((first, second) => {
            if (first.messages.length > 0 && second.messages.length > 0) {
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
            } else {
              return true;
            }
          })
          .map((ele) => {
            return (
              <div
                className="wrap"
                onClick={showChat}
                val={ele._id}
                key={ele._id}
              >
                <div onClick={handleFav} className="favicon" val={ele._id}>
                  {friends.includes(ele._id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 2048 2048"
                    >
                      <path
                        fill="currentColor"
                        d="M1609 992q-125 0-234 44t-192 122t-133 186t-56 235l-610 469l248-794L0 768h784L1024 0l240 768h784l-313 240q-31-7-62-11t-64-5m-9 160q93 0 174 35t142 96t96 142t36 175q0 93-35 174t-96 142t-142 96t-175 36q-93 0-174-35t-142-96t-96-142t-36-175q0-93 35-174t96-142t142-96t175-36m-320 448q0 66 25 124t69 101t102 69t124 26q47 0 92-13t84-40l-443-443q-26 39-39 84t-14 92m587 176q26-39 39-84t14-92q0-66-25-124t-69-101t-102-69t-124-26q-47 0-92 13t-84 40z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
                  )}
                </div>
                <div
                  className="avatar chatavatar"
                  onClick={handleProfile}
                  val={ele._id}
                  ifprof="yes"
                  style={{
                    backgroundImage:
                      'url("' +
                      (ele.groupName
                        ? ele.avatar
                        : ele.users[0]._id === id
                          ? ele.users[1].avatar
                          : ele.users[0].avatar) +
                      '")',
                  }}
                ></div>
                <div className="chatinfo">
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
                  {ele.messages.length > 0 &&
                  []
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
                        .text.substring(0, 13) + "..."
                    : []
                        .concat(ele.messages)
                        .sort((a, b) => {
                          return new Date(b.date - a.date);
                        })
                        .reverse()[0]
                        .text.substring(0, 16)}
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
    </div>
  );
}

export default ChatList;
