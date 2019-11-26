import React from "react";
import Topbar from "../containers/TopbarContainer";
import CollectionDetailFromLinkPage from "../containers/CollectionDetailFromLinkPage/CollectionDetailFromLinkPage";


const CollectionDetailFromLink = ({ goog_auth, collection_id }) => {
    return (
            <div className="container-fluid">
                <CollectionDetailFromLinkPage />
            </div>
        );
};

export default CollectionDetailFromLink;
