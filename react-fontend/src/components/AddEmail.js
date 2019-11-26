import React from "react";
import Topbar from "../containers/TopbarContainer";
import AddEmailPage from "../containers/AddEmailPage/AddEmailPage";

const AddEmail = ({ cordata }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <AddEmailPage />
            </div>  
            );
};

export default AddEmail;
