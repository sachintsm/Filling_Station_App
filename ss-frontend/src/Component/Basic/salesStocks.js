import React, { Component } from 'react';
import { verifyAuth } from '../../utils/authentication'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import Sidebar from '../Auth/sidebar'
// import { getFromStorage } from '../../utils/storage';
import '../../Css/Basic/salesStocks.css'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import axios from 'axios'
// import { MDBInput } from "mdbreact";

const Fu = React.memo(props => (
    <tr>
        <td>{props.fu.pId}</td>
        <td>{props.fu.pName}</td>
        <td>{props.fu.sellPrice}</td>
        <td>
            <input className="form-control inputValue" defaultValue={props.fu.availStock} onBlur={() => props.stock(props.fu)} onChange={() => props.stockchng} />
        </td>
        {/* <td>{props.fu.state}</td> */}
        {/* <td>
            <button className="btn btn-danger btn-info  " type="delete" onClick={() => props.delete(props.fu._id)}>DELETE</button>
        </td> */}
    </tr>
));

const Ga = React.memo(props => (
    <tr>
        <td>{props.ga.pId}</td>
        <td>{props.ga.pName}</td>
        <td>{props.ga.sellPrice}</td>
        <td>
            <input className="form-control inputValue" type="text"  name="availStock" defaultValue={props.ga.availStock} onBlur={() => props.stock(props.ga)} onChange={() => props.stockchng} />
        </td>
        {/* <td>{props.fu.state}</td> */}
        {/* <td>
            <button className="btn btn-danger btn-info  " type="delete" onClick={() => props.delete(props.fu._id)}>DELETE</button>
        </td> */}
    </tr>
));

const Lu = React.memo(props => (
    <tr>
        <td>{props.lu.pId}</td>
        <td>{props.lu.pName}</td>
        <td>{props.lu.sellPrice}</td>
        <td>
            <input className="form-control inputValue" defaultValue={props.lu.availStock} onBlur={() => props.stock(props.lu)} onChange={() => props.stockchng} />
        </td>
        {/* <td>{props.fu.state}</td> */}
        {/* <td>
            <button className="btn btn-danger btn-info  " type="delete" onClick={() => props.delete(props.fu._id)}>DELETE</button>
        </td> */}
    </tr>
));

const Ot = React.memo(props => (
    <tr>
        <td>{props.ot.pId}</td>
        <td>{props.ot.pName}</td>
        <td>{props.ot.sellPrice}</td>
        <td>
            <input className="form-control inputValue" defaultValue={props.ot.availStock} onBlur={() => props.stock(props.ot)} onChange={() => props.stockchng} />
        </td>
        {/* <td>{props.fu.state}</td> */}
        {/* <td>
            <button className="btn btn-danger btn-info  " type="delete" onClick={() => props.delete(props.fu._id)}>DELETE</button>
        </td> */}
    </tr>
));

class salesStocks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snackbaropen: false,
            pId: '',
            pName: '',
            sellPrice: '',
            pType: '',
            availStock: '',
            userData: [],
            products: [],
            // dataObj1:[],
        }
        this.onChange = this.onChange.bind(this);
        // this.onSubmit = this.onSubmit.bind(this);
        // this.handleSearch = this.handleSearch.bind(this);
        this.onAvailableStockBlur = this.onAvailableStockBlur.bind(this);
        this.deleteDebtor = this.deleteDebtor.bind(this);
        this.onAvailableStockChange = this.onAvailableStockChange.bind(this);

    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }

    componentDidMount() {

        // const requestOne = axios.get('http://localhost:4000/fuelLubricantPrice/get');
        // const requestTwo = axios.get('http://localhost:4000/debtors/get');

        axios.get('http://localhost:4000/fuelLubricantPrice/get')
            .then(response => {
                this.setState({ products: response.data.data });
                console.log(this.state.products);

            })
            .catch(function (error) {
                console.log(error);
            })



        // axios
        //     .all([requestOne, requestTwo])
        //     .then(
        //         axios.spread((...responses) => {
        //             const responseOne = responses[0].data.data;
        //             const responseTwo = responses[1].data.data;
        //             // const responesThree = responses[2];
        //             this.setState({ products:{responseOne, responseTwo} });

        //             // use/access the results
        //             console.log(this.state.products );
        //         })
        //     )
        //     .catch(errors => {
        //         // react on errors.
        //         console.error(errors);
        //     });
    }

    handleSearch = e => {
        this.setState({ pId: e.target.value });

    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    onAvailableStockChange(e) {
        console.log("sachin");

        // this.setState({
        //     availStock: e.target.value,
        // })
    }

    onAvailableStockBlur(data) {

        console.log("bhaya");
        console.log(data);
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("pId", data.pId);
        urlencoded.append("availStock", this.state.availStock);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:4000/fuelLubricantPrice/updateAvailableStock", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    UserListF() {
        const local = this.state.pId;
        if (local == null || local === "") {
            return this.state.products.map((currentFu, i) => {
                if(currentFu.pType === "Fuel"){
                return <Fu delete={this.deleteDebtor} stock={this.onAvailableStockBlur} stockchng={this.onAvailableStockChange} onChange={this.onChange} fu={currentFu} key={i} />;
            }
            return null;
            }
            )
        }
        else {
            return this.state.products.map((currentFu, i) => {
                if (currentFu.pId === local && currentFu.pType === "Fuel") {
                    return <Fu delete={this.deleteDebtor} stock={this.onAvailableStockBlur} stockchng={this.onAvailableStockChange} fu={currentFu} key={i} />;

                }
                return null;
            })
        }
    }

    UserListG() {
        const local = this.state.pId;
        if (local == null || local === "") {

            // console.log(this.state.users);
            return this.state.products.map((currentGa, i) => {
                if (currentGa.pType === "Gas") {
                    return <Ga delete={this.deleteDebtor} stock={this.onAvailableStockBlur} stockchng={this.onAvailableStockChange} ga={currentGa} key={i} />;
                }
                return null;
            }
            )
        }
        else {
            return this.state.products.map((currentGa, i) => {
                if (currentGa.pId === local && currentGa.pType === "Gas") {
                    return <Ga delete={this.deleteDebtor} stock={this.onAvailableStockBlur} stockchng={this.onAvailableStockChange} ga={currentGa} key={i} />;

                }
                return null;
            })
        }
    }

    UserListL() {
        const local = this.state.pId;
        if (local == null || local === "") {

            // console.log(this.state.users);
            return this.state.products.map((currentLu, i) => {
                if (currentLu.pType === "Lubricant") {
                    return <Lu delete={this.deleteDebtor} stock={this.onAvailableStockBlur} stockchng={this.onAvailableStockChange} lu={currentLu} key={i} />;
                }
                return null;
            }
            )
        }
        else {
            return this.state.products.map((currentLu, i) => {
                if (currentLu.pId === local && currentLu.pType === "Lubricant") {
                    return <Lu delete={this.deleteDebtor} stock={this.onAvailableStockBlur} stockchng={this.onAvailableStockChange} lu={currentLu} key={i} />;

                }
                return null;
            })
        }
    }

    UserListO() {
        const local = this.state.pId;
        if (local == null || local === "") {

            // console.log(this.state.users);
            return this.state.products.map((currentOt, i) => {
                if (currentOt.pType === "Other") {
                    return <Ot delete={this.deleteDebtor} stock={this.onAvailableStockBlur} stockchng={this.onAvailableStockChange} ot={currentOt} key={i} />;
                }
                return null;
            }
            )
        }
        else {
            return this.state.products.map((currentOt, i) => {
                if (currentOt.pId === local && currentOt.pType === "Other") {
                    return <Ot delete={this.deleteDebtor} stock={this.onAvailableStockBlur} stockchng={this.onAvailableStockChange} ot={currentOt} key={i} />;

                }
                return null;
            })
        }
    }

    deleteDebtor(data) {
        axios.delete('http://localhost:4000/debtors/deleteDebtor/' + data)
            .then(res => {
                console.log(res);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.message
                })
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: err
                })
            })
    }

    // componentDidMount = async () => {
    //     const authState = await verifyAuth();
    //     this.setState({ authState: authState })
    //     if (!authState) this.props.history.push('/login');
    // }

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <Snackbar
                        open={this.state.snackbaropen}
                        autoHideDuration={2000}
                        onClose={this.snackbarClose}
                        message={<span id="message-id">{this.state.snackbarmsg}</span>}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="secondary"
                                onClick={this.snackbarClose}
                            > x </IconButton>
                        ]}
                    />
                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="card">
                                <div>
                                    <h3 className="sp_head">List of Fuels</h3>
                                    <form>
                                        <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                            <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                        </div>
                                    </form>
                                    <div className="sp_table">
                                        <form>
                                            <table className="table table-striped" style={{ marginTop: 20 }} >
                                                <thead>
                                                    <tr>
                                                        <th>P.ID</th>
                                                        <th>P.Name</th>
                                                        <th>Selling Price</th>
                                                        <th>Available Stock</th>
                                                        <th>State</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {this.UserListF()}
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div>
                                    <h3 className="sp_head">List of Gases</h3>
                                    <form>
                                        <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                            <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                        </div>
                                    </form>
                                    <div className="sp_table">
                                        <form>
                                            <table className="table table-striped" style={{ marginTop: 20 }} >
                                                <thead>
                                                    <tr>
                                                        <th>P.ID</th>
                                                        <th>P.Name</th>
                                                        <th>Selling Price</th>
                                                        <th>Available Stock</th>
                                                        <th>State</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {this.UserListG()}
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div>
                                    <h3 className="sp_head">List of Lubricants</h3>
                                    <form>
                                        <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                            <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                        </div>
                                    </form>
                                    <div className="sp_table">
                                        <form>
                                            <table className="table table-striped" style={{ marginTop: 20 }} >
                                                <thead>
                                                    <tr>
                                                        <th>P.ID</th>
                                                        <th>P.Name</th>
                                                        <th>Selling Price</th>
                                                        <th>Available Stock</th>
                                                        <th>State</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {this.UserListL()}
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div>
                                    <h3 className="sp_head">List of Other Items</h3>
                                    <form>
                                        <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                            <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                        </div>
                                    </form>
                                    <div className="sp_table">
                                        <form>
                                            <table className="table table-striped" style={{ marginTop: 20 }} >
                                                <thead>
                                                    <tr>
                                                        <th>P.ID</th>
                                                        <th>P.Name</th>
                                                        <th>Selling Price</th>
                                                        <th>Available Stock</th>
                                                        <th>State</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {this.UserListO()}
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default salesStocks;