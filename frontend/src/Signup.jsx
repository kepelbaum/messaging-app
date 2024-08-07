import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Signup = ({}) => {
  const { chats, token, setToken, logout } = useContext(AppContext);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [disp, setDisp] = useState("");
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const movePage = (url) => {
    navigate(url);
  };

  function handleUser(e) {
    setName(e.target.value);
  }

  function handlePass(e) {
    setPass(e.target.value);
  }

  function handleConf(e) {
    setConf(e.target.value);
  }
  function handleDisp(e) {
    setDisp(e.target.value);
  }

  function handleSubmit() {
    fetch("https://messaging-app-production-6dff.up.railway.app/users", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({
        username: name,
        password: pass,
        confirm: conf,
        displayName: disp,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result) {
          setErrors(null);

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
                throw new Error("Cannot log in");
              } else {
                setToken(response.token);
                localStorage.setItem("token", response.token);
                movePage("/app");
              }
            })
            .catch((error) => console.error(error));
        } else {
          setErrors(response);
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    (!token && (
      <div className="wrapper big">
        {/* <div className="header">
          <h3>Blog API</h3>
          <ul>
            <Link to={"/"}>
              <li>Posts</li>
            </Link>
            <Link to={"/users"}>
              <li>Users</li>
            </Link>
            <Link to={"/login"}>
              <li>Login</li>
            </Link>
          </ul>
        </div>*/}
        <div>
          {errors &&
            errors.map((ele) => {
              return <h2>{ele.msg}</h2>;
            })}
          <div className="form">
            <label htmlFor="username">Username (lowercase)</label>
            <input type="text" id="username" onChange={handleUser}></input>
            <label htmlFor="displayname">
              Display Name {" (can be changed later)"}{" "}
            </label>
            <input
              type="password"
              id="displayname"
              onChange={handleDisp}
            ></input>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={handlePass}></input>
            <label htmlFor="confirm">Confirm Password</label>
            <input type="password" id="confirm" onChange={handleConf}></input>
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    )) || <h1>You already logged in.</h1>
  );
};

export default Signup;
