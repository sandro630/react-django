import React from "react";


import Topbar from "../containers/TopbarContainer";
import ConfirmationPage from "../containers/ConfirmationPage/ConfirmationPage";

const Confirmation = ({ github_auth, goog_auth }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <ConfirmationPage />
            </div>  
            );
};

export default Confirmation;
