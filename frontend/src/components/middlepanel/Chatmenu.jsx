/* eslint-disable react/react-in-jsx-scope */
import SearchAndSelect from "./SearchAndSelect";
import CollapseLeftSvg from "./CollapseLeftSvg";
import AddMenu from "./AddMenu";
import MakeNewGroup from "./MakeNewGroup";
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function Chatmenu() {
  const { addMenuToggle } = useContext(MainContext);

  return (
    <div className="chatmenu">
      <CollapseLeftSvg />
      <div className="chatmenutop">
        <h2>{addMenuToggle ? "Users" : "Chats"}</h2>
        <div className="row">
          <AddMenu />
          <MakeNewGroup />
        </div>
      </div>
      <SearchAndSelect />
    </div>
  );
}
export default Chatmenu;
