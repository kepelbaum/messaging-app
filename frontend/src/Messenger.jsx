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
  const [profile, setProfile] = useState(null);
  const [bioEdit, setBioEdit] = useState(false);
  const [bioText, setBioText] = useState("");
  const [passEdit, setPassEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [memberFilter, setMemberFilter] = useState(false);
  const [greenButton, setGreenButton] = useState(false);
  const [collapse, setCollapse] = useState("right");

  function doNothing() {}

  const navigate = useNavigate();

  function collapseLeft() {
    setCollapse("left");
  }
  function collapseRight() {
    setCollapse("right");
  }

  function handleMemberFilter() {
    setMemberFilter(true);
    setAddMenuToggle(true);
    setGroupAddMode(false);
  }

  function handleBioText(e) {
    let val = e.currentTarget.value;
    setBioText(val);
  }

  function handleConf(e) {
    let val = e.currentTarget.value;
    setConfirm(val);
  }

  function handlePass(e) {
    let val = e.currentTarget.value;
    setPassword(val);
  }

  function handleDisp(e) {
    let val = e.currentTarget.value;
    setDisplayName(val);
  }

  function passSubmit() {
    let pass = password;
    let conf = confirm;
    if (password.length > 4 && pass === conf) {
      fetch(
        "https://messaging-app-production-6dff.up.railway.app/users/password",
        {
          mode: "cors",
          method: "PUT",
          body: JSON.stringify({
            password: pass,
            confirm: conf,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: "Bearer " + (token ? token.toString() : ""),
          },
        },
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "Settings updated") {
            setPassEdit(false);
            setPassword("");
            setConfirm("");
            setErrors(null);
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    } else if (password.length <= 4 && pass !== conf) {
      setErrors(
        "Password do not match; Password needs to be 5 characters minimum",
      );
    } else if (password.length > 4) {
      setErrors("Password do not match");
    } else {
      setErrors("Password needs to be 5 characters minimum");
    }
  }

  function bioSubmit(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    let dname = e.currentTarget.attributes.getNamedItem("dname").value;
    if (val === "group") {
      fetch(
        "https://messaging-app-production-6dff.up.railway.app/chats/" + profile,
        {
          mode: "cors",
          method: "PUT",
          body: JSON.stringify({
            change: "groupNamebio",
            bio: bioText === "" ? "No description provided" : bioText,
            groupName: displayName === "" ? dname : displayName,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: "Bearer " + (token ? token.toString() : ""),
          },
        },
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.result === "Change complete") {
            setBioEdit(false);
            setBioText("");
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    } else if (val === "self") {
      fetch("https://messaging-app-production-6dff.up.railway.app/users", {
        mode: "cors",
        method: "PUT",
        body: JSON.stringify({
          bio: bioText === "" ? "No description provided" : bioText,
          displayName: displayName === "" ? dname : displayName,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "Settings updated") {
            setBioEdit(false);
            setBioText("");
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
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
  const movePage = (url) => {
    navigate(url);
  };

  function areyousurechat(e) {
    setActiveElement(null);
    setMessage("");
    setUpForDeletion(e.currentTarget.attributes.getNamedItem("val").value);
    setGroupAddMode(false);
  }

  function logoutAndMove() {
    logout();
    movePage("/");
  }

  function togglePass() {
    if (passEdit) {
      setPassword("");
      setConfirm("");
      setPassEdit(false);
      setErrors(null);
    } else {
      setBioEdit(false);
      setBioText("");
      setPassEdit(true);
    }
  }

  function editBio(e) {
    if (bioEdit) {
      setBioEdit(false);
      setBioText("");
    } else {
      let val = e.currentTarget.attributes.getNamedItem("val").value;
      let dname = e.currentTarget.attributes.getNamedItem("dname").value;
      setBioEdit(true);
      setBioText(val);
      setPassword("");
      setConfirm("");
      setDisplayName(dname ? dname : "");
    }
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
  function addMenu() {
    if (addMenuToggle) {
      setAddMenuToggle(false);
      setGroupAddMode(false);
      setMemberFilter(false);
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
      setUpForDeletion(null);
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

  function closeProf() {
    setProfile(null);
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

  function handleProfile(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    // console.log(val);
    // setPage(null);
    setMessage("");
    setActiveElement(null);
    setProfile(val);
    setCollapse("left");
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

  useEffect(() => {
    scrollToBottom();
  }, [page]);

  useEffect(() => {
    if (newGroup) {
      if (newGroup.message !== "" && newGroup.groupName !== "") {
        setGreenButton(true);
      } else {
        setGreenButton(false);
      }
    }
  }, [newGroup]);

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
          // console.log(result[0][1]);

          if (
            result[0][1].toString() === "You are not signed in." ||
            result[0][1].toString() === "Invalid authentication token"
          ) {
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
          // console.log(result);
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
    if (!newGroup) {
      setAddMenuToggle(false);
      setGroupAddMode(false);
    }
    setActiveElement(null);
    setMemberFilter(false);
    setCollapse("right");
  }

  function handleImg() {
    document.getElementById("image").click();
  }

  function handleAvatar(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    // console.log(val);
    if (val) {
      document.getElementById("avatar").click();
    }
  }

  function handleBackground(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    // console.log(val);
    if (val) {
      document.getElementById("background").click();
    }
  }

  function uploadBackground(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    if (val) {
      let group = e.currentTarget.attributes.getNamedItem("group").value;
      const formData = new FormData();
      formData.append("image", e.currentTarget.files[0]);
      if (group === "yes") {
        fetch(
          "https://messaging-app-production-6dff.up.railway.app/chats/background/" +
            val,
          {
            mode: "cors",
            method: "PUT",
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
      } else if (group === "no") {
        fetch(
          "https://messaging-app-production-6dff.up.railway.app/users/background/",
          {
            mode: "cors",
            method: "PUT",
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
      }
    }
  }

  function uploadAvatar(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    if (val) {
      let group = e.currentTarget.attributes.getNamedItem("group").value;
      const formData = new FormData();
      formData.append("image", e.currentTarget.files[0]);
      if (group === "yes") {
        fetch(
          "https://messaging-app-production-6dff.up.railway.app/chats/avatar/" +
            val,
          {
            mode: "cors",
            method: "PUT",
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
      } else if (group === "no") {
        fetch(
          "https://messaging-app-production-6dff.up.railway.app/users/avatar/",
          {
            mode: "cors",
            method: "PUT",
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
      }
    }
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

  function toggleFav() {
    if (!favorites) {
      setFavorites(true);
    }
    setActiveElement(null);
    setMemberFilter(false);
    if (!newGroup) {
      setAddMenuToggle(false);
      setGroupAddMode(false);
      setCollapse("right");
    }
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

    // console.log(await val);
  }

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
      setCollapse("left");
      let findChat = chats.filter(
        (ele) =>
          !ele.groupName &&
          (ele.users[0]._id === val || ele.users[1]._id === val),
      );
      setActiveElement(null);
      setProfile(null);
      if (findChat.length === 1) {
        setDummyChat(null);
        setPage(findChat[0]._id);
      } else {
        setMessage("");
        setPage(null);
        setBioEdit(false);
        setPassEdit(false);
        setDummyChat(val);
      }
    } else if (newGroup) {
      if (e.currentTarget.textContent === "Add") {
        e.currentTarget.textContent = "Remove";
        e.currentTarget.classList.add("red");
        let newUsers = newGroup.users.concat(val);
        setNewGroup({ ...newGroup, users: newUsers });
        setProfile(null);
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
      setMemberFilter(false);
      // e.currentTarget.classList.add("borderless");
    } else {
      setGroupAddMode(true);
      setAddMenuToggle(true);
      setMemberFilter(false);
      setCollapse("right");
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
          <svg
            onClick={logoutAndMove}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          {/* <p>Logged in as:</p>
          <p>{user.substring(9, user.length - 1)}</p> */}
          <svg
            onClick={untoggleFav}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-users"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <svg
            onClick={toggleFav}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
          <div
            className="avatar whiteborder"
            style={{
              backgroundImage:
                'url("' +
                (users.filter((ele) => ele[1]._id === id)[0]
                  ? users.filter((ele) => ele[1]._id === id)[0][1].avatar
                  : "") +
                '")',
            }}
            onClick={handleProfile}
            val={id}
          ></div>
        </div>
        <div
          className={
            collapse === "right"
              ? "mid"
              : page || dummyChat || profile || newGroup
                ? "mid collapse"
                : "mid"
          }
        >
          <div className="chatmenu">
            {(profile || page || newGroup || dummyChat) && (
              <div className="collleft">
                <svg
                  onClick={collapseLeft}
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevrons-right"
                >
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              </div>
            )}
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
                {/* <h2 onClick={makeNewGroup}>{newGroup ? "X" : "NG"}</h2> */}
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
                      <div
                        onClick={handleFav}
                        className="favicon"
                        val={ele._id}
                      >
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
                .filter((ele) =>
                  memberFilter
                    ? Object.keys(
                        chats
                          .filter((chat) => chat._id === page)[0]
                          .users.filter((user) => user._id === ele[1]._id),
                      ).length > 0
                    : true,
                )
                .map((ele) => {
                  return (
                    <div className="wrap" key={ele[1]._id}>
                      <div
                        className="avatar chatavatar"
                        style={{
                          backgroundImage: 'url("' + ele[1].avatar + '")',
                        }}
                        onClick={handleProfile}
                        val={ele[1]._id}
                      ></div>
                      <div className="chatinfo">
                        <h3>
                          {ele[1].displayName.length > 13
                            ? ele[1].displayName.substring(0, 9) + "..."
                            : ele[1].displayName}
                        </h3>
                        {
                          <p>
                            {ele[1].username.length > 12
                              ? "@" + ele[1].username.substring(0, 8) + "..."
                              : "@" + ele[1].username}
                          </p>
                        }
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
        {(profile &&
          chats &&
          !dummyChat &&
          Object.keys(chats.filter((ele) => ele._id === profile)).length > 0 &&
          chats
            .filter((ele) => ele._id === profile)
            .map((ele) => {
              //"background-image: url(" + ele.background + ");"
              return (
                <div
                  className={
                    collapse === "right" ? "profile collapse" : "profile"
                  }
                  key={ele._id}
                >
                  <div
                    className="profilebackground"
                    onClick={handleBackground}
                    val={ele.groupName ? profile : null}
                    style={{
                      backgroundImage:
                        'url("' +
                        (ele.groupName
                          ? ele.background
                          : ele.users[0]._id === id
                            ? ele.users[1].background
                            : ele.users[0].background) +
                        '")',
                    }}
                  ></div>
                  <div className="profilegroup">
                    <div className="groupedtogether">
                      <div
                        className="avatar bigavatar"
                        onClick={handleAvatar}
                        val={ele.groupName ? profile : null}
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
                      <div className="groupinfo">
                        <h2 className="nonmobile">
                          {!bioEdit &&
                            (ele.groupName
                              ? ele.groupName
                              : ele.users[0]._id === id
                                ? ele.users[1].displayName
                                : ele.users[0].displayName)}
                          {bioEdit && (
                            <textarea
                              value={displayName}
                              onChange={handleDisp}
                              className="dispchange"
                              val="group"
                              minLength={1}
                              maxLength={50}
                            ></textarea>
                          )}
                        </h2>
                        <h2 className="mobile">
                          {!bioEdit
                            ? (ele.groupName
                                ? ele.groupName
                                : ele.users[0]._id === id
                                  ? ele.users[1].displayName
                                  : ele.users[0].displayName
                              ).length <= 13
                              ? ele.groupName
                                ? ele.groupName
                                : ele.users[0]._id === id
                                  ? ele.users[1].displayName
                                  : ele.users[0].displayName
                              : (ele.groupName
                                  ? ele.groupName
                                  : ele.users[0]._id === id
                                    ? ele.users[1].displayName
                                    : ele.users[0].displayName
                                ).substring(0, 9) + "..."
                            : ""}
                          {bioEdit && (
                            <textarea
                              value={displayName}
                              onChange={handleDisp}
                              className="dispchange"
                              val="group"
                              minLength={1}
                              maxLength={50}
                            ></textarea>
                          )}
                        </h2>
                        <h3>
                          {ele.groupName
                            ? ""
                            : ele.users[0]._id === id
                              ? "@" + ele.users[1].username
                              : "@" + ele.users[0].username}
                        </h3>
                        <h3 className="highlight" onClick={handleMemberFilter}>
                          {ele.groupName && ele.users.length > 1
                            ? ele.users.length + " members"
                            : ele.groupName
                              ? ele.users.length + " member"
                              : ""}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="profbuttons">
                    {profile === id || ele.groupName ? (
                      <button
                        className="biobutton"
                        onClick={editBio}
                        val={
                          ele.groupName
                            ? ele.bio
                            : ele.users[0]._id === id
                              ? ele.users[1].bio
                              : ele.users[0].bio
                                ? ele.groupName
                                  ? ele.bio
                                  : ele.users[0]._id === id
                                    ? ele.users[1].bio
                                    : ele.users[0].bio
                                : ""
                        }
                        dname={ele.groupName ? ele.groupName : null}
                      >
                        {bioEdit ? "Cancel" : "Edit Profile"}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div onClick={closeProf} className="closeprof">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="red"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-x-square"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                  </div>
                  <div className="xmargin">
                    <h2>About Me</h2>
                    {bioEdit ? (
                      <div className="biodiv">
                        <textarea
                          className="biotext"
                          value={bioText}
                          onChange={handleBioText}
                          maxLength={500}
                        ></textarea>
                        <button
                          type="submit"
                          onClick={bioSubmit}
                          val="group"
                          dname={ele.groupName}
                        >
                          Submit
                        </button>
                      </div>
                    ) : (
                      <p>
                        {ele.groupName
                          ? ele.bio
                          : ele.users[0]._id === id
                            ? ele.users[1].bio
                            : ele.users[0].bio}
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    name="background"
                    id="background"
                    onChange={uploadBackground}
                    val={ele.groupName ? profile : null}
                    group="yes"
                  ></input>
                  <input
                    type="file"
                    accept="image/*"
                    name="avatar"
                    id="avatar"
                    onChange={uploadAvatar}
                    val={ele.groupName ? profile : null}
                    group="yes"
                  ></input>
                </div>
              );
            })) ||
          (profile &&
            users &&
            !dummyChat &&
            users
              .filter((ele) => ele[1]._id === profile)
              .map((ele) => {
                //"background-image: url(" + ele.background + ");"
                return (
                  <div
                    className={
                      collapse === "right" ? "profile collapse" : "profile"
                    }
                    key={ele[1]._id}
                  >
                    <div
                      className="profilebackground"
                      onClick={handleBackground}
                      val={profile === id ? profile : null}
                      style={{
                        backgroundImage: 'url("' + ele[1].background + '")',
                      }}
                    ></div>
                    <div className="profilegroup">
                      <div className="groupedtogether">
                        <div
                          className="avatar bigavatar"
                          onClick={handleAvatar}
                          val={profile === id ? profile : null}
                          style={{
                            backgroundImage: 'url("' + ele[1].avatar + '")',
                          }}
                        ></div>
                        <div className="groupinfo">
                          {!bioEdit && (
                            <h2 className="nonmobile">{ele[1].displayName}</h2>
                          )}
                          {!bioEdit && (
                            <h2 className="mobile">
                              {ele[1].displayName.length <= 13
                                ? ele[1].displayName
                                : ele[1].displayName.substring(0, 9) + "..."}
                            </h2>
                          )}
                          {bioEdit && (
                            <textarea
                              value={displayName}
                              className="dispchange"
                              onChange={handleDisp}
                              val="self"
                              minLength={1}
                              maxLength={50}
                            ></textarea>
                          )}
                          <h3>{"@" + ele[1].username}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="profbuttons">
                      {profile === id ? (
                        <button
                          className="biobutton"
                          onClick={editBio}
                          dname={ele[1].displayName}
                          val={ele[1].bio ? ele[1].bio : ""}
                        >
                          {bioEdit ? "Cancel" : "Edit Profile"}
                        </button>
                      ) : (
                        ""
                      )}
                      {profile === id ? (
                        <button className="changepass" onClick={togglePass}>
                          {passEdit ? "Cancel" : "Change Password"}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div onClick={closeProf} className="closeprof">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="red"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-x-square"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                      </svg>
                    </div>
                    <div className="xmargin">
                      {!passEdit && <h2>About Me</h2>}
                      {errors && <h2>{errors}</h2>}
                      {bioEdit ? (
                        <div className="biodiv">
                          <textarea
                            maxLength={500}
                            className="biotext"
                            value={bioText}
                            onChange={handleBioText}
                          ></textarea>
                          <button
                            type="submit"
                            onClick={bioSubmit}
                            val="self"
                            dname={ele[1].displayName}
                          >
                            Submit
                          </button>
                        </div>
                      ) : !passEdit ? (
                        <p>{ele[1].bio}</p>
                      ) : (
                        <div className="passwordwrapper">
                          <label htmlFor="password">New password:</label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePass}
                            minLength={5}
                            maxLength={50}
                          ></input>
                          <label htmlFor="confirm">Confirm new password:</label>
                          <input
                            type="password"
                            id="confirm"
                            name="confirm"
                            value={confirm}
                            onChange={handleConf}
                            minLength={5}
                            maxLength={50}
                          ></input>
                          <button type="submit" onClick={passSubmit}>
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      name="background"
                      id="background"
                      onChange={uploadBackground}
                      val={profile === id ? profile : null}
                      group="no"
                    ></input>
                    <input
                      type="file"
                      accept="image/*"
                      name="avatar"
                      id="avatar"
                      onChange={uploadAvatar}
                      val={profile === id ? profile : null}
                      group="no"
                    ></input>
                  </div>
                );
              })) ||
          (profile &&
            dummyChat &&
            users &&
            users
              .filter((ele) => ele[1]._id === profile)
              .map((ele) => {
                return (
                  <div
                    className={
                      collapse === "right" ? "profile collapse" : "profile"
                    }
                    key={ele._id}
                  >
                    <div
                      className="profilebackground"
                      onClick={handleBackground}
                      val={profile === id ? profile : null}
                      style={{
                        backgroundImage: 'url("' + ele[1].background + '")',
                      }}
                    ></div>
                    <div className="profilegroup">
                      <div className="groupedtogether">
                        <div
                          className="avatar bigavatar"
                          onClick={handleAvatar}
                          val={profile === id ? profile : null}
                          style={{
                            backgroundImage: 'url("' + ele[1].avatar + '")',
                          }}
                        ></div>
                        <div className="groupinfo">
                          {!bioEdit && (
                            <h2 className="nonmobile">{ele[1].displayName}</h2>
                          )}
                          {!bioEdit && (
                            <h2 className="mobile">
                              {ele[1].displayName.length <= 13
                                ? ele[1].displayName
                                : ele[1].displayName.substring(0, 9) + "..."}
                            </h2>
                          )}
                          {bioEdit && (
                            <textarea
                              className="dispchange"
                              value={displayName}
                              onChange={handleDisp}
                              val="self"
                              minLength={1}
                              maxLength={50}
                            ></textarea>
                          )}
                          <h3>{"@" + ele[1].username}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="profbuttons">
                      {profile === id ? (
                        <button
                          className="biobutton"
                          onClick={editBio}
                          val={ele[1].bio ? ele[1].bio : ""}
                          dname={ele[1].displayName}
                        >
                          {bioEdit ? "Cancel" : "Edit Profile"}
                        </button>
                      ) : (
                        ""
                      )}
                      {profile === id ? (
                        <button className="changepass" onClick={togglePass}>
                          {passEdit ? "Cancel" : "Change Password"}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div onClick={closeProf} className="closeprof">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="red"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-x-square"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                      </svg>
                    </div>
                    <div className="xmargin">
                      {!passEdit && <h2>About Me</h2>}
                      {errors && <h2>{errors}</h2>}
                      {bioEdit ? (
                        <div className="biodiv">
                          <textarea
                            className="biotext"
                            maxLength={500}
                            value={bioText}
                            onChange={handleBioText}
                          ></textarea>
                          <button
                            type="submit"
                            onClick={bioSubmit}
                            val="self"
                            dname={ele[1].displayName}
                          >
                            Submit
                          </button>
                        </div>
                      ) : !passEdit ? (
                        <p>{ele[1].bio}</p>
                      ) : (
                        <div className="passwordwrapper">
                          <label htmlFor="password">New password:</label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePass}
                            minLength={5}
                            maxLength={50}
                          ></input>
                          <label htmlFor="confirm">Confirm new password:</label>
                          <input
                            type="confirm"
                            id="confirm"
                            name="confirm"
                            value={confirm}
                            minLength={5}
                            maxLength={50}
                            onChange={handleConf}
                          ></input>
                          <button type="submit" onClick={passSubmit}>
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      name="background"
                      id="background"
                      onChange={uploadBackground}
                      val={profile === id ? profile : null}
                      group="no"
                    ></input>
                    <input
                      type="file"
                      accept="image/*"
                      name="avatar"
                      id="avatar"
                      onChange={uploadAvatar}
                      val={profile === id ? profile : null}
                      group="no"
                    ></input>
                  </div>
                );
              })) ||
          ((page || dummyChat) && (
            <div
              className={
                collapse === "right" ? "messagebox collapse" : "messagebox"
              }
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
                          ? users.filter(
                              (ele) => dummyChat === ele[1]._id,
                            )[0][1].avatar
                          : !chats.filter((ele) => ele._id === page)[0]
                            ? ""
                            : chats.filter((ele) => ele._id === page)[0]
                                  .groupName
                              ? chats.filter((ele) => ele._id === page)[0]
                                  .avatar
                              : chats.filter((ele) => ele._id === page)[0]
                                    .users[0]._id === id
                                ? chats.filter((ele) => ele._id === page)[0]
                                    .users[1].avatar
                                : chats.filter((ele) => ele._id === page)[0]
                                    .users[0].avatar) +
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
                              onClick={
                                ele.groupName ? handleMemberFilter : doNothing
                              }
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
                                  elem.user._id === id &&
                                  elem._id === activeElement
                                    ? "message right orange"
                                    : elem.user._id === id
                                      ? "message right"
                                      : "message"
                                }
                              >
                                {elem._id === upForDeletion && (
                                  <div className="messagedeletediv">
                                    <h3>
                                      Are you sure you want to delete this
                                      message?
                                    </h3>{" "}
                                    <div className="yesorno">
                                      <button
                                        className="yes"
                                        onClick={handleDelete}
                                      >
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
                                  <div
                                    className={
                                      elem.img ? "imgmessage" : "azure"
                                    }
                                  >
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
                                        <line
                                          x1="18"
                                          y1="6"
                                          x2="6"
                                          y2="18"
                                        ></line>
                                        <line
                                          x1="6"
                                          y1="6"
                                          x2="18"
                                          y2="18"
                                        ></line>
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
              {dummyChat && users && (
                <div className="messagemasterwrapper"></div>
              )}
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
                          <button
                            className="enterbutton"
                            onClick={handleSubmit}
                          >
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
          )) ||
          (newGroup && users && (
            <div
              className={
                collapse === "right" ? "newgroup collapse" : "newgroup"
              }
            >
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
          )) || (
            <div className="imgcontainer">
              <img src="https://st5.depositphotos.com/46060006/64700/v/450/depositphotos_647007102-stock-illustration-cat-simple-vector-black-image.jpg"></img>
            </div>
          )}
        {profile && (
          <div
            className={
              collapse === "right" ? "profcollright collapse" : "profcollright"
            }
          >
            <svg
              onClick={collapseRight}
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="white"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevrons-left"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          </div>
        )}
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Messenger;
