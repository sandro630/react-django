import React from "react";
import Topbar from "../containers/TopbarContainer";
import CollectionDetailPage from "../containers/CollectionDetailPage/CollectionDetailPage";


const CollectionDetail = ({ github_auth, goog_auth, collection_id }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <CollectionDetailPage />
            </div>
        );
};

export default CollectionDetail;
