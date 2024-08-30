/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import { MainContext } from "../../Messenger";

function ProfileUploads({ ele }) {
  const { profile, id, token } = useContext(MainContext);

  function uploadBackground(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    if (val) {
      let group = e.currentTarget.attributes.getNamedItem("group").value;
      const formData = new FormData();
      formData.append("image", e.currentTarget.files[0]);
      if (group === "yes") {
        fetch(
          "https://messaging-app-production-6dff.up.railway.app/chats/background/" +
            val,
          {
            mode: "cors",
            method: "PUT",
            body: formData,
            headers: {
              // "Content-type": "multipart/form_data",
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
      } else if (group === "no") {
        fetch(
          "https://messaging-app-production-6dff.up.railway.app/users/background/",
          {
            mode: "cors",
            method: "PUT",
            body: formData,
            headers: {
              // "Content-type": "multipart/form_data",
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
      }
    }
  }

  function uploadAvatar(e) {
    let val = e.currentTarget.attributes.getNamedItem("val").value;
    if (val) {
      let group = e.currentTarget.attributes.getNamedItem("group").value;
      const formData = new FormData();
      formData.append("image", e.currentTarget.files[0]);
      if (group === "yes") {
        fetch(
          "https://messaging-app-production-6dff.up.railway.app/chats/avatar/" +
            val,
          {
            mode: "cors",
            method: "PUT",
            body: formData,
            headers: {
              // "Content-type": "multipart/form_data",
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
      } else if (group === "no") {
        fetch(
          "https://messaging-app-production-6dff.up.railway.app/users/avatar/",
          {
            mode: "cors",
            method: "PUT",
            body: formData,
            headers: {
              // "Content-type": "multipart/form_data",
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
      }
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        name="background"
        id="background"
        onChange={uploadBackground}
        val={ele.groupName || profile === id ? profile : null}
        group={ele.groupName ? "yes" : "no"}
      ></input>
      <input
        type="file"
        accept="image/*"
        name="avatar"
        id="avatar"
        onChange={uploadAvatar}
        val={ele.groupName || profile === id ? profile : null}
        group={ele.groupName ? "yes" : "no"}
      ></input>
    </div>
  );
}

export default ProfileUploads;
