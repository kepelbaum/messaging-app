/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";

function BottomSection({ ele }) {
  const {
    token,
    setMessage,
    activeElement,
    setActiveElement,
    page,
    setPage,
    dummyChat,
    setDummyChat,
    message,
  } = useContext(MainContext);

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
    }
  }
  function handleChange(e) {
    setMessage(e.target.value);
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

  function handleImg() {
    document.getElementById("image").click();
  }
  return (
    <div className="bottomsection" key={ele ? ele._id : "key"}>
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
          onClick={ele ? handleSubmit : handleDummySubmit}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

export default BottomSection;
