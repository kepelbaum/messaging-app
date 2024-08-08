/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Messenger = ({ delay }) => {
  const { chats, setChats, user, token, setToken, setUser, logout, id } =
    useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      fetch("https://messaging-app-production-6dff.up.railway.app/chats", {
        mode: "cors",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          var result = Object.keys(response).map((key) => [key, response[key]]);
          console.log(result[0][1]);
          setChats(result[0][1]);
        })
        .catch((error) => console.error(error));
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetch("https://messaging-app-production-6dff.up.railway.app/", {
        mode: "cors",
        headers: {
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message) {
            setUser(response.message);
          } else {
            setUser(response.result);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [token]);

  return (
    (chats && (
      <div className="wrapper">
        <h2>{user}</h2>
        {chats.map((ele) => {
          return (
            <h3 key={ele.id}>
              {ele.groupName
                ? ele.groupName
                : ele.users[0] === id
                  ? ele.users[1]
                  : ele.users[0]}
            </h3>
          );
        })}
      </div>
    )) || (
      //     (posts && users && comments && (
      //       <div className="wrapper">
      //         <div className="header">
      //           <h3>Blog API</h3>
      //           <ul>
      //             <Link to={"/"}>
      //               <li>Posts</li>
      //             </Link>
      //             <Link to={"/users"}>
      //               <li>Users</li>
      //             </Link>
      //             {!token && (
      //               <Link to={"/login"}>
      //                 <li>Login</li>
      //               </Link>
      //             )}
      //             {token && (
      //               <Link to={"/"}>
      //                 <li onClick={logout}>Logout</li>
      //               </Link>
      //             )}
      //           </ul>
      //         </div>
      //         <h2>{user}</h2>
      //         <div className="grid">
      //           {posts
      //             .filter((ele) => ele.ifPublished)
      //             .sort(function (a, b) {
      //               return new Date(b.date) - new Date(a.date);
      //             })
      //             .map((ele) => {
      //               return (
      //                 <Link to={"/posts/" + ele._id}>
      //                   <div className="card" key={ele._id}>
      //                     <Link to={"/users/" + ele.user.username}>
      //                       <div className="red">
      //                         <h5>{ele.user.username}</h5>
      //                       </div>
      //                     </Link>
      //                     <h3>
      //                       {ele.title.length > 40
      //                         ? ele.title.substring(0, 39) + "..."
      //                         : ele.title}
      //                     </h3>
      //                     {ele.image_url && (
      //                       <img src={ele.image_url} width="100%" height="200"></img>
      //                     )}
      //                     {!ele.image_url && <div className="filler"></div>}
      //                     <div className="core">
      //                       <p>
      //                         {ele.text.length > 200
      //                           ? ele.text.substring(0, 199) + "..."
      //                           : ele.text}
      //                       </p>
      //                     </div>
      //                   </div>
      //                 </Link>
      //               );
      //             })}
      //         </div>
      //       </div>
      //     )) || <h1>Loading...</h1>
      <h1>Loading...</h1>
    )
  );
};

export default Messenger;
