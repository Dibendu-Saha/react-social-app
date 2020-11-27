import React, { useEffect, useContext, useState } from "react";
import { useParams, Link, withRouter } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import Page from "./Page";
import Loader from "./Loader";
import NotFound from "./NotFound";

function ViewSinglePost(props) {
    const { id } = useParams();
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState([]);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        async function getPost() {
            try {
                const response = await Axios.get(`/post/${id}`);
                setPost(response.data);
                setIsLoading(false);
            }
            catch (ex) {
                alert(`Error: ${ex}`);
            }
        }
        getPost();
    }, [id])


    if (!post) {
        return <NotFound />
    }

    if (isLoading) {
        return (
            <Page title="..."><Loader /></Page>
        )
    }

    async function deletePost() {
        const confirmMsg = confirm("Are you sure you want to delete this post?");
        if (confirmMsg) {
            try {
                const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } });
                if (response.data) {
                    appDispatch({ type: "flashMessage", value: "Your post was deleted" });
                    props.history.push(`/profile/${appState.user.username}`);
                }
            } catch (ex) {
                alert("There was an error!");
            }
        }
    }

    function isValidUser() {
        if (appState.loggedIn && appState.user.username === post.author.username)
            return true;
        else
            return false;
    }

    const date = new Date(post.createdDate)
    const formattedDate = `${date.getDay() + 1}-${months[date.getMonth()]}-${date.getFullYear()}`

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                {
                    isValidUser() &&
                    <span className="pt-2">
                        <Link to={`/post/${id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-3"><i className="fas fa-edit"></i></Link>
                        <ReactTooltip id="edit" className="custom-tooltip" />
                        <a data-tip="Delete" data-for="delete" onClick={deletePost} className="delete-post-button text-danger"><i className="fas fa-trash"></i></a>
                        <ReactTooltip id="delete" className="custom-tooltip" />
                    </span>
                }
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" />
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {formattedDate}
            </p>

            <div className="body-content">
                <ReactMarkdown source={post.body} />
            </div>
        </Page>
    )
}

export default withRouter(ViewSinglePost)