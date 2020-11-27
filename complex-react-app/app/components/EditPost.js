import React, { useEffect, useState, useContext, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Page from "./Page";
import Axios from "axios";
import Loader from "./Loader";

function EditPost() {
    const { id } = useParams();
    const [post, setPost] = useState([]);
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);

    let initialData = {
        title: {
            value: "",
            hasError: false,
            errorMessage: ""
        },
        body: {
            value: "",
            hasError: false,
            errorMessage: ""
        },
        isLoading: true,
        isSaving: false,
        isBtnDisabled: false,
        postRequestCount: 0,
        buttonText: "Update"
    };

    function thisReducer(draft, action) {
        switch (action.type) {
            case "fetchedData":
                draft.title.value = action.value.title;
                draft.body.value = action.value.body;
                draft.isLoading = false;
                break;

            case "titleChanged":
                draft.title.value = action.value;
                draft.title.hasError = false;
                draft.title.errorMessage = "";
                break;

            case "bodyChanged":
                draft.body.value = action.value;
                draft.body.value = action.value;
                draft.body.hasError = false;
                break;

            case "validateTitle":
                if (!action.value.trim()) {
                    draft.title.hasError = true;
                    draft.title.errorMessage = "Please enter a title.";
                }
                break;

            case "validateBody":
                if (!action.value.trim()) {
                    draft.body.hasError = true;
                    draft.body.errorMessage = "Please enter the content.";
                }
                break;

            case "updating":
                if (!draft.title.hasError && !draft.body.hasError) {
                    draft.postRequestCount++;
                    draft.isSaving = true;
                    draft.buttonText = "Updating..."
                }
                break;

            case "updateComplete":
                draft.isSaving = false;
                draft.buttonText = "Update"
                appDispatch({ type: "flashMessage", value: "Your post has been updated." });
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(thisReducer, initialData);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}/`);
                setPost(response.data);
                dispatch({ type: "fetchedData", value: response.data });
            }
            catch (ex) {
                console.log(ex);
            }
        }

        fetchPost();
    }, []);

    useEffect(() => {
        async function updatePost() {
            if (state.postRequestCount) {
                try {
                    await Axios.post(`/post/${id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token });
                    dispatch({ type: "updateComplete" });
                }
                catch (ex) {
                    console.log(`Error while posting update: ${ex}`);
                }
            }
        }
        updatePost();

    }, [state.postRequestCount]);

    function updatePost(e) {
        e.preventDefault();
        dispatch({ type: "updating" });
    }


    if (state.isLoading)
        return (
            <Page title="..."><Loader /></Page>
        )

    return (
        <Page title="Edit Post">
            <Link className="small font-weight-bold" to={`/post/${id}`}>&#8678; Back to view</Link>

            <form className="mt-3" onSubmit={updatePost}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    {
                        (state.title.hasError) &&
                        <div className="alert alert-danger small liveValidateMessage">{state.title.errorMessage}</div>
                    }
                    <input autoFocus value={state.title.value} name="title" id="post-title"
                        onBlur={e => { dispatch({ type: "validateTitle", value: e.target.value }) }}
                        onChange={e => dispatch({ type: "titleChanged", value: e.target.value })}
                        className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    {
                        (state.body.hasError) &&
                        <div className="alert alert-danger small liveValidateMessage">{state.body.errorMessage}</div>
                    }
                    <textarea value={state.body.value} name="body" id="post-body"
                        onBlur={e => { dispatch({ type: "validateBody", value: e.target.value }) }}
                        onChange={e => dispatch({ type: "bodyChanged", value: e.target.value })}
                        className="body-content tall-textarea form-control" type="text" ></textarea>
                </div>

                <button className="btn btn-primary" disabled={state.isSaving}>{state.buttonText}</button>
            </form>
        </Page>
    )
}

export default EditPost