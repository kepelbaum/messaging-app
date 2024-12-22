/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { chats, token, setToken, logout, id, setId } = useContext(AppContext);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (token) {
      setTimeout(movePage("/app", 1000));
    }
  }, [token]);

  function logAsGuest() {
    fetch("https://messaging-app-production-6dff.up.railway.app/guest", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result) {
          setErrors(response.result);
        } else {
          setToken(response.token);
          setId(response.id);
          localStorage.setItem("token", response.token);
          localStorage.setItem("id", response.id);
          movePage("/app");
        }
      })
      .catch((error) => console.error(error));
  }

  function handleUser(e) {
    setName(e.target.value);
  }

  function handlePass(e) {
    setPass(e.target.value);
  }

  function movePage(url) {
    navigate(url);
  }

  function handleSubmit() {
    fetch("https://messaging-app-production-6dff.up.railway.app/login", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({
        username: name,
        password: pass,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result) {
          setErrors(response.result);
        } else {
          setToken(response.token);
          setId(response.id);
          localStorage.setItem("token", response.token);
          localStorage.setItem("id", response.id);
          movePage("/app");
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    (!token && (
      <div>
        <div className="login">
          <h1>Messaging App</h1>
          <img
            className="cat"
            src="https://st5.depositphotos.com/46060006/64700/v/450/depositphotos_647007102-stock-illustration-cat-simple-vector-black-image.jpg"
          ></img>
          <h2>{errors}</h2>
          <div className="form">
            <label htmlFor="username">Username (lowercase)</label>
            <br></br>
            <input type="text" id="username" onChange={handleUser}></input>
            <br></br>
            <label htmlFor="password">Password</label>
            <br></br>
            <input type="password" id="password" onChange={handlePass}></input>
            <br></br>
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <div className="margin">
            <span>
              Don't have an account? Sign up{" "}
              <span className="visiblelink">
                <Link to={"/sign-up"}>here.</Link>
              </span>
            </span>
            <br></br>
            <span>
              Or use a{" "}
              <span className="styleaslink" onClick={logAsGuest}>
                <Link>guest account.</Link>
              </span>
            </span>
          </div>
        </div>
      </div>
    )) || <h1>You already logged in.</h1>
  );
};

export default Login;
