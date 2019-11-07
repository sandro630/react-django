import React from "react";
// import LoadingSpinner from "../utils_materialui/LoadingSpinner";
import Topbar from "../containers/TopbarContainer";
import UploadFile from "../containers/UploadFile/UploadFile";
import  { Redirect } from 'react-router-dom'

const Upload = ({ github_auth, goog_auth }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <UploadFile />
            </div>
            );
};

export default Upload;
