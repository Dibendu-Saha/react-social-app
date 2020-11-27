import React, { useState, useReducer, useEffect } from "react";
import ReactDom from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import Search from "./components/Search";

function Main() {
    Axios.defaults.baseURL = "http://localhost:8080";

    /* 
       If localStorage has app data, user will be logged in irrespective of they refresh or not. 
       Hence -
       useState(Boolean(localStorage.getItem('appToken')) - This will evaluate to true or false based on the data.
    */
    let initialState = {
        loggedIn: Boolean(localStorage.getItem('appToken')),
        flashMessage: [],
        isSearchOverlay: false,
        user: {
            token: localStorage.getItem("appToken"),
            username: localStorage.getItem("appUsername"),
            avatar: localStorage.getItem("appAvatar")
        }
    }

    /*
       function <name>(a, b)    
       where,
       a - The current state object (in this case - 'initialState' object).
       b - The action object (type, value, data etc.) that is passed to it.
    */
    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true;
                draft.user = action.data;
                return;
            //{ loggedIn: true, flashMessage: state.flashMessage };

            case "logout":
                draft.loggedIn = false;
                return;
            //{ loggedIn: false, flashMessage: state.flashMessage };

            case "flashMessage":
                draft.flashMessage.push(action.value);
                return;
            //{ loggedIn: state.loggedIn, flashMessage: state.flashMessage.concat(action.value) };

            case "openSearch":
                draft.isSearchOverlay = true;
                return;
            case "closeSearch":
                draft.isSearchOverlay = false;
                return;
        }

    }

    /*
       useReducer(fn, b)    
       where,
       fn - the function where we state what should happen on particular actions.
       b - the initial state we want to assign.
    */
    const [state, dispatch] = useImmerReducer(ourReducer, initialState);

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("appToken", state.user.token);
            localStorage.setItem("appUsername", state.user.username);
            localStorage.setItem("appAvatar", state.user.avatar);
        } else {
            localStorage.removeItem("appToken");
            localStorage.removeItem("appUsername");
            localStorage.removeItem("appAvatar");
        }
    }, [state.loggedIn]);

    // document.addEventListener("keypress", function (event) {
    //     if (event.keyCode == 27 || event.which == 27) {
    //         dispatch({ type: "closeSearch" });
    //     }
    // });

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessage} />
                    <Header />
                    <Switch>
                        <Route path="/" exact>
                            {state.loggedIn ? <Home /> : <HomeGuest />}
                        </Route>

                        <Route path="/profile/:username">
                            <Profile />
                        </Route>

                        <Route path="/create-post">
                            <CreatePost />
                        </Route>

                        <Route path="/post/:id" exact>
                            <ViewSinglePost />
                        </Route>

                        <Route path="/post/:id/edit" exact>
                            <EditPost />
                        </Route>

                        <Route path="/about-us">
                            <About />
                        </Route>

                        <Route path="/terms">
                            <Terms />
                        </Route>
                    </Switch>
                    <CSSTransition timeout={330} in={state.isSearchOverlay} classNames="search-overlay" unmountOnExit>
                        <Search />
                    </CSSTransition>
                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

ReactDom.render(<Main />, document.querySelector("#app"));

if (module.hot) {
    module.hot.accept();
}
