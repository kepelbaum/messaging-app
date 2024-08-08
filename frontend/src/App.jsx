/* eslint-disable react/react-in-jsx-scope */
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
  id: "",
  setId: () => {},
  token: "",
  setToken: () => {},
  logout: () => {},
});

function App() {
  const [chats, setChats] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [id, setId] = useState(localStorage.getItem("id"));
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

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
        id,
        setId,
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
