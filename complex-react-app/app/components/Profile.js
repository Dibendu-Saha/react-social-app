import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import Axios from "axios";
import Page from "./Page";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";

function Profile() {
    const { username } = useParams();
    const appState = useContext(StateContext);

    const [state, setState] = useImmer({
        startFollowRequestCount: 0,
        stopFollowRequestCount: 0,
        isFollowRequestOngoing: false,
        profileData: {
            profileUsername: "...",
            profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
            isFollowing: false,
            counts: {
                followerCount: 0,
                followingCount: 0,
                postCount: 0
            }
        }
    });

    useEffect(() => {
        async function getData() {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: appState.user.token });
                setState(draft => {
                    draft.profileData = response.data;
                })

            } catch (ex) {
                alert(`Error: ${ex}`);
            }
        }

        getData();
    }, [username]);


    function followUser() {
        setState(draft => { draft.startFollowRequestCount++ })
    }

    function unfollowUser() {
        setState(draft => { draft.stopFollowRequestCount++ })
    }

    useEffect(() => {
        async function requestFollow() {
            if (state.startFollowRequestCount) {
                setState(draft => { draft.isFollowRequestOngoing = true })
                try {
                    const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token });
                    setState(draft => {
                        draft.profileData.counts.followerCount++;
                        draft.profileData.isFollowing = true;
                        draft.isFollowRequestOngoing = false;
                    })
                } catch (ex) {
                    alert(`Error: ${ex}`);
                }
            }
        }
        requestFollow();
    }, [state.startFollowRequestCount])


    useEffect(() => {
        async function requestUnfollow() {
            if (state.stopFollowRequestCount) {
                setState(draft => { draft.isFollowRequestOngoing = true })
                try {
                    const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token });
                    setState(draft => {
                        draft.profileData.counts.followerCount--;
                        draft.profileData.isFollowing = false;
                        draft.isFollowRequestOngoing = false;
                    })
                } catch (ex) {
                    alert(`Error: ${ex}`);
                }
            }
        }
        requestUnfollow();
    }, [state.stopFollowRequestCount])


    return (
        <Page title="Profile">
            <h2>
                <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
                {appState.loggedIn && state.profileData.profileUsername != appState.user.username && !state.profileData.isFollowing && state.profileData.profileUsername != "..." && (
                    <button
                        onClick={followUser}
                        disabled={state.isFollowRequestOngoing}
                        className="btn btn-primary btn-sm ml-2">
                        Follow
                        <i className="fas fa-user-plus"></i>
                    </button>
                )}
                {appState.loggedIn && state.profileData.profileUsername != appState.user.username && state.profileData.isFollowing && state.profileData.profileUsername != "..." && (
                    <button
                        onClick={unfollowUser}
                        disabled={state.isFollowRequestOngoing}
                        className="btn btn-danger btn-sm ml-2">
                        Unfollow
                        <i className="fas fa-user-times"></i>
                    </button>
                )}
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {state.profileData.counts.postCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {state.profileData.counts.followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {state.profileData.counts.followingCount}
                </a>
            </div>

            <ProfilePosts />
        </Page>
    )
}

export default Profile