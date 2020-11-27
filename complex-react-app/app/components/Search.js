import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function Search() {
    const appDispatch = useContext(DispatchContext);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [state, setState] = useImmer({
        searchTerm: "",
        results: [],
        contentDisplay: "none", // "none", "loading", "results"
        requestCount: 0
    });

    /*
        Delayed n/w request - setTimeout() and clearTimeout() | Explanation
        1. On change of seach text, 'state.searchTerm' will be set.
        2. This will trigger the useEffect() below.
        3. And the code inside 'setTimeout()' will wait for the set millisecond to be executed.
        4. However, if the user presses one more key, the useEffect() will be triggered again.
        5. But before the useEffect code runs again, it has to complete the previous instance, and so it runs the clean-up function.
        6. This effectively cancels the running timer and it is set back to 0 again.
    */
    useEffect(() => {
        let delay = setTimeout(() => {
            setState(draft => { state.searchTerm.trim() ? draft.requestCount++ : 0 });
        }, 700);

        return () => clearTimeout(delay);
    }, [state.searchTerm]);



    useEffect(() => {
        const thisRequest = Axios.CancelToken.source();
        if (state.requestCount) {
            async function getSearchResults() {
                const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: thisRequest.token })
                setState(draft => { draft.results = response.data });
                setState(draft => { draft.contentDisplay = "results" });
            }
            getSearchResults();
        }
        return () => thisRequest.cancel();
    }, [state.requestCount]);



    // Search input Keypress event
    function fetchResults(e) {
        const value = e.target.value;
        setState(draft => { draft.contentDisplay = "loading" });
        if (value.trim()) {
            setState(draft => {
                draft.searchTerm = value;
            });
        }
    }

    return (
        <div className="search-overlay">
            <div className="search-overlay-top shadow-sm">
                <div className="container container--narrow">
                    <label htmlFor="live-search-field" className="search-overlay-icon">
                        <i className="fas fa-search"></i>
                    </label>
                    <input autoFocus onChange={fetchResults} type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
                    <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
                        <i className="fas fa-times-circle"></i>
                    </span>
                </div>
            </div>

            <div className="search-overlay-bottom">
                <div className="container container--narrow py-3">
                    <div className={"circle-loader" + (state.contentDisplay === "loading" ? " circle-loader--visible" : "")}></div>
                    <div className={"live-search-results" + (state.contentDisplay === "results" ? " live-search-results--visible" : "")}>
                        {Boolean(state.results.length) ? (
                            <div className="list-group shadow-sm">
                                <div className="list-group-item active"><strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)</div>
                                {
                                    state.results.map(result => {
                                        const date = new Date(result.createdDate);
                                        const formattedDate = `${date.getDay() + 1}-${months[date.getMonth()]}-${date.getFullYear()}`;

                                        return (
                                            <Link to={`/post/${result._id}`} onClick={() => appDispatch({ type: "closeSearch" })} key={result._id} className="list-group-item list-group-item-action">
                                                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>{result.title}</strong>
                                                <span className="text-muted small"> by {result.author.username} on {formattedDate} </span>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        )
                            : <div className="alert alert-danger text-center shadow-sm">Sorry, we coundn't find anything with that search phrase...</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search