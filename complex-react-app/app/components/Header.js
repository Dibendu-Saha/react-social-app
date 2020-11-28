import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import LoginArea from './LoginArea'
import LoggedInArea from './LoggedInArea'
import StateContext from "../StateContext";

function Header(props) {
	let appState = useContext(StateContext);

	return (
		<header className="header-bar bg-primary mb-3">
			<div className="container d-flex flex-column flex-md-row align-items-center p-3">
				<h4 className="my-0 mr-md-auto font-weight-normal">
					<Link to="/" className="text-white">
						Socialize
          			</Link>
				</h4>
				{appState.loggedIn ? <LoggedInArea /> : <LoginArea />}
			</div>
		</header>
	);
}

export default Header;
