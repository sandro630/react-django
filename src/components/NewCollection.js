import React from "react";
import Topbar from "../containers/TopbarContainer";
import NewCollectionPage from "../containers/NewCollectionPage/NewCollectionPage";

const NewCollection = ({ github_auth, goog_auth, collection_id }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <NewCollectionPage />
            </div>
    );
};

export default NewCollection;
