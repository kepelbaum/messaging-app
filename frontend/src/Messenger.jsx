import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Messenger = ({ delay }) => {
  const { chats, setChats, user, token, setToken, logout } =
    useContext(AppContext);

  return (
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
    <h1>Hello World!</h1>
  );
};

export default Messenger;
