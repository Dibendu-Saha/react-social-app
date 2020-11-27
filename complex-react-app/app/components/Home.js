import React, { useEffect, useContext } from "react"
import Page from './Page'
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import StateContext from "../StateContext";
import Axios from "axios";

function Home() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const appState = useContext(StateContext);
    const [state, setState] = useImmer({
        isLoading: true,
        feed: []
    });

    useEffect(() => {
        const thisRequest = Axios.CancelToken.source();

        async function getFeed() {
            try {
                const response = await Axios.post("/getHomeFeed", { token: appState.user.token, cancelToken: thisRequest.token });
                setState(draft => {
                    draft.isLoading = false;
                    draft.feed = response.data;
                })
            }
            catch (ex) {
                console.log(`Error: ${ex}`);
            }
        }
        getFeed();

        // Clean-up
        return () => {
            thisRequest.cancel();
        }
    }, []);

    return (
        <Page title='Home'>
            {state.feed.length > 0 && (
                state.feed.map(result => {
                    const date = new Date(result.createdDate);
                    const formattedDate = `${date.getDay() + 1}-${months[date.getMonth()]}-${date.getFullYear()}`;

                    return (
                        <Link to={`/post/${result._id}`} onClick={() => appDispatch({ type: "closeSearch" })} key={result._id} className="list-group-item list-group-item-action">
                            <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>{result.title}</strong>
                            <span className="text-muted small"> by {result.author.username} on {formattedDate} </span>
                        </Link>
                    )
                })
            )}

            {state.feed.length === 0 && (
                <>
                    <h2 className="text-center">Hello <strong>{appState.user.username}</strong>, your feed is empty.</h2>
                    <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
                </>
            )}

        </Page>
    )
}

export default Home