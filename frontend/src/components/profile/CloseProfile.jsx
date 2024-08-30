/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";

function CloseProfile() {
  const { setProfile, setBioEdit, setPassEdit } = useContext(MainContext);
  function closeProf() {
    setProfile(null);
    setBioEdit(false);
    setPassEdit(false);
  }
  return (
    <div onClick={closeProf} className="closeprof">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="red"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-x-square"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="9" x2="15" y2="15"></line>
        <line x1="15" y1="9" x2="9" y2="15"></line>
      </svg>
    </div>
  );
}

export default CloseProfile;
