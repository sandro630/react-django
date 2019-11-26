import React from "react";
import { withRouter } from "react-router-dom";
import EditableColCard from '../../components/CustomComponents/EditableColCard';
import Modal from "../CustomComponents/Modal";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import gapi from 'gapi-client';
import GooglePicker from 'react-google-picker';


import "../../css/collectionDetail.css";
import "../../css/docCard.css";
import "../../css/navigation.css";

// const url = "http://localhost:3000";
// const CLIENT_ID = "955570269964-oh0iqqd210p35g3ms21qni9pdocess6v.apps.googleusercontent.com";
// const DEVELOPER_KEY = "AIzaSyC8SoCeWcw7vGXrqHUqWODn0gYKxQsnPE0";

const url = process.env.REACT_APP_COPYLINK_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const DEVELOPER_KEY = process.env.REACT_APP_DEVELOPER_KEY;
const SCOPE = ['https://www.googleapis.com/auth/drive'];

class NewCollectionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false, //select type of material dialog show
            picked_file: null,
            showShareModal: false,
            showQuickViewModal: false,
            showNewDocModal: false,
            changeInput: false,
            collection_title: "",
            collection_description: "",
            doc_id: 0,
            email: "",
            copied: false,
            info: {},
            isWebResource: false,
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

    componentWillMount() {
        gapi.load('client:auth2', this.initClient);
    }

    initClient() {
        gapi.client.init({
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
          clientId: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.file'
        }).then(function () {
          // do stuff with loaded APIs
          console.log('it worked');
        });
    }
    addWebResource() {
        if (this.props.collectiondata.collection_id !== ""){
            this.setState({"isWebResource": true});
            this.showModal();
        } else {
            alert("Save collection title and description first.");
        }
    }
    selectAssessment() {
        localStorage.setItem("DocType", "Assessment");
        if (this.state.isWebResource) {
            window.location = "/upload-web-resource?col=" + this.props.collectiondata.collection_id;
        } else {
            window.location = "/upload?col="+ this.props.collectiondata.collection_id;
        }
    }
    selectPlan() {
        localStorage.setItem("DocType", "Plan");
        if (this.state.isWebResource) {
            window.location = "/upload-web-resource?col=" + this.props.collectiondata.collection_id;
        } else {
            window.location = "/upload?col="+ this.props.collectiondata.collection_id;
        }
    }
    selectResource() {
        localStorage.setItem("DocType", "Resource");
        if (this.state.isWebResource) {
            window.location = "/upload-web-resource?col=" + this.props.collectiondata.collection_id;
        } else {
            window.location = "/upload?col="+ this.props.collectiondata.collection_id;
        }
    }
    pickerCallback(data) {
        if (data.action === "picked") {
            var file = data.docs[0];
            localStorage.setItem("file", JSON.stringify(file));
            localStorage.setItem("collection_id", this.props.collectiondata.collection_id);
            console.log(file);
            console.log(localStorage);
            this.setState({ show: true });
            var accessToken = gapi.auth.getToken().access_token;
            this.props.getThumbnailLink(file.id, accessToken);
        }
    }
    
    hideModal = () => {
        this.setState({ show: false });
    };

    showModal = () => {
        this.setState({ show: true });
    };

    goBack = () => {
        window.history.back();
    }
    showShareModal = () => {
        this.setState({ showShareModal: true });    
    };
    
    hideShareModal = () => {
        this.setState({ showShareModal: false });
    };

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
    };
    
    hideQuickViewModal = () => {
        this.setState({ showQuickViewModal: false });
    };

    showNewDocModal = () => {
        this.setState({ showNewDocModal: true });
    };

    hideNewDocModal = () => {
        this.setState({ showNewDocModal: false });
    };

    changeInput = () => {
        this.setState({"changeInput": true});
    }

    changeTitle = (evt) => {
        this.setState({"collection_title": evt.target.value});
    }

    changeDescription = (evt) => {
        this.setState({"collection_description": evt.target.value});
    }
    
    changeColTitle = () => {
        if (this.state.collection_title !== "") {
            this.props.createCollection(
                this.state.collection_title, 
                this.state.collection_description,
                this.props.collectiondata.uuid,
                localStorage.getItem("GmailID")
            );
        }
        this.setState({changeInput: false});
    }

    view() {
        window.open(this.state.info.Url, "_blank");
    }

    getEmail(evt) {
        this.setState({"email": evt.target.value});
    }

    shareCollection() {
        if (this.state.email !== "") {
            this.props.shareCollection(this.state.email, this.props.collectiondata.collection_id);
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row mb-5">
                    <div className="col">
                        <button className="btn" onClick={this.goBack}><span className="fa fa-arrow-left"></span><br />Go Back</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <EditableColCard mouseHover={this.mouseHover} mouseOut={this.MouseOut} isEmpty={true}/>
                    </div>
                    
                    <div className="col-md-8">
                        {!this.state.changeInput && <div onClick={this.changeInput}>
                            <h5 className="col-title">{this.state.collection_title === "" && "Enter a Collection Name"}
                            {this.state.collection_title !== "" && this.state.collection_title}</h5>
                            <p className={this.state.collection_description === "" ? "" : "col-title"}>
                            {this.state.collection_description === "" && "Enter an Optional collection description"}
                            {this.state.collection_description !== "" && this.state.collection_description}</p>
                        </div>}
                        { this.state.changeInput && <div style={{width: "60%"}}>
                            <input type="text"  
                                onChange={this.changeTitle} style={{marginBottom: "20px"}} placeholder="Enter a Collection Name"
                                defaultValue={this.state.collection_title}></input>
                            <input type="text" 
                                onChange={this.changeDescription} style={{marginBottom: "20px"}} placeholder="Enter an Optional collection description"
                                defaultValue={this.state.collection_description}></input>
                            <button className="btn float-right" onClick={this.changeColTitle}>Save</button>
                        </div>}
                        <div className="btn-container">
                            { this.props.collectiondata.uuid !== "" && 
                                <button className="btn-reversed mt-4" id="backBtn" onClick={this.showShareModal}>Share</button>
                            }
                        </div>
                    </div>
                </div>
                <div className="row mt-4"></div>
                <div className="row mt-4"></div>
                
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
                                if (this.props.collectiondata.collection_id !== ""){
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
                <Modal show={this.state.showShareModal} handleClose={this.hideShareModal}>
                    <div className="row">
                        <div className="col-md-11 text-center">
                            <h3>Share your collections</h3>
                        </div>
                    </div>
    
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <p>Why reinvent the wheel? Share the best resources with your peers!</p>
                        </div>
                    </div>
    
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <input type="email" placeholder="Email" value={this.state.email} onChange={this.getEmail}/>
                            <button className="btn" onClick={this.shareCollection}>
                                Share
                            </button>
                        </div>
                    </div>
    
                    <div className="row mt-3">
                        <div className="col-md-12 text-center">
                            <p>or</p>
                        </div>
                    </div>
    
                    <div className="row">
                        <div className="col-md-12 text-center">
                        <CopyToClipboard text={`${url}/${this.props.collectiondata.uuid}`}
                            onCopy={() => this.setState({copied: true})}>
                            <button className="btn" >
                                <img src="/static/images/Chain-Link.png" />
                                        <br />Copy Link
                            </button>
                        </CopyToClipboard>
                        <p>app.coteacher.com/{this.props.collectiondata.uuid}</p>
                        </div>
                    </div>
                </Modal>
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <div className="mt-4"></div>
                    <h5 className="text-center">What is this document?</h5>
                    <div className="text-center">
                        <button className="btn inline-btn" onClick={this.selectAssessment}>An Assessment</button>
                        <button className="btn inline-btn" onClick={this.selectPlan}>A Plan</button>
                        <button className="btn inline-btn" onClick={this.selectResource}>A Resource</button>
                    </div>
                    <div className="mt-4"></div>
                </Modal>
                    
            </div>
        );
    }  
}

export default withRouter(NewCollectionPage);
