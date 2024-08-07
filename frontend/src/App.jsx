import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import "./App.css";
import Login from "./Login.jsx";
import Messenger from "./Messenger.jsx";
import Signup from "./Signup.jsx";

export const AppContext = createContext({
  chats: [],
  setChats: () => {},
  user: "",
  setUser: () => {},
  token: "",
  setToken: () => {},
  logout: () => {},
});

function App() {
  const [chats, setChats] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     fetch("https://messaging-app-production-6dff.up.railway.app/chats", {
  //       mode: "cors",
  //     })
  //       .then((response) => response.json())
  //       .then((response) => setUsers(response))
  //       .catch((error) => console.error(error));
  //   });
  // }, [chats]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     fetch("https://messaging-app-production-6dff.up.railway.app/", {
  //       mode: "cors",
  //       headers: {
  //         authorization: "Bearer " + (token ? token.toString() : ""),
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((response) => {
  //         if (response.message) {
  //           setUser(response.message);
  //         } else {
  //           setUser(response.result);
  //         }
  //       })
  //       .catch((error) => console.error(error));
  //   });
  // }, [token]);

  return (
    <AppContext.Provider
      value={{
        chats,
        setChats,
        user,
        setUser,
        token,
        setToken,
        logout,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="app" element={<Messenger />} />
          <Route path="sign-up" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
