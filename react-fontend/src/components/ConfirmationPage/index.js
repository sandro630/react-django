import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';
import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)
// for React 16.4.x use: import { ReactTabulator }
import { ReactTabulator } from "react-tabulator"; // for React 15.x


import "../../css/find.css";
import "../../css/navigation.css";


var printIcon = function(cell, formatterParams){ //plain text value
    // console.log();
    if (cell.getRow().getData().iconUrl === "") {
        return "<img src='/static/images/www-icon.svg' />";
    } else {
        return "<img src='"+ cell.getRow().getData().iconUrl +"' />";
    }
};

class ConfirmationPage extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.props.getMyData();
    }

    rowClick(e, row){
        console.log(row.getData().url);
        window.open(row.getData().url, "_blank");
    }

    handleClick(){
        window.location = "/home";
    }

    render() {
        const columns = [
            { title: "", field: "thumbnail", align: "center", formatter:printIcon,  width: '5%',},
            { title: "Documents matching your search:", field: "name", width: '28%' },
            { title: "Contributor", field: "owner", width: '15%' },
            { title: "Type", field: "DocType" , width: '12%' },
            { title: "Standards", field: "standard", width: '20%'  },
            { title: "Tags", field: "tags", width: '15%'  },
            { title: "", field: "remove", width: '3%', align: "center", formatter: "buttonCross", 
                cellClick: (e, cell) => {e.stopPropagation();this.props.removeDocOnFind(cell.getRow().getData().doc_id);}},
            { title: "", field: "iconUrl", visible: false  },
            { title: "", field: "url", visible: false  },
            { title: "", field: "doc_id", visible: false },
        ];
        console.log("----"+ this.props.searchdata.searchdata);
        if (this.props.searchdata.isFetching) {
            return (
                <div className="spinner-padding">
                    <Spinner size={50} spinnerColor={"#FF671D"} spinnerWidth={2} visible={true} />
                </div>
            )
        } else {
            const options = {
                height: "500px",
                movableRows: true
              };
            return (
                <div className="container text-center" style={{ 'display': 'block'}}>
                    <p classNam="lg-p text-center">Shared with Coteacher</p>
                    <div className="mt-4">
                        <ReactTabulator
                            ref={ref => (this.ref = ref)}
                            columns={columns}
                            data={this.props.searchdata.searchdata}
                            rowClick={this.rowClick}
                            options={options}
                            data-custom-attr="test-custom-attribute"
                            className="custom-css-class"
                        />
                    </div>
                    <button className="btn float-right mt-4" id="saveBtn" onClick={this.handleClick}>Add More</button>
                </div>
            );
        }
    }  
}

export default withRouter(ConfirmationPage);
