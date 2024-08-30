/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function ProfileBioAndPassword({ ele }) {
  const {
    token,
    profile,
    displayName,
    passEdit,
    setPassEdit,
    errors,
    setErrors,
    bioText,
    bioEdit,
    setBioEdit,
    setBioText,
    password,
    setPassword,
    confirm,
    setConfirm,
  } = useContext(MainContext);
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

  return (
    <div className="xmargin">
      {!passEdit && <h2>About Me</h2>}
      {errors && <h2>{errors}</h2>}
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
            val={ele.groupName ? "group" : "self"}
            dname={ele.groupName ? ele.groupName : ele[1].displayName}
          >
            Submit
          </button>
        </div>
      ) : !passEdit ? (
        <p>{ele.groupName ? ele.bio : ele[1].bio}</p>
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
  );
}

export default ProfileBioAndPassword;
