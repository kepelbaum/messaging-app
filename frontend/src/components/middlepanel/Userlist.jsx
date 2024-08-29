/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";

function UserList() {
  const {
    page,
    setPage,
    id,
    token,
    setDummyChat,
    setMessage,
    setActiveElement,
    profile,
    setProfile,
    handleProfile,
    newGroup,
    setNewGroup,
    addMenuToggle,
    groupAddMode,
    chats,
    users,
    setBioEdit,
    setPassEdit,
    memberFilter,
    setCollapse,
    select,
    search,
  } = useContext(MainContext);

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
          if (response.result === "Change complete") {
            //do nothing
          } else {
            throw new Error(Object.entries(response));
          }
        })
        .catch((error) => console.error(error));
    }
  }

  return (
    <div>
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
                    .filter((chat) =>
                      page ? chat._id === page : profile === chat._id,
                    )[0]
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
  );
}

export default UserList;
