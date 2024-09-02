/* eslint-disable react/react-in-jsx-scope */
import { useContext, useEffect, useRef } from "react";
import { MainContext } from "../../Messenger";

function MessageWrapper({ undelete }) {
  const {
    id,
    token,
    chats,
    setMessage,
    upForDeletion,
    setUpForDeletion,
    activeElement,
    setActiveElement,
    page,
    setPage,
    handleProfile,
    scrollState,
    setScrollState,
    messagesEndRef,
  } = useContext(MainContext);

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

  function areyousure(e) {
    setActiveElement(null);
    setMessage("");
    setUpForDeletion(e.currentTarget.attributes.getNamedItem("val").value);
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

  return (
    <div>
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
                          elem.user._id === id && elem._id === activeElement
                            ? "message right orange"
                            : elem.user._id === id
                              ? "message right"
                              : "message"
                        }
                      >
                        {elem._id === upForDeletion && (
                          <div className="messagedeletediv">
                            <h3>
                              Are you sure you want to delete this message?
                            </h3>{" "}
                            <div className="yesorno">
                              <button className="yes" onClick={handleDelete}>
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
                          <div className={elem.img ? "imgmessage" : "azure"}>
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
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            );
          })}
    </div>
  );
}

export default MessageWrapper;
