import React from "react";
import Topbar from "../containers/TopbarContainer";
import EditProfilePage from "../containers/EditProfilePage/EditProfilePage";

const EditProfile = ({ cordata }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <EditProfilePage />
            </div>  
            );
};

export default EditProfile;
