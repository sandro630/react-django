import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Route, Switch } from "react-router-dom";


import Signin from "./containers/Signin/SigninContainer";
import Home from "./containers/HomeContainer";
import Upload from "./containers/UploadContainer";
import Find from "./containers/FindContainer";
import Collection from "./containers/CollectionContainer";
import Community from "./containers/CommunityContainer";
import CollectionDetail from "./containers/CollectionDetailContainer";
import CollectionDetailFromLink from "./containers/CollectionDetailFromLinkContainer";
import DocumentDetail from "./containers/DocumentDetailContainer";
import AddEmail from "./containers/AddEmailContainer";
import EditProfile from "./containers/EditProfileContainer";
// import Confirmation from "./containers/ConfirmationContainer";
import NewCollection from "./containers/NewCollectionContainer";
import CommunitySetting from "./containers/CommunitySettingContainer";
import SharingSetting from "./containers/SharingSettingContainer";
import UploadWebResource from "./containers/UploadWebResourceContainer";fdsafdsafd


import { PrivateRoute } from "./customRoutes/ProtectedRoutes";
import rootReducer from "./reducers";
import auth_tokens_mw from "./customMiddleware/auth_tokens_mw";

/* Adding React-Router-Redux so I can use dispatch(push('/'))
    in the middleware
*/

import createHistory from "history/createBrowserHistory";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";

import "./index.css";
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();
const routMiddleware = routerMiddleware(history);

let store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(routMiddleware, auth_tokens_mw, thunk, logger)
  )
);

if (localStorage.getItem("goog_access_token_conv")) {
  store.dispatch({ type: "GOOG_AUTHENTICATE_ACTION" });
}

if (localStorage.getItem("github_access_token_conv")) {
  store.dispatch({ type: "GITHUB_AUTHENTICATE_ACTION" });
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={Signin} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/upload" component={Upload} />
          <PrivateRoute exact path="/find" component={Find} />
          <PrivateRoute exact path="/collection" component={Collection} />
          <PrivateRoute exact path="/community" component={Community} />
          <PrivateRoute exact path="/collection/:collection_id" component={CollectionDetail} />
          <PrivateRoute exact path="/document/:document_id" component={DocumentDetail} />
          {/* <PrivateRoute exact path="/confirmation" component={Confirmation} /> */}
          <PrivateRoute exact path="/new-collection" component={NewCollection} />
          <PrivateRoute exact path="/upload-web-resource" component={UploadWebResource} />
          <PrivateRoute exact path="/community-setting" component={CommunitySetting} />
          <PrivateRoute exact path="/sharing-setting" component={SharingSetting} />
          <PrivateRoute exact path="/add-email" component={AddEmail} />
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
          <Route exact path="/:uuid" component={CollectionDetailFromLink} />
        </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
