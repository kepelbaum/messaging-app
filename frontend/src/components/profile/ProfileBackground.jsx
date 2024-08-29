/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function ProfileBackground({ ele }) {
  const { profile, id } = useContext(MainContext);
  function handleBackground(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    if (val !== "error") {
      document.getElementById("background").click();
    }
  }
  return (
    <div
      className="profilebackground"
      onClick={handleBackground}
      val={ele.groupName ? profile : profile === id ? id : "error"}
      style={{
        backgroundImage:
          'url("' + (ele.groupName ? ele.background : ele[1].background) + '")',
      }}
    ></div>
  );
}

export default ProfileBackground;
