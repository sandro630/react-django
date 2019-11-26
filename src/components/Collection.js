import React from "react";
// import LoadingSpinner from "../utils_materialui/LoadingSpinner";
import Topbar from "../containers/TopbarContainer";
import CollectionPage from "../containers/CollectionPage/CollectionPage";
import  { Redirect } from 'react-router-dom'

const Collection = ({ github_auth, goog_auth }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <CollectionPage />
            </div>
            );
};

export default Collection;
