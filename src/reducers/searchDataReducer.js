const initialState = {
	searchdata: [],
	err: null,
    isFetching: false,
    strand: [],
    standard: [],
    my_collections: [],
    shared_collections: [],
    collection_detail: {
        title: "",
        description: "",
        thumbnail: "",
        uuid: '',
        docs: []
    },
    col_count: 0,
};

function searchDataReducer(state = initialState, action) {
	switch (action.type) {
		case "REQUESTING_SEARCHDATA":
            return { ...state, err: null, isFetching: true };
        case "RETRY_SHARE":
			return { ...state, err: null, isFetching: false };
		case "RECEIVE_RESPONSE_SEARCHDATA":
			return { ...state, searchdata: convertSearchData(action.resp), isFetching: false };
        case "RECEIVE_RESPONSE_MYDATA":
            return { ...state, searchdata: convertMyData(action.resp), isFetching: false };
        case "RECEIVE_RESPONSE_COLLECTIONDATA":
            return { ...state, my_collections: covertMyCollectionData(action.resp), 
                shared_collections: covertSharedCollectionData(action.resp), isFetching: false };
        case "RECEIVE_RESPONSE_COLLECTIONDETAILDATA":
                return { ...state, collection_detail: convertCollectionDetail(action.resp), isFetching: false };
        case "RECEIVE_RESPONSE_HAS_COLLECTION":
                return { ...state, col_count: action.resp.col_count, isFetching: false };
        case "RECEIVE_RESPONSE_SEARCH_COLLECTION":
                return { ...state, col_count: action.resp.col_count, isFetching: false };
		default:
			return state;
	}
}

function convertSearchData(searchdata){
    var search_result = [];
    var id = 1;
    var st = eval("(" + searchdata.docs + ")");
    st.map( function(val) {
        var t = {
            id: id ++,
            thumbnail: true,
            name: val.title,
            owner: val.owner,
            DocType: val.DocType,
            standard: val.standard.join(","),
            tags: val.tags.join(","),
            iconUrl: val.iconUrl,
            url: val.url,
            doc_id: val.DocID,
        }
        search_result.push(t);
    });
    return search_result;
}

function convertMyData(mydata){
    var search_result = [];
    var id = 1;
    var st = eval("(" + mydata.docs + ")");
    console.log(st);
    st.map( function(val) {
        var t = {
            id: val.id,
            thumbnail: true,
            name: val.title,
            DocType: val.DocType,
            subject: val.subject,
            standard: val.standard.join(","),
            tags: val.tags.join(","),
            iconUrl: val.iconUrl,
            url: val.url,
            doc_id: val.DocID,
        }
        search_result.push(t);
    });
    return search_result;
}

function covertMyCollectionData(collection_data) {
    console.log(collection_data.my_collections);
    var my_collections = eval("(" + collection_data.my_collections + ")");
    return my_collections;
}

function covertSharedCollectionData(collection_data) {
    console.log(collection_data.share_collections);
    var share_collections = eval("(" + collection_data.share_collections + ")");
    return share_collections;
}
function convertCollectionDetail(collection_detail) {
    return {
        title: collection_detail.title,
        description: collection_detail.description,
        thumbnail: collection_detail.thumbnail,
        uuid: collection_detail.uuid,
        role: collection_detail.role,
        school: collection_detail.school,
        docs: eval("(" + collection_detail.docs + ")")
    }
}

export default searchDataReducer;
