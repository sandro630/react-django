const initialState = {
    uuid: "",
    collection_id: ""
};

function collectionDataReducer(state = initialState, action) {
	switch (action.type) {
        case "RECEIVE_RESPONSE_COLLECTION_UUID":
                return { ...state, uuid: action.resp.uuid, collection_id: action.resp.col_id };
		default:
			return state;
	}
}

export default collectionDataReducer;
