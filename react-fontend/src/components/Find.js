import React from "react";
// import LoadingSpinner from "../utils_materialui/LoadingSpinner";
import Topbar from "../containers/TopbarContainer";
import FindFile from "../containers/FindFile/FindFile";
import  { Redirect } from 'react-router-dom'

const Find = ({ github_auth, goog_auth }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <FindFile />
            </div>  
            );
};

export default Find;
