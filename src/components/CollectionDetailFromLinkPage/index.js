import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';
import EditableColCard from '../../components/CustomComponents/EditableColCard';
import DocCard from '../../components/CustomComponents/DocCard';
import Modal from "../CustomComponents/Modal";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import gapi from 'gapi-client';
import GooglePicker from 'react-google-picker';
import GoogleLoginButton from "../../containers/GoogleAuth/GoogleLoginButtonContainer.js";
import MoreInfo from "../../containers/MoreInfo/MoreInfoContainer";
import Topbar from "../../containers/TopbarContainer";

import "../../css/collectionDetail.css";
import "../../css/docCard.css";
import "../../css/navigation.css";


const url = process.env.REACT_APP_COPYLINK_URL;

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const DEVELOPER_KEY = process.env.REACT_APP_DEVELOPER_KEY;
// const CLIENT_ID = "955570269964-oh0iqqd210p35g3ms21qni9pdocess6v.apps.googleusercontent.com";
// const DEVELOPER_KEY = "AIzaSyC8SoCeWcw7vGXrqHUqWODn0gYKxQsnPE0";
const SCOPE = ['https://www.googleapis.com/auth/drive'];

class CollectionDetailFromLinkPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showSignInModal:  !((localStorage.getItem("GmailID") && localStorage.getItem("isRegistered") === "true")),
            show: false, //select type of material dialog show
            picked_file: null,
            showShareModal: false,
            showQuickViewModal: false,
            showNewDocModal: false,
            showEditImageModal: false,
            showRemoveConfirmModal: false,
            changeInput: false,
            collection_title: "",
            collection_description: "",
            doc_id: 0,
            email: "",
            copied: false,
            info: {},
            isWebResource: false,
            remove_doc_id: 0
        }
        this.getEmail = this.getEmail.bind(this);
        this.shareCollection = this.shareCollection.bind(this);
        this.view = this.view.bind(this);

        // for picker
        this.pickerCallback = this.pickerCallback.bind(this);
        this.selectAssessment = this.selectAssessment.bind(this);
        this.selectPlan = this.selectPlan.bind(this);
        this.selectResource = this.selectResource.bind(this);
        this.addWebResource = this.addWebResource.bind(this);
    }

    // componentWillMount() {
    //     gapi.load('client:auth2', this.initClient);
    // }

    // initClient() {
    //     gapi.client.init({
    //       discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    //       clientId: CLIENT_ID,
    //       scope: 'https://www.googleapis.com/auth/drive'
    //     }).then(function () {
    //       // do stuff with loaded APIs
    //       console.log('it worked');
    //     });
    // }

    componentDidMount() {
        if (this.props.match.params.uuid === undefined) {
            this.props.getCollectionDetail(this.props.match.params.collection_id);
        } else {
            this.props.getCollectionDetailFromUUID(this.props.match.params.uuid);
        }
    }
    addWebResource() {
        if (this.props.match.params.collection_id !== ""){
            this.setState({"isWebResource": true});
            this.setState({"showNewDocModal": false});
            this.showModal();
        } else {
            alert("Save collection title and description first.");
        }
    }
    selectAssessment() {
        localStorage.setItem("DocType", "Assessment");
        if (this.state.isWebResource) {
            localStorage.setItem("collection_id", this.props.match.params.collection_id);
            window.location = "/upload-web-resource";
        } else {
            window.location = "/upload";
        }
    }
    selectPlan() {
        localStorage.setItem("DocType", "Plan");
        if (this.state.isWebResource) {
            localStorage.setItem("collection_id", this.props.match.params.collection_id);
            window.location = "/upload-web-resource";
        } else {
            window.location = "/upload";
        }
    }
    selectResource() {
        localStorage.setItem("DocType", "Resource");
        if (this.state.isWebResource) {
            localStorage.setItem("collection_id", this.props.match.params.collection_id);
            window.location = "/upload-web-resource";
        } else {
            window.location = "/upload";
        }
    }
    pickerCallback(data) {
        if (data.action === "picked") {
            var file = data.docs[0];
            localStorage.setItem("file", JSON.stringify(file));
            localStorage.setItem("collection_id", this.props.match.params.collection_id);
            console.log(file);
            console.log(localStorage);
            this.setState({ show: true });
            var accessToken = gapi.auth.getToken().access_token;
            this.props.getThumbnailLink(file.id, accessToken);
        }
    }
    
    hideModal = () => {
        this.setState({ show: false });
    }

    showModal = () => {
        this.setState({ show: true });
    }

    showShareModal = () => {
        this.setState({ showShareModal: true });
    }
    
    hideShareModal = () => {
        this.setState({ showShareModal: false });
    }

    showQuickViewModal = (doc_id) => {
        this.setState({ doc_id });
        this.setState({ showQuickViewModal: true });
        this.props.searchdata.collection_detail.docs.map( (item, i) => {
            if (i === doc_id) {
                this.setState({info: item});
                return 1;
            } else {
                return 0;
            }
        })
    }
    
    hideQuickViewModal = () => {
        this.setState({ showQuickViewModal: false });
    }

    showNewDocModal = () => {
        this.setState({ showNewDocModal: true });
    }

    hideNewDocModal = () => {
        this.setState({ showNewDocModal: false });
    }

    showEditImageModal = () => {
        this.setState({ showEditImageModal: true });
    }

    hideEditImageModal = () => {
        this.setState({ showEditImageModal: false });
    }

    showRemoveConfirmModal = (doc_id) => {
        this.setState({ showRemoveConfirmModal: true });
        this.setState({ remove_doc_id: doc_id });
    }

    hideRemoveConfirmModal = () => {
        this.setState({ showRemoveConfirmModal: false });
    }
    changeInput = () => {
        this.setState({"changeInput": true});
    }

    changeTitle = (evt) => {
        // this.setState({"collection_title": evt.target.value});
        this.props.searchdata.collection_detail.title = evt.target.value;
    }

    changeDescription = (evt) => {
        // this.setState({"collection_description": evt.target.value});
        this.props.searchdata.collection_detail.description = evt.target.value;
    }
    
    changeColTitle = () => {
        if (this.props.searchdata.collection_detail.title !== "" 
            && this.props.searchdata.collection_detail.description !== "") {
            this.props.changeColTitle(
                this.props.searchdata.collection_detail.title, 
                this.props.searchdata.collection_detail.description, 
                this.props.match.params.collection_id
            );
        }
        this.setState({changeInput: false});
    }

    view() {
        if ( this.state.info.Url.includes("http", 0) ) {
            window.open(this.state.info.Url, "_blank");
        } else {
            window.open("https://" + this.state.info.Url, "_blank");
        }
    }

    getEmail(evt) {
        this.setState({"email": evt.target.value});
    }

    shareCollection() {
        if (this.state.email !== "") {
            this.props.shareCollection(this.state.email, this.props.match.params.collection_id);
        }
    }

    removeDoc = () => {
        this.props.searchdata.my_collections.map( (item, i) => {
            if (item.pk === this.state.remove_col_id) {
                this.props.removeCollection(this.state.remove_col_id);
                return 1;
            } else {
                return 0;
            }
        })
        this.props.searchdata.collection_detail.docs.map( (item, i) => {
            if (i === this.state.remove_doc_id) {
                this.props.removeDoc(item.DocID, this.props.match.params.collection_id);
                return 1;
            } else {
                return 0;
            }
        })
    }

    render() {
        // console.log(this.props.searchdata.collection_detail);
        if (this.props.searchdata.isFetching) {
            return (
                <div className="spinner-padding">
                    <Spinner size={50} spinnerColor={"#FF671D"} spinnerWidth={2} visible={true} />
                </div>
            )
        } else if ((localStorage.getItem("GmailID") && localStorage.getItem("isRegistered") === "false")) {
            return (
                <MoreInfo nextPage={this.props.match.url}/>
            );
        } else {
            const query = new URLSearchParams(this.props.location.search);
            var new_doc_id = query.get("new");
            const docs = [];
            this.props.searchdata.collection_detail.docs.map( (item, i) => {
                docs.push(
                    <DocCard 
                        collectionId={this.props.match.params.collection_id}
                        quickView={this.showQuickViewModal}
                        isNew={false}
                        info={item}
                        docID={i}
                        key={i}
                        newDoc={new_doc_id}
                        removeDoc={this.showRemoveConfirmModal}
                    />
                );
                return 1;
            })
            const modal_general_tags = [];
            const modal_standards = [];
            return (
                <div>
                    <Topbar />
                    <div className="container">
                        
                        <div className="row">
                            <div className="col-md-4">
                                <EditableColCard showEditImageModal={this.showEditImageModal} noHoverEffect={true}
                                    thumbnail={this.props.searchdata.collection_detail.thumbnail}/>
                            </div>
                            <div className="col-md-8">
                                {!this.state.changeInput && 
                                    // <div onClick={this.changeInput}>
                                    <div>
                                        <h5 className="col-title">{this.props.searchdata.collection_detail.title}</h5>
                                        <p className={this.props.searchdata.collection_detail.description === "" ? "" : "col-title"}>
                                        {this.props.searchdata.collection_detail.description === "" && "Enter an Optional collection description"}
                                        {this.props.searchdata.collection_detail.description !== "" && this.props.searchdata.collection_detail.description}</p>
                                    </div>
                                }
                                { this.state.changeInput && <div style={{width: "60%"}}>
                                    <input type="text"  
                                        onChange={this.changeTitle} style={{marginBottom: "20px"}} placeholder="Enter a Collection Name"
                                        defaultValue={this.props.searchdata.collection_detail.title} className="search-query"></input>
                                    <input type="text" 
                                        onChange={this.changeDescription} style={{marginBottom: "20px"}} placeholder="Enter an Optional collection description"
                                        defaultValue={this.props.searchdata.collection_detail.description}  className="search-query"></input>
                                    <button className="btn float-right" onClick={this.changeColTitle}>Save</button>
                                </div>}
                                <div className="btn-container">
                                    { this.props.match.params.uuid === undefined && 
                                        <button className="btn-reversed mt-4" id="backBtn" onClick={this.showShareModal}>Share</button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row mt-5">
                            {docs}
                            {/* <DocCard isNew={true} showNewDocModal={this.showNewDocModal}/> */}
                        </div>
                        <Modal show={this.state.showShareModal} handleClose={this.hideShareModal}>
                            <div>
                                <div className="col-md-12 text-center">
                                    <h5 className="mt-5">Share your collections</h5>
                                </div>
                            </div>
            
                            <div>
                                <div className="col-md-12 text-center">
                                    <p >Why reinvent the wheel? Share the best resources with your peers!</p>
                                </div>
                            </div>
            
                            {/* <div className="row">
                                <div className="col-md-1"></div>
                                <div className="col-md-7">
                                    <input type="email" placeholder="Email" value={this.state.email} onChange={this.getEmail} className="search-query w-10"/>
                                </div>
                                <div className="col-md-3">
                                    <button className="btn" onClick={this.shareCollection}>
                                        Share
                                    </button>
                                </div>
                            </div>
            
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <p className="mt-4">or</p>
                                </div>
                            </div> */}
            
                            <div className="row">
                                <div className="col-md-1"></div>
                                <div className="col-md-7">
                                    <p className="sh-p">app.coteacher.com/{this.props.searchdata.collection_detail.uuid}</p>
                                    
                                </div>
                                <div className="col-md-3">
                                    <CopyToClipboard text={`${url}/${this.props.searchdata.collection_detail.uuid}`}
                                        onCopy={() => this.setState({copied: true})}>
                                        <button className="btn-reversed" >
                                            Copy Link
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </Modal>
                        <Modal show={this.state.showQuickViewModal} handleClose={this.hideQuickViewModal}>
                            <div className="row">
                                <div className="col-md-5">
                                    { this.state.info.FileType === "Website" && <img src={this.state.info.thumbnail} className="modal-img"/>}
                                    { !(this.state.info.FileType === "Website") && 
                                        <img src={`https://drive.google.com/thumbnail?authuser=0&sz=w320&id=${ this.state.info.DocID }`} className="modal-img" alt="No image for this doc"/> 
                                    }
                                </div>
                                <div className="col-md-7 info-section">
                                    <div className="header-info">
                                        <h5 style={{wordBreak: "break-word"}}>{this.state.info.Title}</h5>
                                        <p>{this.props.searchdata.collection_detail.role}, {this.props.searchdata.collection_detail.school}</p>
                                        <p>Grade {this.state.info.Grade}, {this.state.info.Subject}</p>
                                    </div>
                                    <div>
                                        <p></p>
                                        <p>File Type: {this.state.info.FileType}</p>
                                        <p>Material Type: {this.state.info.DocType}</p>
                                        <p>Document Tags</p>
                                        { this.state.info.General_Tags !== undefined &&
                                                this.state.info.General_Tags.map( (item, i) => {
                                            modal_general_tags.push(
                                                <span key={i} className="modal-general-tag">{item}</span>
                                            );
                                        })}
                                        <p>{modal_general_tags}</p>

                                        <p>Standards</p>
                                        { this.state.info.Standards !== undefined &&
                                                this.state.info.Standards.map( (item, i) => {
                                            modal_standards.push(
                                                <span key={i} className="modal-st-tag">{item}</span>
                                            );
                                        })}
                                        <p>{modal_standards}</p>

                                        <p>Date Posted: {this.state.info.DateShared}</p>

                                    </div>
                                    <div>
                                        <button className="btn mt-4" onClick={this.view}>Open</button>
                                    </div>
                                </div>
                                
                            </div>
                        </Modal>
                        <Modal show={this.state.showNewDocModal} handleClose={this.hideNewDocModal}>
                            <div className="row text-center mt-4">
                                <div className="col">
                                    <div>
                                        <h5>You haven't saved any resources yet!</h5>
                                        <p>Save your favourite educational resources from all over the<br />
                                            internet and your Drive all in one place. Get started:</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 text-right">
                                    <GooglePicker clientId={CLIENT_ID}
                                        developerKey={DEVELOPER_KEY}
                                        scope={SCOPE}
                                        onChange={data => console.log('on change:', data)}
                                        onAuthFailed={data => console.log('on auth failed:', data)}
                                        multiselect={true}
                                        navHidden={true}
                                        authImmediate={false}
                                        mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
                                        viewId={'DOCS'}
                                        createPicker={ (google, oauthToken) => {
                                            if (this.props.match.params.collection_id !== ""){
                                                const googleViewId = google.picker.ViewId.DOCS;
                                                const docsView = new google.picker.DocsView(googleViewId)
                                                    .setIncludeFolders(true)
                                                    .setMimeTypes('application/vnd.google-apps.docs')
                                                    .setSelectFolderEnabled(false);

                                                const picker = new window.google.picker.PickerBuilder()
                                                    .addView(new google.picker.DocsView().setIncludeFolders(true).setOwnedByMe(true))
                                                    .setOAuthToken(oauthToken)
                                                    .setDeveloperKey(DEVELOPER_KEY)
                                                    .setCallback(this.pickerCallback);

                                                picker.build().setVisible(true);
                                                this.setState({"showNewDocModal": false})
                                            } else {
                                                alert("Save collection title and description first.");
                                            }
                                        }}
                                    >
                                        <button className="btn mt-4">Upload from<br /> Google Drive</button>
                                        <div className="google"></div>
                                    </GooglePicker>
                                </div>
                                <div className="col-md-6">
                                    <button className="btn-reversed mt-4" onClick={this.addWebResource}>Add a Resource<br />from the Web</button>
                                </div>
                            </div>
                            <div className="row mt-4"></div>
                        </Modal>
                        <Modal show={this.state.show} handleClose={this.hideModal}>
                            <div className="mt-5"></div>
                            <h5 className="text-center">What is this document?</h5>
                            <div className="mt-4"></div>
                            <div className="text-center">
                                <button className="btn inline-btn" onClick={this.selectAssessment}> An Assessment</button>
                                <button className="btn inline-btn" onClick={this.selectPlan}>A Plan</button>
                                <button className="btn inline-btn" onClick={this.selectResource}>A Resource</button>
                            </div>
                            <div className="mt-5"></div>
                        </Modal>
                        <Modal show={this.state.showEditImageModal} handleClose={this.hideEditImageModal}>
                            
                        </Modal>
                        <Modal show={this.state.showRemoveConfirmModal} handleClose={this.hideRemoveConfirmModal}>
                            <div className="text-center mt-6">
                                <div className="col">
                                    <div>
                                        <h5>Are you sure you want to remove this resource from coteacher ?</h5>
                                        <p>Your files will remain on your drive</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 text-right">
                                    <button className="btn-reversed mt-4" onClick={this.hideRemoveConfirmModal}>Cancel</button>
                                </div>
                                <div className="col-md-6">
                                    <button className="btn mt-4" onClick={this.removeDoc}>Delete</button>
                                </div>
                            </div>
                            <div className="row mt-4"></div>
                        </Modal>
                        <Modal show={this.state.showSignInModal} handleClose={this.hideRemoveConfirmModal} closeDisplay="none">
                            <div className="col-12 text-center px-0 mt-4">
                                <div className="login-logo mb-3">
                                <img
                                    className="modal-login-logo__image"
                                    src="/static/images/coteacher-logo.jpg"
                                />
                                </div>
                                <p className="login-info-sharing mx-auto mb-4">
                                Get started sharing and collaborating with amazing educators around the world
                                </p>
                                <div className="buttons">
                                    <ul className="navbar-nav ">
                                    <li className="nav-item" key="goog-login-btn">
                                        <GoogleLoginButton nextPage={this.props.match.url} history={this.props.history} />
                                    </li>
                                    </ul>
                                </div>
                                <div className="mt-4"></div>
                            </div>
                        </Modal>
                    </div>
                </div>
                
            );
        }
    }  
}

export default withRouter(CollectionDetailFromLinkPage);
