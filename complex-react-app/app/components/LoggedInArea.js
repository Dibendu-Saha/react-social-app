import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function LoggedInArea(props) {
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);

    function logOut() {
        appDispatch({ type: "logout" })
    }

    function showSearchPanel(e) {
        e.preventDefault();
        appDispatch({ type: "openSearch" });
    }

    return (
        <div className="flex-row my-3 my-md-0">
            <a href="#" onClick={showSearchPanel} className="text-white mr-2 header-search-icon">
                <i className="fas fa-search"></i>
            </a>
            <span className="mr-2 header-chat-icon text-white">
                <i className="fas fa-comment"></i>
                <span className="chat-count-badge text-white"> </span>
            </span>
            <Link to={`/profile/${appState.user.username}`} className="mr-2">
                <img className="small-header-avatar" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" />
            </Link>
            <Link className="btn btn-sm btn-success mr-2" to="/create-post">
                Create Post
            </Link>
            <button className="btn btn-sm btn-secondary" onClick={logOut}>
                Sign Out
            </button>
        </div>
    )
}

export default LoggedInArea