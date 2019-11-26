import React from "react";
import Topbar from "../containers/TopbarContainer";
import UploadWebResourceFile from "../containers/UploadWebResourceFile/UploadWebResourceFile";

const UploadWebResource = ({ github_auth, goog_auth }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <UploadWebResourceFile />
            </div>
            );
};

export default UploadWebResource;
