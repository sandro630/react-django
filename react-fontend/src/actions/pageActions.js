const url = process.env.REACT_APP_API_URL;

const requestingBaseData = () => ({ type: "REQUESTING_BASEDATA" });
const receiveResponseBaseData = resp => ({ type: "RECEIVE_RESPONSE_BASEDATA", resp });
const registerSuccess = resp => ({ type: "REGISTER_SUCCESS", resp });
const registerFail = resp => ({ type: "REGISTER_FAIL", resp });
const receiveErrorBaseData = err => ({ type: "RECEIVE_ERROR_BASEDATA", err });
const receiveResponseSchoolData = resp => ({ type: "RECEIVE_RESPONSE_SCHOOL_DATA", resp });
const receiveResponseProfileData = resp => ({ type: "RECEIVE_RESPONSE_PROFILE_DATA", resp });


const receiveResponseCorData = resp => ({ type: "RECEIVE_RESPONSE_CORDATA", resp });
const requestingCorData = () => ({ type: "REQUESTING_CORDATA" });
const retryUpload = () => ({ type: "NORMAL_STATUS" });
const receiveResponseStData = resp => ({ type: "RECEIVE_RESPONSE_STDATA", resp });
const receiveResponseStNumData = resp => ({ type: "RECEIVE_RESPONSE_STNUMDATA", resp });
const receiveResponseWebThumbnail = resp => ({ type: "RECEIVE_RESPONSE_WEB_THUMBNAIL", resp });
const gettingScreenshot = resp => ({ type: "GETTING_SCREENSHOT", resp });
const receiveResponseDocumentData = resp => ({ type: "RECEIVE_RESPONSE_DOCUMENT_DATA", resp });
const receiveResponseCommunityData = resp => ({ type: "RECEIVE_RESPONSE_COMMUNITY_DATA", resp });
const receiveResponseCommunitiesData = resp => ({ type: "RECEIVE_RESPONSE_COMMUNITIES_DATA", resp });
const receiveResponseIsAdmin = resp => ({ type: "RECEIVE_RESPONSE_IS_ADMIN", resp });
const receiveResponseUserPerCommunity = resp => ({ type: "RECEIVE_RESPONSE_USER_PER_COMMUNITY", resp });
const receiveResponseCommunityName = resp => ({ type: "RECEIVE_RESPONSE_COMMUNITY_NAME", resp });
const receiveResponseFileName = resp => ({ type: "RECEIVE_RESPONSE_FILE_NAME", resp });



const requestingSearchData = () => ({ type: "REQUESTING_SEARCHDATA" });
const receiveResponseSearchData = resp => ({ type: "RECEIVE_RESPONSE_SEARCHDATA", resp});
const retryShare = () => ({ type: "RETRY_SHARE" });
const receiveResponseMyData = resp => ({ type: "RECEIVE_RESPONSE_MYDATA", resp});
const receiveResponseCollectionData = resp => ({ type: "RECEIVE_RESPONSE_COLLECTIONDATA", resp});
const receiveResponseCollectionDetailData = resp => ({ type: "RECEIVE_RESPONSE_COLLECTIONDETAILDATA", resp});

const receiveResponseCollectionUUID = resp => ({ type: "RECEIVE_RESPONSE_COLLECTION_UUID", resp});



function getBaseData() {
  return async function(dispatch) {
    dispatch(requestingBaseData());
    
    try {
        
        let response = await fetch(`${url}/auth/basedata/`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
        });
        if (!response.ok) {
            throw new Error("Authorized Request Failed");
        }
        let responseJson = await response.json();
        
        return dispatch( receiveResponseBaseData(responseJson) );
    } catch (err) {
        dispatch(receiveErrorBaseData(err));
    }
    
  };
}

function getProfileData() {
    return async function(dispatch) {
        dispatch(requestingBaseData());
        const searchParams = new URLSearchParams();
        searchParams.set("google_id", localStorage.getItem("GmailID") );
        try {
            let response = await fetch(`${url}/auth/get-profile-data`, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            console.log(responseJson.basedata);
            return dispatch( receiveResponseProfileData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
}

function getSchoolSuggestions(inputLength, inputValue) {
    return async function(dispatch) {
        const searchParams = new URLSearchParams();
        searchParams.set("inputLength", inputLength);
        searchParams.set("inputValue", inputValue);
        try {
          let response = await fetch(`${url}/auth/search-school`, {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: searchParams
          });
          if (!response.ok) {
            throw new Error("Authorized Request Failed");
          }
          let responseJson = await response.json();
          if (responseJson.schools === "[]") {
                return dispatch( receiveResponseSchoolData([]) );      
          } else {
                return dispatch( receiveResponseSchoolData(responseJson.schools) );      
          }
          
        } catch (err) {
          dispatch(receiveErrorBaseData(err));
        }
      };
}

function register(register_info, nextPage) {
    return async function(dispatch) {
      dispatch(requestingBaseData());
      const searchParams = new URLSearchParams();
      searchParams.set("register_info", JSON.stringify(register_info));
      searchParams.set("next_page", nextPage);
      console.log(nextPage);
      try {
        let response = await fetch(`${url}/auth/register/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: searchParams
        });
        if (!response.ok) {
          throw new Error("Authorized Request Failed");
        }
        let responseJson = await response.json();
        if (responseJson.RegisterSuccess) {
            localStorage.setItem("isRegistered", "true");
            window.location = nextPage;
            return dispatch( registerSuccess(responseJson) );
        } else {
            localStorage.setItem("isRegistered", "false");
            return dispatch( registerFail(responseJson) );
        }
      } catch (err) {
        dispatch(receiveErrorBaseData(err));
      }
    };
  }

  function updateProfile(register_info) {
    return async function(dispatch) {
        dispatch(requestingBaseData());
        const searchParams = new URLSearchParams();
        searchParams.set("register_info", JSON.stringify(register_info));
        console.log(register_info);
        try {
          let response = await fetch(`${url}/auth/update-profile`, {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: searchParams
          });
          if (!response.ok) {
            throw new Error("Authorized Request Failed");
          }
          let responseJson = await response.json();
        //   console.log(responseJson);
            return dispatch( registerSuccess(responseJson) );
        } catch (err) {
          dispatch(receiveErrorBaseData(err));
        }
      };
  }

function getThumbnailLink(DocID, access_token) {
    return async function(dispatch) {
        dispatch( requestingCorData() );
        try {
            // console.log(DocID);
            // console.log(access_token);
            let response = await fetch(`https://www.googleapis.com/drive/v3/files/${DocID}/permissions?access_token=${access_token}`, {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify ({
                  "role": "reader",
                  "type": "anyone"
              })
            });
            if (!response.ok) {
                console.log(response);
              throw new Error("Authorized Request Failed");
            }
            console.log(response);
            return dispatch( retryUpload() );
        } catch (err) {
          console.log("failed to get thumbnail link");
        }
      };
  }
  function getCorData() {
    return async function(dispatch) {
      dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        try {
            let response = await fetch(`${url}/auth/cordata/`, {
                method: "POST", 
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            console.log("cordata", responseJson);
            return dispatch( receiveResponseCorData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }
  function getStrand(selected_subject_triggerword, selected_grade_triggerword) {
    return async function(dispatch) {
      const searchParams = new URLSearchParams();
      if(selected_subject_triggerword !== '' && selected_grade_triggerword !== ''){
            searchParams.set("selected_subject_triggerword", selected_subject_triggerword);
            searchParams.set("selected_grade_triggerword", selected_grade_triggerword);
            searchParams.set("GmailID", localStorage.getItem("GmailID"));
            try {
                let response = await fetch(`${url}/auth/get_strand/`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    body: searchParams
                });
                if (!response.ok) {
                    throw new Error("Authorized Request Failed");
                }
                let responseJson = await response.json();
                // console.log(responseJson);
                return dispatch( receiveResponseStData(responseJson) );
            } catch(err) {
                dispatch(receiveErrorBaseData(err));
            }
      }
      
    };
  }
  function getStandard(selected_subject_triggerword, selected_grade_triggerword, selected_strand) {
    return async function(dispatch) {
      const searchParams = new URLSearchParams();
      if(selected_subject_triggerword !== null && selected_grade_triggerword !== null){
            searchParams.set("selected_subject_triggerword", selected_subject_triggerword);
            searchParams.set("selected_grade_triggerword", selected_grade_triggerword);
            searchParams.set("selected_strand", selected_strand);
            searchParams.set("GmailID", localStorage.getItem("GmailID"));
            try {
                let response = await fetch(`${url}/auth/get_standard/`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    body: searchParams
                });
                if (!response.ok) {
                    throw new Error("Authorized Request Failed");
                }
                let responseJson = await response.json();
                var code = eval('(' + responseJson.code + ')');
                return dispatch( receiveResponseStNumData(code) );
            } catch(err) {
                dispatch(receiveErrorBaseData(err));
            }
      }
      
    };
  }
  
  function registerFile(upload_file_info) {
    return async function(dispatch) {
      dispatch(requestingCorData());
      const searchParams = new URLSearchParams();
      searchParams.set("upload_file_info", JSON.stringify(upload_file_info));
      console.log(upload_file_info);
      try {
        let response = await fetch(`${url}/auth/upload_file/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: searchParams
        });

        if (!response.ok) {
          throw new Error("Authorized Request Failed");
        }
        let upload_response = await response.json();
        // console.log("Upload file response:", upload_response);
        
        if (upload_response.col_id === 0) {
            alert("This document already exist in this collection!");
            return dispatch( retryUpload() );      
        } else {
            // window.location = "/collection/" + upload_response.col_id + "/?new=true"
            if (upload_file_info.collection_pk === "default" || upload_file_info.collection_pk === "new") {
                window.location = "/home";
            } else {
                window.location = "/collection/"+upload_file_info.collection_pk+"/?new="+upload_response.doc_id;
            }
            
        }
        localStorage.removeItem("collection_id");
        // console.log("response", responseJson);
        
    } catch (err) {
        dispatch(receiveErrorBaseData(err));
      }
    };
  }

  function updateFile(upload_file_info) {
    return async function(dispatch) {
      dispatch(requestingCorData());
      const searchParams = new URLSearchParams();
      searchParams.set("upload_file_info", JSON.stringify(upload_file_info));
      console.log(upload_file_info);
      try {
        let response = await fetch(`${url}/auth/update-file`, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: searchParams
        });

            if (!response.ok) {
            throw new Error("Authorized Request Failed");
            }
            let upload_response = await response.json();

            if (upload_file_info.col_pk !== '0') {
                window.location = "/collection/" + upload_file_info.col_pk;
            } else {
                window.location = "/home";
            }
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  

  function getMyData() {
    return async function(dispatch) {
        dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            console.log(`${url}/auth/getmydata/`);
            let response = await fetch(`${url}/auth/getmydata/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });

            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            console.log("mydata");
            console.log(responseJson);
            return dispatch( receiveResponseMyData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getSearchData(keyword, option, community_id) {
    return async function(dispatch) {
      dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
        console.log(keyword);
            searchParams.set("keyword", keyword );
            searchParams.set("option", option );
            searchParams.set("community_id", community_id );
            let response = await fetch(`${url}/auth/searchdata/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log("searchdata", responseJson);
            return dispatch( receiveResponseSearchData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function searchCollection(keyword) {
    return async function(dispatch) {
      dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        searchParams.set("keyword", keyword );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/search-collection`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseCollectionData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getCollectionData() {
    return async function(dispatch) {
      dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/collectiondata/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            return dispatch( receiveResponseCollectionData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getCollectionDetail(collection_id) {
    return async function(dispatch) {
      dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("collection_id", collection_id);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/collection_detail/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            console.log(responseJson);
            return dispatch( receiveResponseCollectionDetailData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getCollectionDetailFromUUID(uuid) {
    return async function(dispatch) {
      dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("uuid", uuid);
        console.log(uuid);
        if (localStorage.getItem("GmailID") && localStorage.getItem("isRegistered") === "true") {
            searchParams.set("GmailID", localStorage.getItem("GmailID"));
        } else {
            searchParams.set("GmailID", null);
        }
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/collection_detail_from_uuid/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            console.log(responseJson);
            return dispatch( receiveResponseCollectionDetailData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  
  function shareCollection(email, collection_id) {
    return async function(dispatch) {
        dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("collection_id", collection_id);
        searchParams.set("target_email", email);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/collection_share/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            alert(responseJson.message);
            return dispatch( retryShare() );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function changeColTitle(col_title, col_description, col_id) {
    return async function(dispatch) {
      dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("col_title", col_title);
        searchParams.set("col_description", col_description);
        searchParams.set("col_id", col_id);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/change-collection-title-description`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseCollectionDetailData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function removeDoc(doc_id, col_id) {
    return async function(dispatch) {
        dispatch(requestingSearchData());
          const searchParams = new URLSearchParams();
          searchParams.set("doc_id", doc_id);
          try {
          //   let token_conv =
          //     (await localStorage.getItem("goog_access_token_conv")) ||
          //     localStorage.getItem("github_access_token_conv");
              let response = await fetch(`${url}/auth/remove-document`, {
                  method: "POST",
                  headers: {
                      Accept: "application/json",
                  },
                  body: searchParams
              });
              if (!response.ok) {
                  throw new Error("Authorized Request Failed");
              }
              let responseJson = await response.json();
            //   console.log(responseJson);
              window.location = "/collection/" + col_id;
          } catch (err) {
              dispatch(receiveErrorBaseData(err));
          }
      };
  }

  function removeDocOnFind(doc_id) {
    return async function(dispatch) {
        dispatch(requestingCorData());
          const searchParams = new URLSearchParams();
          searchParams.set("doc_id", doc_id);
          try {
          //   let token_conv =
          //     (await localStorage.getItem("goog_access_token_conv")) ||
          //     localStorage.getItem("github_access_token_conv");
              let response = await fetch(`${url}/auth/remove-document`, {
                  method: "POST",
                  headers: {
                      Accept: "application/json",
                  },
                  body: searchParams
              });
              if (!response.ok) {
                  throw new Error("Authorized Request Failed");
              }
              let responseJson = await response.json();
              console.log(responseJson);
              window.location = "/find";
          } catch (err) {
              dispatch(receiveErrorBaseData(err));
          }
      };
  }

  function removeDocOnHome(doc_id) {
    return async function(dispatch) {
        dispatch(requestingSearchData());
          const searchParams = new URLSearchParams();
          searchParams.set("doc_id", doc_id);
          try {
          //   let token_conv =
          //     (await localStorage.getItem("goog_access_token_conv")) ||
          //     localStorage.getItem("github_access_token_conv");
              let response = await fetch(`${url}/auth/remove-document`, {
                  method: "POST",
                  headers: {
                      Accept: "application/json",
                  },
                  body: searchParams
              });
              if (!response.ok) {
                  throw new Error("Authorized Request Failed");
              }
              let responseJson = await response.json();
              console.log(responseJson);
              window.location = "/home";
          } catch (err) {
              dispatch(receiveErrorBaseData(err));
          }
      };
  }

  function removeCollection(col_id) {
    return async function(dispatch) {
        dispatch(requestingSearchData());
          const searchParams = new URLSearchParams();
          console.log(col_id);
          searchParams.set("col_id", col_id);
          try {
          //   let token_conv =
          //     (await localStorage.getItem("goog_access_token_conv")) ||
          //     localStorage.getItem("github_access_token_conv");
              let response = await fetch(`${url}/auth/remove-collection`, {
                  method: "POST",
                  headers: {
                      Accept: "application/json",
                  },
                  body: searchParams
              });
              if (!response.ok) {
                  throw new Error("Authorized Request Failed");
              }
              let responseJson = await response.json();
            //   console.log(responseJson);
              window.location = "/collection";
          } catch (err) {
              dispatch(receiveErrorBaseData(err));
          }
      };
  }

  function removeSharedCollection(col_id) {
    return async function(dispatch) {
        dispatch(requestingSearchData());
          const searchParams = new URLSearchParams();
          searchParams.set("col_id", col_id);
          searchParams.set("GmailID", localStorage.getItem("GmailID") );
          try {
          //   let token_conv =
          //     (await localStorage.getItem("goog_access_token_conv")) ||
          //     localStorage.getItem("github_access_token_conv");
              let response = await fetch(`${url}/auth/remove-shared-collection`, {
                  method: "POST",
                  headers: {
                      Accept: "application/json",
                  },
                  body: searchParams
              });
              if (!response.ok) {
                  throw new Error("Authorized Request Failed");
              }
              let responseJson = await response.json();
            //   console.log(responseJson);
              window.location = "/collection";
          } catch (err) {
              dispatch(receiveErrorBaseData(err));
          }
      };
  }
  
  
  function createCollection(col_title, col_description, col_uuid, gmail_id) {
    return async function(dispatch) {
      dispatch(requestingSearchData());
        const searchParams = new URLSearchParams();
        searchParams.set("col_title", col_title);
        searchParams.set("col_description", col_description);
        searchParams.set("col_uuid", col_uuid);
        searchParams.set("GmailID", gmail_id);
        console.log(col_title);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/create-empty-collection`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseCollectionUUID(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getWebThumbnail(web_url) {
    return async function(dispatch) {
        dispatch(gettingScreenshot());
        const searchParams = new URLSearchParams();
        searchParams.set("web_url", web_url);
        console.log(web_url);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/get-web-thumbnail`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            console.log(responseJson);
            return dispatch( receiveResponseWebThumbnail(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getOtherThumbnail(web_url, r_num) {
    return async function(dispatch) {
        dispatch(gettingScreenshot());
        const searchParams = new URLSearchParams();
        searchParams.set("web_url", web_url);
        searchParams.set("r_num", r_num);
        console.log(r_num);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/get-webimage-by-random-number`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            console.log(responseJson);
            return dispatch( receiveResponseWebThumbnail(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }
  
  function getDocumentDetail(document_id) {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("document_id", document_id);
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/get-document-data`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseDocumentData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getCommunity() {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/get-community`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseCommunityData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }
  
  function getUsersPerCommunity(communityID) {
    return async function(dispatch) {
        // dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("community_id", communityID);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/get-users-per-communities`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseUserPerCommunity(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function saveSharingSetting(setting) {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        searchParams.set("setting", JSON.stringify(setting) );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/save-sharing-setting`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseCommunityData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function saveCommunitySetting(users, communityID) {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("users", JSON.stringify(users) );
        searchParams.set("communityID", communityID );
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/save-community-setting`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseUserPerCommunity(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }
  

  function isAdmin() {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/is-admin`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseIsAdmin(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getCommunities() {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("GmailID", localStorage.getItem("GmailID") );
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/get-admin-communities`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseCommunitiesData(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function getCommunityName(communityID) {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("communityID", communityID);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/get-community-name`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            // console.log(responseJson);
            return dispatch( receiveResponseCommunityName(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function addEmailToCommunity(email, communityID) {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("email", email);
        searchParams.set("communityID", communityID);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/add-email-to-community`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            return dispatch( retryUpload() );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function uploadCSVFile(fileObject, communityID) {
    return async function(dispatch) {
        dispatch(requestingCorData());
        let formData = new FormData();
        formData.append('file_object',fileObject);
        formData.append('community_id',communityID);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/add-email-from-csv`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            return dispatch( receiveResponseFileName(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

  function downloadFile(communityID) {
    return async function(dispatch) {
        dispatch(requestingCorData());
        const searchParams = new URLSearchParams();
        searchParams.set("community_id", communityID);
        try {
        //   let token_conv =
        //     (await localStorage.getItem("goog_access_token_conv")) ||
        //     localStorage.getItem("github_access_token_conv");
            let response = await fetch(`${url}/auth/download-csv`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: searchParams
            });
            if (!response.ok) {
                throw new Error("Authorized Request Failed");
            }
            let responseJson = await response.json();
            return dispatch( retryUpload(responseJson) );
        } catch (err) {
            dispatch(receiveErrorBaseData(err));
        }
    };
  }

 
export {
    getBaseData, 
    register, 
    getSchoolSuggestions,
    registerFile, 
    getCorData, 
    getStrand, 
    getStandard, 
    getSearchData, 
    getThumbnailLink,
    getMyData,
    getCollectionData,
    searchCollection,
    getCollectionDetail,
    getCollectionDetailFromUUID,
    shareCollection,
    changeColTitle,
    createCollection,
    removeDoc,
    removeCollection,
    removeSharedCollection,
    getWebThumbnail,
    getOtherThumbnail,
    removeDocOnFind,
    removeDocOnHome,
    getDocumentDetail,
    updateFile,
    getCommunity,
    saveSharingSetting,
    isAdmin,
    getUsersPerCommunity,
    getCommunities,
    saveCommunitySetting,
    getCommunityName,
    addEmailToCommunity,
    uploadCSVFile,
    downloadFile,
    getProfileData,
    updateProfile
};
