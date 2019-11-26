import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';
import { WithContext as ReactTags } from '../CustomComponents/ReactTags.js/ReactTags';
import SelColCard from '../CustomComponents/SelColCard';
import NewColCard from '../CustomComponents/NewColCard';
import gapi from 'gapi-client';
import Autosuggest from 'react-autosuggest';
import { Dropdown } from 'reactjs-dropdown-component';
import DropdownTooltip  from "../CustomComponents/DropdownTooltip";


import "../../css/upload.css";
import "../../css/navigation.css";


// const CLIENT_ID = "955570269964-oh0iqqd210p35g3ms21qni9pdocess6v.apps.googleusercontent.com";
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

class DocumentDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            r_num: 0,
            web_url: "",
            hide_optional: true,
            changed_text: "Show more",
            selected_subject_triggerword: '',
            subject_triggerword_suggestions: [],
            selected_grade_triggerword: '',
            grade_triggerword_suggestions: [],
            selected_strand: null,
            selected_standard: null,
            selected_methods: null,
            selected_general_tags: [],
            standard_set: '',
            title: "",
            isSelectedStandardNumber: true,
            isSelectedSubjectAndGrade: true,
            subjectForm: {
                invalid: false
            },
            gradeForm: {
                invalid: false
            },
            strandForm: {
                invalid: false
            },
            standardForm: {
                invalid: false
            },
            tagForm: {
                invalid: false
            },
            urlForm: {
                invalid: false
            },
            titleForm: {
                invalid: false
            },
            imageUrlForm: {
                invalid: false
            },
        }
        this.handleClick = this.handleClick.bind(this);
        this.goBack = this.goBack.bind(this);
        this.showOptional = this.showOptional.bind(this);
        this.selectCol = this.selectCol.bind(this);
        this.changeWebUrl = this.changeWebUrl.bind(this);
    }

    componentDidMount() {
        this.props.getDocumentDetail( this.getDocIDFromParam(this.props.match.params.document_id) );
    }

    getDocIDFromParam = (param) => {
        var res = param.split('+');
        return res[0].split('-')[1]
    }

    getColIDFromParam = (param) => {
        var res = param.split('+');
        return res[1].split('-')[1]
    }

    componentWillMount() {
        gapi.load('client:auth2', this.initClient);
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.cordata.document_data.Url !== this.props.cordata.document_data.Url) {
            this.setState({ web_url: nextProps.cordata.document_data.Url });
        } 
        if (nextProps.cordata.document_data.Title !== this.props.cordata.document_data.Title) {
            this.setState({ title: nextProps.cordata.document_data.Title});
        }
        if (nextProps.cordata.document_data.subject_triggerword !== this.props.cordata.document_data.subject_triggerword) {
            this.setState({ selected_subject_triggerword: nextProps.cordata.document_data.subject_triggerword});
        }
        if (nextProps.cordata.document_data.grade_triggerword !== this.props.cordata.document_data.grade_triggerword) {
            this.setState({ selected_grade_triggerword: nextProps.cordata.document_data.grade_triggerword});
        }
        let tags = [];
        if (nextProps.cordata.document_data.General_Tags !== undefined) {
            nextProps.cordata.document_data.General_Tags.map( (item, i) => {
                tags.push({id: item, label: item});
            })
            this.setState( {selected_general_tags: tags} );
        }
        if (nextProps.cordata.strand !== undefined) {
            // this.setState( {selected_strand: null} );
            console.log(nextProps.cordata.strand);
            nextProps.cordata.strand.map( (item, i) => {
                if (item.title === nextProps.cordata.document_data.strand) {
                    this.setState( {selected_strand: item.id} );      
                }
            });
        }
        if (nextProps.cordata.standard !== undefined) {
            this.setState( {selected_standard: null} );
            console.log(nextProps.cordata.standard);
            nextProps.cordata.standard.map( (item, i) => {
                if (item.title === nextProps.cordata.document_data.standard) {
                    this.setState( {selected_standard: item.id} );      
                }
            });
        }
    }

    initClient() {
        gapi.client.init({
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
          clientId: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive'
        }).then(function () {
          // do stuff with loaded APIs
        });
    }

    changeWebUrl(evt) {
        this.setState({"web_url": evt.target.value});
    }

    showOptional() {
        if(!this.state.hide_optional){
            this.setState({hide_optional: !this.state.hide_optional});
            this.setState({changed_text: "Show More"});
        } else {
            this.setState({hide_optional: !this.state.hide_optional});
            this.setState({changed_text: "Show Less"});
        }
    }

    selectCol(col_id) {
        this.setState({selectedCol: col_id});
    }

    /* --------------- for subject autosuggest ----------------------*/
    onSubjectTriggerwordSuggestionsFetchRequested = ({ value }) => {
        
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        // min query length
        var minQueryLength = 1;
        var subject_triggerword_suggestions = inputLength <= minQueryLength - 1 ? [] : this.props.cordata.cordata.subject_triggerword.filter(subject_triggerword =>
            subject_triggerword.label.toLowerCase().slice(0, inputLength) === inputValue
        );
        this.setState({
            subject_triggerword_suggestions
        });
    };

    onSubjectTriggerwordChange = (event, { newValue }) => {
        this.setState({
            selected_subject_triggerword: newValue,
            isSelectedStandardNumber: false,
            selected_strand: null,
            selected_standard: null, 
            standard_set: "", 
        });
        if (newValue !== "") {
            this.setState({subjectForm: {invalid: false}});
        } else {
            this.setState({subjectForm: {invalid: true}});
        }
        if (newValue !== "" && this.state.selected_grade_triggerword !== "") {
            this.setState({
                isSelectedSubjectAndGrade: true,
            });
            this.props.getStrand(newValue, this.state.selected_grade_triggerword);
        } else {
            this.setState({
                isSelectedSubjectAndGrade: false,
            });
        }
    };

    getSubjectTriggerwordSuggestionValue = suggestion => suggestion.label;

    onSubjectTriggerwordSuggestionsClearRequested = () => {
        this.setState({
            subject_triggerword_suggestions: []
        });
    };
    
    renderSubjectTriggerwordSuggestion = suggestion => (
        <div>
          <span>{suggestion.label}</span>
        </div>
    );
    /* --------------- for subject autosuggest ----------------------*/

    /* --------------- for grade autosuggest ----------------------*/
    onGradeTriggerwordSuggestionsFetchRequested = ({ value }) => {
            
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        // min query length
        var minQueryLength = 1;
        var grade_triggerword_suggestions = inputLength <= minQueryLength - 1 ? [] : this.props.cordata.cordata.grade_triggerword.filter(grade_triggerword =>
            grade_triggerword.label.toLowerCase().slice(0, inputLength) === inputValue
        );
        this.setState({
            grade_triggerword_suggestions
        });
    };

    onGradeTriggerwordChange = (event, { newValue }) => {
        this.setState({
            selected_grade_triggerword: newValue,
            isSelectedStandardNumber: false,
            selected_strand: null,
            selected_standard: null, 
            standard_set: "", 
        });
        if (newValue !== "") {
            this.setState({gradeForm: {invalid: false}});
        } else {
            this.setState({gradeForm: {invalid: true}});
        }
        if (newValue !== "" && this.state.selected_subject_triggerword !== "") {
            this.setState({
                isSelectedSubjectAndGrade: true,
            });
            this.props.getStrand(this.state.selected_subject_triggerword, newValue);
        } else {
            this.setState({
                isSelectedSubjectAndGrade: false,
            });
        }
    };

    getGradeTriggerwordSuggestionValue = suggestion => {
        this.props.getStrand( this.state.selected_subject_triggerword, suggestion.label);
        return suggestion.label;
    }

    onGradeTriggerwordSuggestionsClearRequested = () => {
        this.setState({
            grade_triggerword_suggestions: []
        });
    };

    renderGradeTriggerwordSuggestion = suggestion => (
        <div>
        <span>{suggestion.label}</span>
        </div>
    );
    /* --------------- for grade autosuggest ----------------------*/
    resetThenSetStrand = (id, key) => {
        this.setState({selected_strand: id});
        this.setState({strandForm: {invalid: false}});
        this.props.getStandard(this.state.selected_subject_triggerword, this.state.selected_grade_triggerword, id);
    }
    resetThenSetStandard = (id, key) => {
        this.setState({
            isSelectedStandardNumber: true, 
        });
        this.setState( {selected_standard: id} );
        this.setState({standardForm: {invalid: false}});
    }
    /* --------------- start for tags  ----------------------*/
    handleAdditionGeneralTags = (tag) => {
        this.setState(state => ({ selected_general_tags: [...state.selected_general_tags, tag] }));
        this.setState({tagForm: {invalid: false}});
    }
    handleDeleteGeneralTags = (i) => {
        const { selected_general_tags } = this.state;
        this.setState({
            selected_general_tags: selected_general_tags.filter((tag, index) => index !== i),
        });
        if (this.state.selected_general_tags.length === 0) {
            this.setState({tagForm: {invalid: true}});
        }
    }

    /* --------------- IS valid? ----------------------*/

    isExistInLabel = (jsonArray, label) => {
        var isExist = false;
        jsonArray.map( (item, i) => {
            if (item.label === label) {
                isExist = true;
                return 1;
            } else {
                return 0;
            }
        });
        return isExist;
    }

    isFormValid = () => {
        var isValid = true;
        if (this.state.selected_subject_triggerword === "" || !this.isExistInLabel(this.props.cordata.cordata.subject_triggerword, this.state.selected_subject_triggerword) ) {
            this.setState({subjectForm: {invalid: true}});
            isValid = false;
        } 
        
        if (this.state.selected_grade_triggerword === "" || !this.isExistInLabel(this.props.cordata.cordata.grade_triggerword, this.state.selected_grade_triggerword) ) {
            this.setState({gradeForm: {invalid: true}});
            isValid = false;
        }
        console.log(this.state.selected_strand);
        if (this.props.cordata.strand.length > 0 && this.state.selected_strand === null) {
            this.setState({strandForm: {invalid: true}});
            isValid = false;
        }
        console.log(this.state.selected_standard);
        if (this.props.cordata.standard.length > 0 && this.state.selected_standard === null) {
            this.setState({standardForm: {invalid: true}});
            isValid = false;
        }

        if (this.state.selected_general_tags.length === 0) {
            this.setState({tagForm: {invalid: true}});
            isValid = false;
        }

        if (this.props.cordata.document_data.FileType === "Website" && this.state.web_url === "") {
            this.setState({urlForm: {invalid: true}});
            isValid = false;
        }

        if (this.props.cordata.document_data.FileType === "Website" && this.state.title === "") {
            this.setState({titleForm: {invalid: true}});
            isValid = false;
        }

        if (this.props.cordata.document_data.FileType === "Website" && this.props.cordata.web_thumbnail === "") {
            this.setState({imageUrlForm: {invalid: true}});
            isValid = false;
        }

        return isValid
    }
    /* --------------- end for tags  ----------------------*/
    handleClick() {
        if (this.isFormValid()) {
            var iconUrl = "";
            if (this.props.cordata.document_data.FileType === "Website") {
                var iconUrl = (this.state.web_url.includes("youtube.com") || 
                    this.state.web_url.includes("youtu.be") )  ? "https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico" : "/static/images/www-icon.svg";
            }
            var upload_file_info = {
                Title: this.props.cordata.document_data.FileType === "Document" ?
                     this.props.cordata.document_data.Title : this.state.title,
                GmailID: localStorage.getItem("GmailID"),
                DocID: this.props.cordata.document_data.FileType === "Document" ?
                    this.props.cordata.document_data.DocID : this.state.web_url,
                doc_pk: this.getDocIDFromParam(this.props.match.params.document_id),
                col_pk: this.getColIDFromParam(this.props.match.params.document_id),
                // selected_methods: this.state.selected_methods,
                selected_general_tags: this.state.selected_general_tags,
                url: this.props.cordata.document_data.FileType === "Document" ?
                    this.props.cordata.document_data.Url : this.state.web_url,
                standard_pk: this.state.selected_standard,
                selected_subject_triggerword: this.state.selected_subject_triggerword,
                selected_grade_triggerword: this.state.selected_grade_triggerword,
                web_thumbnail: this.props.cordata.document_data.FileType === "Document" ?
                    "" : this.props.cordata.web_thumbnail,
                iconUrl: iconUrl
            }
            this.props.updateFile(upload_file_info);
        } 
    }

    changeColDefaultTitle = (value) => {
        this.setState({"col_default_title": value});
    }

    changeColNewTitle = (value) => {
        this.setState({"col_new_title": value});
    }
    
    goBack() {
        window.history.back();
    }

    changeTitle = (evt) => {
        this.setState({"title": evt.target.value});
    }

    getWebThumbnail = () => {
        if (this.state.web_url === "") {
            this.setState({urlForm: {invalid: true}});
        } else {
            this.props.getWebThumbnail(this.state.web_url);
        }
        
    }
    
    changeScreenshot = () => {
        if (this.state.web_url === "") {
            this.setState({urlForm: {invalid: true}});
        } else {
            this.setState({"r_num": (this.state.r_num + 1)});
            this.props.getOtherThumbnail(this.state.web_url, this.state.r_num);
        }
    }

    clearWebUrl = () => {
        this.setState({"web_url": ""});
        this.setState({urlForm: {invalid: true}});
    }
    
    render() {
        if (this.props.cordata.isFetching) {
            return (
                <div className="spinner-padding">
                    <Spinner size={50} spinnerColor={"#FF671D"} spinnerWidth={2} visible={true} />
                </div>
            )
        } else {
            const { selected_subject_triggerword, subject_triggerword_suggestions } = this.state;
            const inputPropsForSubject = {
                placeholder: 'Type a subject name',
                value: selected_subject_triggerword,
                onChange: this.onSubjectTriggerwordChange
            };
            const { selected_grade_triggerword, grade_triggerword_suggestions } = this.state;
            const inputPropsForGrade = {
                placeholder: 'Type a grade level',
                value: selected_grade_triggerword,
                onChange: this.onGradeTriggerwordChange
            };
            const cards = [];
            if (this.props.cordata.cordata.collections && this.props.cordata.cordata.collections.length) {
                this.props.cordata.cordata.collections.map( (col, i) => {
                    cards.push(
                        <SelColCard CollectionID={col.pk} 
                            Title={col.title}
                            thumbnail={col.thumbnail}
                            SelectedCol={this.state.selectedCol}
                            HandleClick = {this.selectCol}
                            key={i}
                        />
                    )
                });
            }
            // console.log(this.props.cordata.document_data);
            return (
                <div className="container-fluid">
                    { this.props.cordata.document_data.FileType === "Document" && 
                        <div>
                            <p className="lg-p">Upload a file from your Google Drive</p>
                            <p>Tell us about this resource so we can help others find it easily.</p>
                        </div>
                    }
                    { this.props.cordata.document_data.FileType !== "Document" && 
                        <div>
                            <p className="lg-p">Add Resource from the Web to Collection</p>
                        </div>
                    }
                    <div className="input-group row">
                        <div className="col-md-7">
                            { this.props.cordata.document_data.FileType === "Website" &&
                                <div className="mt-4">
                                    <div>
                                        <label className="school text-align-right">
                                            Add a resource link
                                        </label>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-10 no-pd">
                                            <input type="text" value={this.state.web_url} onChange={this.changeWebUrl} placeholder="Paste Resource Link"/>
                                        </div>
                                        <div className="col-md-2 no-pd">
                                            <button className="btn search-btn" onClick={this.getWebThumbnail}><span className="fa fa-arrow-right f-25"></span></button>
                                            <button className="btn search-btn" onClick={this.clearWebUrl}><span className="fa fa-times f-25"></span></button>
                                        </div>
                                    </div>
                                    {this.state.urlForm.invalid && 
                                        <label className="form-message form-error ">
                                            <span className="air-icon-exclamation-circle">&#33;</span>
                                            <span aria-hidden="true"></span> This field is required.
                                        </label>
                                    }
                                    {this.state.imageUrlForm.invalid && 
                                        <label className="form-message form-error ">
                                            <span className="air-icon-exclamation-circle">&#33;</span>
                                            <span aria-hidden="true"></span> Thumnail Image is required. Click -> button.
                                        </label>
                                    }
                                </div>
                            }
                            
                            <div className="mt-4">
                                <label className="school text-align-right">
                                    Subject
                                </label>
                                <Autosuggest
                                    suggestions={subject_triggerword_suggestions}
                                    onSuggestionsFetchRequested={this.onSubjectTriggerwordSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onSubjectTriggerwordSuggestionsClearRequested}
                                    getSuggestionValue={this.getSubjectTriggerwordSuggestionValue}
                                    renderSuggestion={this.renderSubjectTriggerwordSuggestion}
                                    inputProps={inputPropsForSubject}
                                />
                                {this.state.subjectForm.invalid && 
                                    <label className="form-message form-error ">
                                        <span className="air-icon-exclamation-circle">&#33;</span>
                                        <span aria-hidden="true"></span> This field is required.
                                    </label>
                                }
                            </div>
                            <div className="mt-4">
                                <label className="school text-align-right">
                                    Grade
                                </label>
                                <Autosuggest
                                    suggestions={grade_triggerword_suggestions}
                                    onSuggestionsFetchRequested={this.onGradeTriggerwordSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onGradeTriggerwordSuggestionsClearRequested}
                                    getSuggestionValue={this.getGradeTriggerwordSuggestionValue}
                                    renderSuggestion={this.renderGradeTriggerwordSuggestion}
                                    inputProps={inputPropsForGrade}
                                />
                                {this.state.gradeForm.invalid && 
                                    <label className="form-message form-error ">
                                        <span className="air-icon-exclamation-circle">&#33;</span>
                                        <span aria-hidden="true"></span> This field is required.
                                    </label>
                                }
                            </div>
                            {this.props.cordata.strand.length > 0 &&
                                <div className="mt-4">
                                    <label className="school text-align-right">
                                        {this.props.cordata.standard_set} Strand
                                    </label>
                                    <Dropdown
                                        title={this.state.selected_strand === null ? "Select Strand" : this.state.selected_strand}
                                        list={this.props.cordata.strand}
                                        resetThenSet={this.resetThenSetStrand}
                                    />
                                    {this.state.strandForm.invalid && 
                                        <label className="form-message form-error ">
                                            <span className="air-icon-exclamation-circle">&#33;</span>
                                            <span aria-hidden="true"></span> This field is required.
                                        </label>
                                    }
                                </div>
                            }
                            {this.props.cordata.standard.length > 0 &&
                                <div className="mt-4">
                                    <label className="school text-align-right">
                                        Standard
                                    </label>
                                    <DropdownTooltip 
                                        title={this.state.selected_standard === null ? "Select Standard" : this.props.cordata.standard.map( (item, i) => {
                                            if (item.id === this.state.selected_standard) {
                                                return item.title;
                                            } else {
                                                return;
                                            }
                                        })}
                                        list={this.props.cordata.standard}
                                        resetThenSet={this.resetThenSetStandard}
                                    />
                                    {this.state.standardForm.invalid && 
                                        <label className="form-message form-error ">
                                            <span className="air-icon-exclamation-circle">&#33;</span>
                                            <span aria-hidden="true"></span> This field is required.
                                        </label>
                                    }
                                </div>
                            }
                            <div className="mt-4">
                                <label className="school text-align-right">
                                    Tags
                                </label>
                                <ReactTags
                                    tags={this.state.selected_general_tags}
                                    suggestions={this.props.cordata.cordata.general_tags}
                                    handleDelete={this.handleDeleteGeneralTags}
                                    handleAddition={this.handleAdditionGeneralTags}
                                    allowDragDrop={false}
                                    labelField={'label'}
                                    placeholder={'Type a tag and press enter'}
                                />
                                {this.state.tagForm.invalid && 
                                    <label className="form-message form-error ">
                                        <span className="air-icon-exclamation-circle">&#33;</span>
                                        <span aria-hidden="true"></span> This field is required.
                                    </label>
                                }
                            </div>
                            
                            <button className="btn mt-4" id="backBtn" onClick={this.goBack}>Back</button>
                            
                            <button className="btn float-right mt-4" id="saveBtn" onClick={this.handleClick}>Save</button>
                    
                        </div>
                        { this.props.cordata.document_data.FileType === "Document" &&
                            <div className="col-md-5">
                                <img src={`https://drive.google.com/thumbnail?authuser=0&sz=w320&id=${ this.props.cordata.document_data.DocID }`} className="thumbnail_image" alt="This doc has no thunmbnail."/>
                                <h6 className="thumbnail_text">{ this.props.cordata.document_data.Title }</h6>
                            </div> 
                        }
                        { this.props.cordata.document_data.FileType === "Website" &&
                            <div className="col-md-5">
                                <div className={this.props.cordata.getting_screenshot === true ? "thumbnail-wrapper b-1" : "thumbnail-wrapper"}>
                                    { this.props.cordata.getting_screenshot && 
                                        <div className="p-l43-t60">
                                            <Spinner size={50} spinnerColor={"#FF671D "} spinnerWidth={5} visible={true} />
                                        </div>
                                    }
                                    { !this.props.cordata.getting_screenshot && 
                                        <img src={this.props.cordata.web_thumbnail} className="web-thumbnail"/>
                                    }
                                    { !this.props.cordata.getting_screenshot && this.props.cordata.web_thumbnail !== "" && 
                                        <p className="text-center">Do you like this image? &nbsp;<a href="#" onClick={this.changeScreenshot}>Change</a></p>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(DocumentDetailPage);
