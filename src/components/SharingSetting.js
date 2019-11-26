import React from "react";
import Topbar from "../containers/TopbarContainer";
import SharingSettingPage from "../containers/SharingSettingPage/SharingSettingPage";

const SharingSetting = ({ cordata }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <SharingSettingPage />
            </div>  
            );
};

export default SharingSetting;
