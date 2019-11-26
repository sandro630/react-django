const initialState = {
	cordata: {},
	err: null,
    isFetching: false,
    strand: [],
    standard: [],
    standard_set: null,
    web_thumbnail: '',
    getting_screenshot: false,
    document_data: {
        thumbnail: ""
    },
    communityData: [],
    isAdmin: false,
    usersPerCommunity: [],
    communityName: "",
    uploadFileName: ""
};

function corDataReducer(state = initialState, action) {
	switch (action.type) {
		case "REQUESTING_CORDATA":
            return { ...state, err: null, isFetching: true };
        case "NORMAL_STATUS":
			return { ...state, err: null, isFetching: false };
		case "RECEIVE_RESPONSE_CORDATA":
			return { ...state, cordata: convertCorData(action.resp), isFetching: false };
		case "RECEIVE_RESPONSE_STDATA":
            return { ...state, strand: convertStrand(action.resp), standard_set: action.resp.standard_set, standard: [], isFetching: false };
        case "RECEIVE_RESPONSE_STNUMDATA":
            return { ...state, standard: convertStandardNum(action.resp), isFetching: false };
        case "RECEIVE_RESPONSE_WEB_THUMBNAIL":
            return { ...state, web_thumbnail: action.resp.thumbnail_url, isFetching: false, getting_screenshot: false };
        case "GETTING_SCREENSHOT":
            return { ...state, err: null, getting_screenshot: true };
        case "RECEIVE_RESPONSE_DOCUMENT_DATA":
            return { ...state, cordata: convertCorData(action.resp), strand: convertStrand(action.resp, action.resp.doc.strand),
                standard: convertStandardNum(action.resp, action.resp.doc.standard), standard_set: action.resp.standard_set, 
                document_data: action.resp.doc, web_thumbnail: action.resp.doc.thumbnail, isFetching: false };
        case "RECEIVE_RESPONSE_COMMUNITY_DATA":
            return { ...state, communityData: convertCommunityData(action.resp), isFetching: false };
        case "RECEIVE_RESPONSE_COMMUNITIES_DATA":
            return { ...state, communityData: convertCommunitiesData(action.resp), isFetching: false };
        case "RECEIVE_RESPONSE_IS_ADMIN":
            return { ...state, isAdmin: action.resp.isAdmin, isFetching: false };
        case "RECEIVE_RESPONSE_USER_PER_COMMUNITY":
            return { ...state, usersPerCommunity: convertUserPerCommunity(action.resp),  isFetching: false };
        case "RECEIVE_RESPONSE_COMMUNITY_NAME":
            return { ...state, communityName: action.resp.communityName,  isFetching: false };
        case "RECEIVE_RESPONSE_FILE_NAME":
            return { ...state, uploadFileName: action.resp.fileName,  isFetching: false };
		default:
			return state;
	}
}
function convertCorData(cordata){
    // console.log(cordata);
    var subject_triggerword = [];
    eval("(" + cordata.subject_triggerword + ")").map( val => {
        subject_triggerword.push({ label: val.fields.TriggerWord, id: val.fields.id});    
    });
    var grade_triggerword = [];
    eval("(" + cordata.grade_triggerword + ")").map( val => {
        grade_triggerword.push({ label: val.fields.TriggerWord, id: val.fields.id});    
    });
    var doctype = [];
    eval("(" + cordata.doctype + ")").map( val => {
        doctype.push({ label: val.fields.Type, id: val.fields.id});    
    });
    var general_tags = [];
    eval("(" + cordata.general_tags + ")").map( val => {
        general_tags.push({ label: val.fields.Tag, id: val.fields.Tag});    
    });
    var collections = [];
    eval("(" + cordata.collections + ")").map( val => {
        collections.push(val);    
    });
    return {
        subject_triggerword: subject_triggerword, 
        grade_triggerword: grade_triggerword, 
        doctype: doctype, 
        general_tags: general_tags, 
        collections: collections
    };
}

function convertStrand(st, ini_strand = ""){
    var strand = [];
    var origin_strand = eval('(' + st.strand + ')');
    origin_strand.map( val => {
        if (val.Strand === ini_strand) {
            strand.push({ title: val.Strand, id: val.Strand, selected: true, key: "selected_strand"});
        } else {
            strand.push({ title: val.Strand, id: val.Strand, selected: false, key: "selected_strand"});
        }
    });
    return strand;
}
function convertStandardNum(code, ini_standard_number = ""){
    var standard = [];
    var converted_code = eval("(" + code.code + ")");
    converted_code.map( val => {
        if (ini_standard_number === val.Standard_Number) {
            standard.push({ title: val.Standard_Number, id: val.id, selected: true, key: 
                "selected_standard", description: val.Description});    
        } else {
            standard.push({ title: val.Standard_Number, id: val.id, selected: false, key: 
                "selected_standard", description: val.Description});    
        }
        
    });
    return standard;
}

function convertCommunitiesData(comArray) {
    var communities = eval("(" + comArray.communities + ")");
    var coms = [];
    communities.map( (com, i) => {
        coms.push({
            id: com.pk,
            title: com.name + " (" + com.memberCount + " members)" ,
            selected: false,
            key: "selected_community"
        })
    });
    console.log(coms);
    return coms;
}


function convertCommunityData(comArray) {
    var communities = eval("(" + comArray.communities + ")");
    var coms = [];
    var sharedCommunities = eval("(" + comArray.shared_communities + ")");
    console.log(sharedCommunities);
    communities.map( (com, i) => {
        
        coms.push({
            id: com.pk,
            value: com.community_name,
            isChecked: sharedCommunities.includes(com.pk)
        })
    });
    return coms;
}

function convertUserPerCommunity(resp) {
    var users = eval("(" + resp.users + ")");
    var userData = [];
    users.map( (user, i) => {
        userData.push({
            id: user.pk,
            value: user.fields.Firstname + " " + user.fields.Lastname,
            email: user.fields.Email,
            isChecked: resp.existingUsers.includes(user.pk)
        })
    });
    console.log(userData);
    return userData;
}
export default corDataReducer;
