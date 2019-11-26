import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';
import { WithContext as ReactTags } from '../CustomComponents/ReactTags.js/ReactTags';
import Autosuggest from 'react-autosuggest';

import "../../css/taginput.css";
import "../../css/information.css";

class MoreInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selected_school: '',
            selected_role: [],
            selected_grades: [],
            selected_subjects: [],
            selected_student_needs: [],
            selected_general_tags: [],
            schoolForm: {
                invalid: false
            },
            roleForm: {
                invalid: false
            },
            subjectForm: {
                invalid: false
            },
            gradeForm: {
                invalid: false
            },
            studentNeedForm: {
                invalid: false
            },
            tagForm: {
                invalid: false
            }
        }
    }

    handleAdditionSubjects = (tag) => {
        this.setState(state => ({ selected_subjects: [...state.selected_subjects, tag] }));
        this.setState({subjectForm: {invalid: false}});
    }
    handleDeleteSubjects = (i) => {
        const { selected_subjects } = this.state;
        this.setState({
            selected_subjects: selected_subjects.filter((tag, index) => index !== i),
        });
        if (this.state.selected_subjects.length === 0) {
            this.setState({subjectForm: {invalid: true}});
        }
    }

    handleAdditionGrades = (tag) => {
        this.setState(state => ({ selected_grades: [...state.selected_grades, tag] }));
        this.setState({gradeForm: {invalid: false}});
    }
    handleDeleteGrades = (i) => {
        const { selected_grades } = this.state;
        this.setState({
            selected_grades: selected_grades.filter((tag, index) => index !== i),
        });
        if (this.state.selected_grades.length === 0) {
            this.setState({gradeForm: {invalid: true}});
        }
    }

    handleAdditionRoles = (tag) => {
        this.setState(state => ({ selected_role: [...state.selected_role, tag] }));
        this.setState({roleForm: {invalid: false}});
    }
    handleDeleteRoles = (i) => {
        const { selected_role } = this.state;
        this.setState({
            selected_role: selected_role.filter((tag, index) => index !== i),
        });
        if (this.state.selected_role.length === 0) {
            this.setState({roleForm: {invalid: true}});
        }
    }

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

    handleAdditionStudentNeeds = (tag) => {
        this.setState(state => ({ selected_student_needs: [...state.selected_student_needs, tag] }));
        this.setState({studentNeedForm: {invalid: false}});
    }
    handleDeleteStudentNeeds = (i) => {
        const { selected_student_needs } = this.state;
        this.setState({
            selected_student_needs: selected_student_needs.filter((tag, index) => index !== i),
        });
        if (this.state.selected_student_needs.length === 0) {
            this.setState({studentNeedForm: {invalid: true}});
        }
    }

    onSuggestionsFetchRequested = ({ value }) => {
        
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        this.props.getSchoolSuggestions(inputLength, inputValue);
    };

    onChange = (event, { newValue }) => {
        this.setState({
            selected_school: newValue
        });
        if (newValue !== "") {
            this.setState({schoolForm: {invalid: false}});
        } else {
            this.setState({schoolForm: {invalid: true}});
        }
    };

    getSuggestionValue = suggestion => suggestion.label + ", " + suggestion.city + ", " + suggestion.state;

    onSuggestionsClearRequested = () => {
        this.setState({
          school_suggestions: []
        });
    };
    
    renderSuggestion = suggestion => (
        <div>
          <span>{suggestion.label}, </span>
          <span className="small-font"> {suggestion.city}, {suggestion.state}</span>
        </div>
    );
    componentDidMount() {
        this.props.getBaseData();
    }

    isExistInSchoolLabel = (jsonArray, label) => {
        var isExist = false;
        var searchText = label.split(", ")[0];
        jsonArray.map( (item, i) => {
            if (item.label === searchText) {
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
        if (this.state.selected_school === "" || !this.isExistInSchoolLabel(this.props.basedata.suggested_schools, this.state.selected_school) ) {
            this.setState({schoolForm: {invalid: true}});
            isValid = false;
        } 
        
        if (this.state.selected_role.length === 0) {
            this.setState({roleForm: {invalid: true}});
            isValid = false;
        }

        if (this.state.selected_subjects.length === 0) {
            this.setState({subjectForm: {invalid: true}});
            isValid = false;
        }

        if (this.state.selected_grades.length === 0) {
            this.setState({gradeForm: {invalid: true}});
            isValid = false;
        }

        if (this.state.selected_student_needs.length === 0) {
            this.setState({studentNeedForm: {invalid: true}});
            isValid = false;
        }

        if (this.state.selected_general_tags.length === 0) {
            this.setState({tagForm: {invalid: true}});
            isValid = false;
        }

        return isValid
    }

    handleClick = () => {
        if ( this.isFormValid() ) {
            console.log(localStorage);
            var google_id = localStorage.getItem("GmailID");
            var goog_name = localStorage.getItem("goog_name");
            var goog_email = localStorage.getItem("goog_email");
            var register_info = {
                googleID: google_id,
                Email: goog_email,
                Firstname: goog_name.split(" ")[0],
                Lastname: goog_name.split(" ")[1],
                selected_school: this.state.selected_school,
                selected_role: this.state.selected_role,
                selected_grades: this.state.selected_grades,
                selected_subjects: this.state.selected_subjects,
                selected_student_needs: this.state.selected_student_needs,
                selected_general_tags: this.state.selected_general_tags,
            }
            
            this.props.register(register_info, this.props.nextPage);
        }
    }
    
    render() {
        if (this.props.basedata.isFetching) {
            return (
                <div className="spinner-padding">
                    <Spinner size={50} spinnerColor={"#FF671D"} spinnerWidth={2} visible={true} />
                </div>
            )
        } else {
            const { selected_school } = this.state;
            const inputProps = {
                placeholder: 'Type your school name',
                value: selected_school,
                onChange: this.onChange
            };
            return (
                <div className="container h-100">
                    <div className="row w-100 mx-auto h-100">
                        <div className="col-12 px-0">
                            <div className="login-logo mb-3 text-center">
                                <img className="login-logo__image1" src="/static/images/coteacher-logo.jpg" />
                                <p>Tell us about how you teach</p>
                            </div>

                            <div className="input-group">
                                <div className="col-md-12">

                                    <div className="mt-2">
                                        <label className="school text-align-right">
                                            School: <span className="fs-20-ml">Can't find your school? Choose </span><span className="fs-20-bold">Global Teaching Community</span>
                                        </label>
                                        <Autosuggest
                                            suggestions={this.props.basedata.suggested_schools}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                            getSuggestionValue={this.getSuggestionValue}
                                            renderSuggestion={this.renderSuggestion}
                                            inputProps={inputProps}
                                        />
                                        {this.state.schoolForm.invalid && 
                                            <label className="form-message form-error ">
                                                <span className="air-icon-exclamation-circle">&#33;</span>
                                                <span aria-hidden="true"></span> This field is required.
                                            </label>
                                        }
                                    </div>
                                    <div className="mt-4">
                                        <label className="role">
                                            Role:
                                        </label>
                                        <ReactTags
                                            tags={this.state.selected_role}
                                            suggestions={this.props.basedata.basedata.roles}
                                            handleDelete={this.handleDeleteRoles}
                                            handleAddition={this.handleAdditionRoles}
                                            allowDragDrop={false}
                                            labelField={'label'}
                                            minQueryLength={1}
                                            placeholder={'Add your Roles'}
                                        />
                                        {this.state.roleForm.invalid && 
                                            <label className="form-message form-error ">
                                                <span className="air-icon-exclamation-circle">&#33;</span>
                                                <span aria-hidden="true"></span> This field is required.
                                            </label>
                                        }
                                    </div>

                                    <div className="mt-4">
                                        <label className="subject">
                                            Subject(s):
                                        </label>
                                        <ReactTags
                                            tags={this.state.selected_subjects}
                                            suggestions={this.props.basedata.basedata.subjects}
                                            handleDelete={this.handleDeleteSubjects}
                                            handleAddition={this.handleAdditionSubjects}
                                            allowDragDrop={false}
                                            labelField={'label'}
                                            minQueryLength={1}
                                            placeholder={'What subject do you teach?'}
                                        />
                                        {this.state.subjectForm.invalid && 
                                            <label className="form-message form-error ">
                                                <span className="air-icon-exclamation-circle">&#33;</span>
                                                <span aria-hidden="true"></span> This field is required.
                                            </label>
                                        }
                                    </div>

                                    <div className="mt-4">
                                        <label className="grade">
                                            Grade(s):
                                        </label>
                                        <ReactTags
                                            tags={this.state.selected_grades}
                                            suggestions={this.props.basedata.basedata.grades}
                                            handleDelete={this.handleDeleteGrades}
                                            handleAddition={this.handleAdditionGrades}
                                            allowNew={false}
                                            allowDragDrop={false}
                                            labelField={'label'}
                                            minQueryLength={1}
                                            placeholder={'What is the instructional level of your students?'}
                                        />
                                        {this.state.gradeForm.invalid && 
                                            <label className="form-message form-error ">
                                                <span className="air-icon-exclamation-circle">&#33;</span>
                                                <span aria-hidden="true"></span> This field is required.
                                            </label>
                                        }
                                    </div>

                                    <div className="mt-4">
                                        <label className="student__needs">
                                            Student Needs:
                                        </label>
                                        <ReactTags
                                            tags={this.state.selected_student_needs}
                                            suggestions={this.props.basedata.basedata.student_needs}
                                            handleDelete={this.handleDeleteStudentNeeds}
                                            handleAddition={this.handleAdditionStudentNeeds}
                                            allowDragDrop={false}
                                            labelField={'label'}
                                            placeholder={'Describe your student population and their needs'}
                                        />
                                        {this.state.studentNeedForm.invalid && 
                                            <label className="form-message form-error ">
                                                <span className="air-icon-exclamation-circle">&#33;</span>
                                                <span aria-hidden="true"></span> This field is required.
                                            </label>
                                        }
                                    </div>

                                    <div className="mt-4">
                                        <label className="missing__content">
                                            Are we missing something?
                                        </label>
                                        <ReactTags
                                            tags={this.state.selected_general_tags}
                                            suggestions={this.props.basedata.basedata.general_tags}
                                            handleDelete={this.handleDeleteGeneralTags}
                                            handleAddition={this.handleAdditionGeneralTags}
                                            allowDragDrop={false}
                                            labelField={'label'}
                                            placeholder={'What else should we know about you?'}
                                        />
                                        {this.state.tagForm.invalid && 
                                            <label className="form-message form-error ">
                                                <span className="air-icon-exclamation-circle">&#33;</span>
                                                <span aria-hidden="true"></span> This field is required.
                                            </label>
                                        }
                                    </div>
                                    <div className="text-center">
                                        <button onClick={ this.handleClick } className="btn mt-4">Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }  
}

export default withRouter(MoreInfo);
