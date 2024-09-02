/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";
import Navbar from "./components/Navbar";
import Middlepanel from "./components/Middlepanel.jsx";
import Messagebox from "./components/Messagebox.jsx";
import NewGroup from "./components/NewGroup.jsx";
import ProfileBackground from "./components/profile/ProfileBackground.jsx";
import ProfileAvatar from "./components/profile/ProfileAvatar.jsx";
import ProfileInfo from "./components/profile/ProfileInfo.jsx";
import ProfileButtons from "./components/profile/ProfileButtons.jsx";
import CloseProfile from "./components/profile/CloseProfile.jsx";
import ProfileBioAndPassword from "./components/profile/ProfileBioAndPassword.jsx";
import ProfileUploads from "./components/profile/ProfileUploads.jsx";

export const MainContext = createContext({
  favorites: "",
  setFavorites: () => {},
  users: "",
  chats: "",
  id: "",
  token: "",
  page: "",
  scrollState: "",
  setScrollState: () => {},
  setPage: () => {},
  friends: [],
  errors: "",
  setErrors: () => {},
  setFriends: () => {},
  logoutAndMove: () => {},
  activeElement: "",
  setActiveElement: () => {},
  memberFilter: "",
  setMemberFilter: () => {},
  handleMemberFilter: () => {},
  addMenuToggle: "",
  setAddMenuToggle: () => {},
  groupAddMode: "",
  setGroupAddMode: () => {},
  collapse: "",
  setCollapse: () => {},
  collapseRight: () => {},
  dummyChat: "",
  setDummyChat: () => {},
  message: "",
  setMessage: () => {},
  profile: "",
  setProfile: () => {},
  handleProfile: () => {},
  newGroup: "",
  setNewGroup: () => {},
  bioEdit: "",
  setBioEdit: () => {},
  bioText: "",
  setBioText: () => {},
  passEdit: "",
  setPassEdit: () => {},
  upForDeletion: "",
  setUpForDeletion: () => {},
  select: "",
  setSelect: () => {},
  search: "",
  setSearch: () => {},
  displayName: "",
  setDisplayName: () => {},
  password: "",
  setPassword: () => {},
  confirm: "",
  setConfirm: () => {},
  movePage: () => {},
  greenButton: "",
});

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

  const navigate = useNavigate();

  function handleMemberFilter() {
    setMemberFilter(true);
    setAddMenuToggle(true);
    setGroupAddMode(false);
  }

  const movePage = (url) => {
    navigate(url);
  };

  function logoutAndMove() {
    logout();
    movePage("/");
  }

  function collapseRight() {
    setCollapse("right");
  }

  function handleProfile(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    let ifUserChat = chats.filter((ele) => ele._id === val && !ele.groupName);
    val =
      ifUserChat.length > 0
        ? ifUserChat[0].users[0]._id === id
          ? ifUserChat[0].users[1]._id
          : ifUserChat[0].users[0]._id
        : val;
    setMessage("");
    setActiveElement(null);
    setProfile(val);
    setCollapse("left");
    setBioEdit(false);
    setPassEdit(false);
  }

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

  return (
    (chats && token && user && users && (
      <div className="body">
        <MainContext.Provider
          value={{
            greenButton,
            favorites,
            setFavorites,
            users,
            chats,
            id,
            token,
            page,
            setPage,
            dummyChat,
            setDummyChat,
            friends,
            setFriends,
            errors,
            setErrors,
            message,
            setMessage,
            movePage,
            logoutAndMove,
            activeElement,
            setActiveElement,
            memberFilter,
            setMemberFilter,
            handleMemberFilter,
            addMenuToggle,
            setAddMenuToggle,
            groupAddMode,
            setGroupAddMode,
            collapse,
            setCollapse,
            profile,
            setProfile,
            handleProfile,
            newGroup,
            setNewGroup,
            bioEdit,
            setBioEdit,
            bioText,
            setBioText,
            passEdit,
            setPassEdit,
            upForDeletion,
            setUpForDeletion,
            select,
            setSelect,
            search,
            setSearch,
            displayName,
            setDisplayName,
            password,
            setPassword,
            confirm,
            setConfirm,
            scrollState,
            setScrollState,
            collapseRight,
          }}
        >
          <Navbar />
          <Middlepanel />
          {(profile &&
            chats &&
            Object.keys(chats.filter((ele) => ele._id === profile)).length >
              0 &&
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
                    <ProfileBackground ele={ele} />
                    <div className="profilegroup">
                      <div className="groupedtogether">
                        <ProfileAvatar ele={ele} />
                        <ProfileInfo ele={ele} />
                      </div>
                    </div>
                    <ProfileButtons ele={ele} />
                    <CloseProfile />
                    <ProfileBioAndPassword ele={ele} />
                    <ProfileUploads ele={ele} />
                  </div>
                );
              })) ||
            (profile &&
              users &&
              users
                .filter((ele) => ele[1]._id === profile)
                .map((ele) => {
                  return (
                    <div
                      className={
                        collapse === "right" ? "profile collapse" : "profile"
                      }
                      key={ele[1]._id}
                    >
                      <ProfileBackground ele={ele} />
                      <div className="profilegroup">
                        <div className="groupedtogether">
                          <ProfileAvatar ele={ele} />
                          <ProfileInfo ele={ele} />
                        </div>
                      </div>
                      <ProfileButtons ele={ele} />
                      <CloseProfile />
                      <ProfileBioAndPassword ele={ele} />
                      <ProfileUploads ele={ele} />
                    </div>
                  );
                })) ||
            ((page || dummyChat) && <Messagebox />) ||
            (newGroup && users && <NewGroup />) || (
              <div className="imgcontainer">
                <img src="https://st5.depositphotos.com/46060006/64700/v/450/depositphotos_647007102-stock-illustration-cat-simple-vector-black-image.jpg"></img>
              </div>
            )}
          {profile && (
            <div
              className={
                collapse === "right"
                  ? "profcollright collapse"
                  : "profcollright"
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
        </MainContext.Provider>
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Messenger;
