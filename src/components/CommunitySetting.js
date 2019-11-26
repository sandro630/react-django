import React from "react";
import Topbar from "../containers/TopbarContainer";
import CommunitySettingPage from "../containers/CommunitySettingPage/CommunitySettingPage";

const CommunitySetting = ({ cordata }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <CommunitySettingPage />
            </div>  
            );
};

export default CommunitySetting;
