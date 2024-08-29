/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function ProfileAvatar({ ele }) {
  const { profile, id } = useContext(MainContext);
  function handleAvatar(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    if (val !== "error") {
      document.getElementById("avatar").click();
    }
  }
  return (
    <div
      className="avatar bigavatar"
      onClick={handleAvatar}
      val={ele.groupName ? profile : profile === id ? id : "error"}
      style={{
        backgroundImage:
          'url("' + (ele.groupName ? ele.avatar : ele[1].avatar) + '")',
      }}
    ></div>
  );
}

export default ProfileAvatar;
