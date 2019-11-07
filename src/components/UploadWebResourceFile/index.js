import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';
import { WithContext as ReactTags } from '../CustomComponents/ReactTags.js/ReactTags';
import Autosuggest from 'react-autosuggest';
import { Dropdown } from 'reactjs-dropdown-component';
import DropdownTooltip  from "../CustomComponents/DropdownTooltip";



import "../../css/upload.css";
import "../../css/navigation.css";


class UploadWebResourceFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            r_num: 0,
            web_url: "",
            // selectedCol: "default",
            // hide_optional: true,
            // changed_text: "Show more",
            selected_subject_triggerword: '',
            subject_triggerword_suggestions: [],
            selected_grade_triggerword: '',
            grade_triggerword_suggestions: [],
            selected_strand: null,
            selected_standard: null,
            selected_methods: null,
            selected_general_tags: [],
            standard_set: '',
            isSelectedStandardNumber: false,
            isSelectedSubjectAndGrade: false,
            title: "",
            col_default_title: localStorage.getItem("goog_name").split(" ")[0] + "'s First Collection",
            col_new_title: "New Collection",
            image_number: 0,
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
        this.changeWebUrl = this.changeWebUrl.bind(this);
    }

    componentDidMount() {
        this.props.getCorData();
    }

    changeWebUrl(evt) {
        if (evt.target.value === "") {
            this.setState({urlForm: {invalid: true} });
        } else {
            this.setState({urlForm: {invalid: false} });
        }
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

    // selectCol = (col_id) => {
    //     this.setState({selectedCol: col_id});
    // }

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
            selected_general_tags: []
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
            selected_general_tags: []
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
            selected_general_tags: [],
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
        if (this.state.web_url === "") {
            this.setState({urlForm: {invalid: true}});
            isValid = false;
        } 

        if (this.state.title === "") {
            this.setState({titleForm: {invalid: true}});
            isValid = false;
        } 

        if (this.state.selected_subject_triggerword === "" || !this.isExistInLabel(this.props.cordata.cordata.subject_triggerword, this.state.selected_subject_triggerword) ) {
            this.setState({subjectForm: {invalid: true}});
            isValid = false;
        } 
        
        if (this.state.selected_grade_triggerword === "" || !this.isExistInLabel(this.props.cordata.cordata.grade_triggerword, this.state.selected_grade_triggerword) ) {
            this.setState({gradeForm: {invalid: true}});
            isValid = false;
        }

        if (this.props.cordata.strand.length > 0 && this.state.selected_strand === null) {
            this.setState({strandForm: {invalid: true}});
            isValid = false;
        }

        if ((this.props.cordata.standard_set !== "" && this.props.cordata.standard.length > 0) && this.state.selected_standard === null) {
            this.setState({standardForm: {invalid: true}});
            isValid = false;
        }

        if (( ( (this.props.cordata.standard_set !== null && this.props.cordata.strand.length === 0) || this.state.isSelectedStandardNumber) && this.state.isSelectedSubjectAndGrade) && this.state.selected_general_tags.length === 0) {
            this.setState({tagForm: {invalid: true}});
            isValid = false;
        }

        if (this.props.cordata.web_thumbnail === "") {
            this.setState({imageUrlForm: {invalid: true}});
            isValid = false;
        }

        return isValid
    }
    /* --------------- end for tags  ----------------------*/
    handleClick() {
        console.log( this.state.web_url.includes("youtube.com") || this.state.web_url.includes("youtu.be") );
        if (this.isFormValid()) {
            const query = new URLSearchParams(this.props.location.search);
            const colPK = query.get('col');
            var upload_file_info = {
                Title: this.state.title,
                GmailID: localStorage.getItem("GmailID"),
                DocID: this.state.web_url,
                DocType: localStorage.getItem("DocType"),
                // collection_pk: (this.state.selectedCol === "") ? 
                //     colPK : this.state.selectedCol,
                collection_pk: colPK,
                // selected_methods: this.state.selected_methods,
                selected_general_tags: this.state.selected_general_tags,
                ServiceType: "Website",
                iconUrl: this.state.web_url.includes("youtube.com") || this.state.web_url.includes("youtu.be") ? "https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico" : "/static/images/www-icon.svg",
                url: this.state.web_url,
                standard_pk: this.state.selected_standard,
                selected_subject_triggerword: this.state.selected_subject_triggerword,
                selected_grade_triggerword: this.state.selected_grade_triggerword,
                col_default_title: this.state.col_default_title,
                col_new_title: this.state.col_new_title,
                first_name: localStorage.getItem("goog_name").split(" ")[0],
                web_thumbnail: this.props.cordata.web_thumbnail,
            }
            this.props.registerFile(upload_file_info);
        }
    }

    changeColDefaultTitle = (value) => {
        this.setState({"col_default_title": value});
        console.log(value);
    }

    changeColNewTitle = (value) => {
        this.setState({"col_new_title": value});
        console.log(value);
    }

    changeTitle = (evt) => {
        if (evt.target.value === "") {
            this.setState({titleForm: {invalid: true} });
        } else {
            this.setState({titleForm: {invalid: false} });
        }
        this.setState({"title": evt.target.value});
    }

    getWebThumbnail = () => {
        if (this.state.web_url === "") {
            this.setState({urlForm: {invalid: true}});
        } else {
            this.setState({urlForm: {invalid: false}});
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
        this.setState({urlForm: {invalid: true} });
        this.setState({"web_url": ""});
    }

    goBack() {
        window.history.back();
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
            // const cards = [];
            // if (this.props.cordata.cordata.collections && this.props.cordata.cordata.collections.length) {
            //     this.props.cordata.cordata.collections.map( (col, i) => {
            //         cards.push(
            //             <SelColCard CollectionID={col.pk} 
            //                 Title={col.title}
            //                 thumbnail={col.thumbnail}
            //                 SelectedCol={this.state.selectedCol}
            //                 HandleClick = {this.selectCol}
            //                 key={i}
            //             />
            //         )
            //     });
            // }
            // console.log(this.props.cordata.standard);
            return (
                <div className="container-fluid">
                    <p className="lg-p">Add Resource from the Web to Collection</p>
                    <div className="input-group row">
                        <div className="col-md-7">
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
                            <div className="mt-4">
                                <label className="school text-align-right">
                                    Tell us what the resource is about
                                </label>
                                <input type="text" value={this.state.title} onChange={this.changeTitle} placeholder="Resource Description" />
                            </div>
                            {this.state.titleForm.invalid && 
                                <label className="form-message form-error ">
                                    <span className="air-icon-exclamation-circle">&#33;</span>
                                    <span aria-hidden="true"></span> This field is required.
                                </label>
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
                                        title="Select Strand"
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
                            {(this.props.cordata.standard_set !== "" && this.props.cordata.standard.length > 0) &&
                                <div className="mt-4">
                                    <label className="school text-align-right">
                                        Standard
                                    </label>
                                    <DropdownTooltip 
                                        title="Select Standard Number"
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
                            
                            {( ( (this.props.cordata.standard_set !== null && this.props.cordata.strand.length === 0) || this.state.isSelectedStandardNumber) && this.state.isSelectedSubjectAndGrade) && 
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
                                        autofocus={false}
                                    />
                                    {this.state.tagForm.invalid && 
                                        <label className="form-message form-error ">
                                            <span className="air-icon-exclamation-circle">&#33;</span>
                                            <span aria-hidden="true"></span> This field is required.
                                        </label>
                                    }
                                </div>
                            }
                            
                            {/* {(!this.state.hide_optional) &&
                                <div className="mt-4">
                                    <h6>Add this document to a collection:</h6>
                                    <div className="outer-div">
                                        <div className="inner-div">
                                            {cards}
                                            <NewColCard CollectionID={"default"} 
                                                Title={ localStorage.getItem("goog_name").split(" ")[0] + "'s First Collection"}
                                                SelectedCol={this.state.selectedCol}
                                                HandleClick = {this.selectCol}
                                                changeColTitle={this.changeColDefaultTitle}
                                            />
                                            <NewColCard CollectionID={"new"} 
                                                Title={"Add New Collection"}
                                                SelectedCol={this.state.selectedCol}
                                                HandleClick = {this.selectCol}
                                                changeColTitle={this.changeColNewTitle}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="mt-4">
                            <a href="#" onClick={this.showOptional}>{this.state.changed_text}</a><p></p>
                            </div> */}
                            
                            <button className="btn mt-4" id="backBtn" onClick={this.goBack}>Back</button>
                            
                            <button className="btn float-right mt-4" id="saveBtn" onClick={this.handleClick}>Save</button>
                    
                        </div>
                        <div className="col-md-5">
                            <div className={this.props.cordata.getting_screenshot === true ? "thumbnail-wrapper b-1" : "thumbnail-wrapper"}>
                                { this.props.cordata.getting_screenshot && 
                                    <div className="p-l43-t60">
                                        <Spinner size={50} spinnerColor={"#FF671D "} spinnerWidth={5} visible={true} />
                                    </div>
                                }
                                { !this.props.cordata.getting_screenshot && this.props.cordata.web_thumbnail !== "" &&
                                    <img src={this.props.cordata.web_thumbnail}
                                        className="web-thumbnail"/>
                                }
                                { !this.props.cordata.getting_screenshot && this.props.cordata.web_thumbnail !== "" && 
                                   <p className="text-center">Do you like this image? &nbsp;<a href="#" onClick={this.changeScreenshot}>Change</a></p>
                                }
                                 
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }  
}

export default withRouter(UploadWebResourceFile);
    