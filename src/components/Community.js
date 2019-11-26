import React from "react";
// import LoadingSpinner from "../utils_materialui/LoadingSpinner";
import Topbar from "../containers/TopbarContainer";
import CommunityPage from "../containers/CommunityPage/CommunityPage";
import  { Redirect } from 'react-router-dom'

const Community = ({ github_auth, goog_auth }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <CommunityPage />
            </div>
            );
};

export default Community;
