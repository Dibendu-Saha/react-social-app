import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <Page title="Not Found">
            <div className="text-center">
                <h1 className="font-weight-bold">Oops! This page might be broken.</h1>
                <p className="mt-5 text-muted">Start fresh by visiting the <Link to="/">home</Link> page. </p>
            </div>
        </Page>
    )
}

export default NotFound