/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../Messenger";
import Chatmenu from "./middlepanel/Chatmenu";
import ChatList from "./middlepanel/Chatlist";
import UserList from "./middlepanel/Userlist";

function Middlepanel() {
  const { page, dummyChat, profile, newGroup, collapse } =
    useContext(MainContext);

  return (
    <div
      className={
        collapse === "right"
          ? "mid"
          : page || dummyChat || profile || newGroup
            ? "mid collapse"
            : "mid"
      }
    >
      <Chatmenu />
      <div className="overflowdiv">
        <ChatList />
        <UserList />
      </div>
    </div>
  );
}
export default Middlepanel;
