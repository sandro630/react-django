import React from "react";

import "../../css/docCard.css";
import "../../css/navigation.css";
import "../../css/collections.css";


class DocCard extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            Hover: false,
            errored: false,
        }
        // console.log(this.state);
        this.MouseHover = this.MouseHover.bind(this);
        this.MouseOut = this.MouseOut.bind(this);
        this.view = this.view.bind(this);
        this.showQuickViewModal = this.showQuickViewModal.bind(this);
        this.showNewDocModal = this.showNewDocModal.bind(this);
        
    }

    MouseHover() {
        this.setState({ Hover: true });
    }
    MouseOut() {
        this.setState({ Hover: false });
    }

    showQuickViewModal = () => {
        this.props.quickView(this.props.docID);
    }

    showNewDocModal = () => {
        this.props.showNewDocModal();
    }

    removeDoc = () => {
        this.props.removeDoc(this.props.docID);
    }

    editDoc = () => {
        window.location = "/document/doc-" + this.props.info.pk + "+col-" + this.props.collectionId;
    }

    view() {
        if ( this.props.info.Url.includes("http", 0) ) {
            window.open(this.props.info.Url, "_blank");
        } else {
            window.open("https://" + this.props.info.Url, "_blank");
        }
    }

    imgLoadingError = () => {
        this.setState({"errored": true});
    }

    render() {
        const {info, isNew, newDoc, collectionId, viewOnly } = this.props;
        if (isNew) {
            return (
                <div className="col-md-3 new-doc-card-container">
                    <div className="img-panel-new">
                        <a href="#" onClick={this.showNewDocModal}><span className="fa fa-plus"></span></a>
                    </div>
                    <div className="new-collection">
                        <p className="text-center">Add New Resource</p>
                    </div>
                </div>
            )
        } else {
            return (
                    <div className="col-md-3 grayscale" onMouseOver={this.MouseHover} onMouseOut={this.MouseOut}>
                        <div className="img-panel">
                            <div className="icon-img-div">
                                <img src={info.iconUrl} className="icon-img"/>
                            </div>
                            {viewOnly === false && 
                            <span className={this.state.Hover == true ? "doc-trash-icon" : "display-none"} onClick={this.removeDoc}>
                                <img src="/static/images/delete icon.svg" className="ic-w100"></img>
                            </span>}
                            {viewOnly === false &&
                            <span className={this.state.Hover == true ? "doc-edit-icon" : "display-none"} onClick={this.editDoc}>
                                <img src="/static/images/edit_button.svg" className="ic-w100"></img>
                            </span>
                            }
                            {viewOnly === false &&
                            <span className={this.state.Hover == true ? "doc-preview-icon" : "display-none"} onClick={this.showQuickViewModal}>
                                <img src="/static/images/preview button.svg" className="ic-w100"></img>
                            </span>
                            }
                            <button className={this.state.Hover == true ? "doc-open-icon" : "display-none"} onClick={this.view}>
                                Open
                            </button>
                            { info.FileType === "Website" && <img src={info.thumbnail} width="100%" height="100%" onError={this.imgLoadingError} className={this.state.errored === false ? "" : "display-none"}/>}
                            { !(info.FileType === "Website") && 
                                <img src={`https://drive.google.com/thumbnail?authuser=0&sz=w320&id=${ info.DocID }`} width="100%" height="100%" alt="No image for this doc"/> 
                            }
                        </div>
                        <div className="new-collection">
                            <p className="text-center">{info.Title}</p>
                        </div>
                        
                    </div>
            )
        }
    }
};

export default DocCard;