/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";
function ProfileButtons({ ele }) {
  const {
    profile,
    id,
    bioEdit,
    passEdit,
    setPassword,
    setConfirm,
    setPassEdit,
    setErrors,
    setBioEdit,
    setBioText,
    setDisplayName,
  } = useContext(MainContext);
  function togglePass() {
    if (passEdit) {
      setPassword("");
      setConfirm("");
      setPassEdit(false);
      setErrors(null);
    } else {
      setBioEdit(false);
      setBioText("");
      setPassEdit(true);
    }
  }

  function editBio(e) {
    if (bioEdit) {
      setBioEdit(false);
      setBioText("");
    } else {
      let val = e.currentTarget.attributes.getNamedItem("val").value;
      let dname = e.currentTarget.attributes.getNamedItem("dname").value;
      setBioEdit(true);
      setBioText(val);
      setPassword("");
      setConfirm("");
      setDisplayName(dname ? dname : "");
    }
  }
  return (
    <div className="profbuttons">
      {profile === id || ele.groupName ? (
        <button
          className="biobutton"
          onClick={editBio}
          val={ele.groupName ? ele.bio : ele[1].bio}
          dname={ele.groupName ? ele.groupName : ele[1].displayName}
        >
          {bioEdit ? "Cancel" : "Edit Profile"}
        </button>
      ) : (
        ""
      )}
      {profile === id ? (
        <button className="changepass" onClick={togglePass}>
          {passEdit ? "Cancel" : "Change Password"}
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileButtons;

// <div className="profbuttons">
// {profile === id ? (
//   <button
//     className="biobutton"
//     onClick={editBio}
//     dname={ele[1].displayName}
//     val={ele[1].bio ? ele[1].bio : ""}
//   >
//     {bioEdit ? "Cancel" : "Edit Profile"}
//   </button>
// ) : (
//   ""
// )}
// {profile === id ? (
//   <button className="changepass" onClick={togglePass}>
//     {passEdit ? "Cancel" : "Change Password"}
//   </button>
// ) : (
//   ""
// )}
// </div>
