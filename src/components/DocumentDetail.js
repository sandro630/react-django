import React from "react";
import Topbar from "../containers/TopbarContainer";
import DocumentDetailPage from "../containers/DocumentDetailPage/DocumentDetailPage";


const DocumentDetail = ({ github_auth, document_id }) => {
    return (
            <div className="container-fluid">
                <Topbar />
                <DocumentDetailPage />
            </div>
        );
};

export default DocumentDetail;
