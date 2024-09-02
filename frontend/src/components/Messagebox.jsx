/* eslint-disable react/react-in-jsx-scope */
import { useContext, useEffect, useRef } from "react";
import { MainContext } from "../Messenger";
import ChatInfoTop from "./messagebox/ChatInfoTop";
import MessageWrapper from "./messagebox/Messagewrapper";
import BottomSection from "./messagebox/BottomSection";

function Messagebox() {
  const {
    token,
    collapse,
    page,
    setPage,
    dummyChat,
    setDummyChat,
    chats,
    users,
    setUpForDeletion,
    setAddMenuToggle,
    scrollState,
    setScrollState,
  } = useContext(MainContext);

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

  function undelete() {
    setUpForDeletion(null);
  }

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [page]);

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
      fetch(
        "https://messaging-app-production-6dff.up.railway.app/chats/" +
          dummyChat,
        {
          mode: "cors",
          method: "POST",
          body: formData,
          headers: {
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

  return (
    <div
      className={collapse === "right" ? "messagebox collapse" : "messagebox"}
    >
      <ChatInfoTop undelete={undelete} />
      {page &&
        chats &&
        chats
          .filter((ele) => page === ele._id)
          .map((ele) => {
            return (
              <div className="messagemasterwrapper" key={ele._id}>
                {ele.messages.map((elem, index) => {
                  return (
                    <MessageWrapper
                      undelete={undelete}
                      ele={ele}
                      elem={elem}
                      key={elem._id}
                      index={index}
                    />
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            );
          })}
      {dummyChat && users && <div className="messagemasterwrapper"></div>}
      {dummyChat && users && <BottomSection />}
      {page &&
        chats &&
        chats
          .filter((ele) => page === ele._id)
          .map((ele) => {
            return <BottomSection ele={ele} key={ele._id} />;
          })}
      <input
        type="file"
        accept="image/*"
        name="image"
        id="image"
        onChange={uploadImg}
      ></input>
    </div>
  );
}

export default Messagebox;
