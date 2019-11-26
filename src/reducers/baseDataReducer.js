const initialState = {
	basedata: {},
	err: null,
    isFetching: false,
    suggested_schools: [],
    profileData: {
        selected_general_tag: [],
        selected_grade: '',
        selected_role: '',
        selected_school: '',
        selected_student_need: [],
        selected_subject: ''
    }
};

function baseDataReducer(state = initialState, action) {
	switch (action.type) {
		case "REQUESTING_BASEDATA":
            return { ...state, err: null, isFetching: true };
        case "RECEIVE_RESPONSE_PROFILE_DATA":
            return { ...state, basedata: convertBaseData(action.resp.basedata), profileData: convertProfileData(action.resp.profile_data), 
                suggested_schools: convertSelectedSchool(action.resp.profile_data.selected_school),isFetching: false };
		case "RECEIVE_RESPONSE_BASEDATA":
			return { ...state, basedata: convertBaseData(action.resp), isFetching: false };
		case "RECEIVE_ERROR_BASEDATA":
            return { ...state, err: action.err, isFetching: false };
        case "REGISTER_SUCCESS":
            return { ...state, err: null, isFetching: false };
        case "REGISTER_FAIL":
            return { ...state, err: null, isFetching: false };   
        case "RECEIVE_RESPONSE_SCHOOL_DATA":
            return { ...state, suggested_schools: convertSuggestedSchoolData(action.resp), isFetching: false };   
		default:
			return state;
	}
}
function convertBaseData(basedata){
    var roles = [];
    basedata.roles.map( val => {
        roles.push({ label: val.Title, id: val.Title});    
    });
    var subjects = [];
    basedata.subjects.map( val => {
        subjects.push({ label: val.Name, id: val.Name});    
    });
    var grades = [];
    basedata.grades.map( val => {
        grades.push({ label: val.TriggerWord, id: val.TriggerWord});    
    });
    var student_needs = [];
    basedata.student_needs.map( val => {
        student_needs.push({ label: val.Population, id: val.Population});    
    });
    var general_tags = [];
    basedata.general_tags.map( val => {
        general_tags.push({ label: val.Tag, id: val.Tag});    
    });
    return {
        roles: roles, 
        subjects: subjects, 
        grades: grades, 
        student_needs: student_needs, 
        general_tags: general_tags,
    };
}

function convertProfileData(profileData) {
    var roles = [];
    roles.push({ label: profileData.selected_role, id: profileData.selected_role});
    var subjects = [];
    profileData.selected_subject.map( val => {
        subjects.push({ label: val, id: val});
    });
    var grades = [];
    profileData.selected_grade.map( val => {
        grades.push({ label: val, id: val});    
    });
    var student_needs = [];
    profileData.selected_student_need.map( val => {
        student_needs.push({ label: val, id: val});    
    });
    var general_tags = [];
    profileData.selected_general_tag.map( val => {
        general_tags.push({ label: val, id: val});    
    });
    var convertedProfileData = {
        selected_general_tags: general_tags,
        selected_grades: grades,
        selected_role: roles,
        selected_school: profileData.selected_school,
        selected_student_needs: student_needs,
        selected_subjects: subjects
    }
    return convertedProfileData;
}

function convertSelectedSchool(school) {
    var suggested_schools = [];
    suggested_schools.push({ label: school.split(", ")[0], city: school.split(", ")[1], state: school.split(", ")[2]});
    return suggested_schools;
}
function convertSuggestedSchoolData(schools) {
    var suggested_schools = [];
    schools.map( val => {
        suggested_schools.push({ label: val.Name, city: val.City, state: val.state_name});
    });
    return suggested_schools;
}
export default baseDataReducer;
