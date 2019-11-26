import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import googleTokenReducer from "./googleAuthReducer";
import githubAuthReducer from "./githubAuthReducer";
import baseDataReducer from "./baseDataReducer";
import corDataReducer from "./corDataReducer";
import searchDataReducer from "./searchDataReducer";
import collectionDataReducer from "./collectionDataReducer";

const rootReducer = combineReducers({
  router: routerReducer,
  goog_auth: googleTokenReducer,
  github_auth: githubAuthReducer,
  basedata: baseDataReducer,
  cordata: corDataReducer,
  searchdata: searchDataReducer,
  collectiondata: collectionDataReducer,
});

export default rootReducer;
