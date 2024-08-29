/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";

function GroupInfo({ ele }) {
  const { bioEdit, id, displayName, setDisplayName, handleMemberFilter } =
    useContext(MainContext);

  function handleDisp(e) {
    let val = e.currentTarget.value;
    setDisplayName(val);
  }

  return (
    <div className="groupinfo">
      {
        <h2 className="nonmobile">
          {!ele.groupName && !bioEdit
            ? ele[1].displayName
            : ele.groupName && !bioEdit
              ? ele.groupName
              : ele.groupName && (
                  <textarea
                    value={displayName}
                    onChange={handleDisp}
                    className="dispchange"
                    val="group"
                    minLength={1}
                    maxLength={50}
                  ></textarea>
                )}
        </h2>
      }
      {!ele.groupName && !bioEdit && (
        <h2 className="mobile">
          {ele[1].displayName.length <= 13
            ? ele[1].displayName
            : ele[1].displayName.substring(0, 9) + "..."}
        </h2>
      )}
      {ele.groupName && (
        <h2 className="mobile">
          {!bioEdit
            ? (ele.groupName
                ? ele.groupName
                : ele.users[0]._id === id
                  ? ele.users[1].displayName
                  : ele.users[0].displayName
              ).length <= 13
              ? ele.groupName
                ? ele.groupName
                : ele.users[0]._id === id
                  ? ele.users[1].displayName
                  : ele.users[0].displayName
              : (ele.groupName
                  ? ele.groupName
                  : ele.users[0]._id === id
                    ? ele.users[1].displayName
                    : ele.users[0].displayName
                ).substring(0, 9) + "..."
            : ""}
          {bioEdit && (
            <textarea
              value={displayName}
              onChange={handleDisp}
              className="dispchange"
              val="group"
              minLength={1}
              maxLength={50}
            ></textarea>
          )}
        </h2>
      )}
      {!ele.groupName && bioEdit && (
        <textarea
          value={displayName}
          className="dispchange"
          onChange={handleDisp}
          val="self"
          minLength={1}
          maxLength={50}
        ></textarea>
      )}
      <h3>{!ele.groupName && "@" + ele[1].username}</h3>
      <h3 className="highlight" onClick={handleMemberFilter}>
        {ele.groupName && ele.users.length > 1
          ? ele.users.length + " members"
          : ele.groupName
            ? ele.users.length + " member"
            : ""}
      </h3>
    </div>
  );
}
export default GroupInfo;
