import React, {useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import {DataGrid} from '@mui/x-data-grid';
import {SERVER_URL} from '../constants.js'
import { Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";


// NOTE:  for OAuth security, http request must have
//   credentials: 'include'
//

class NewAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected: 0, assignments: [],
            modal: false,
            name: "",
            assignmentName: "",
            course: "",
            dueDate: null

        };
    };

    componentDidMount() {
        this.fetchAssignments();
    }

//////Form Component
    handleChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        this.setState({ name: this.state.modalInputName });
        this.modalClose();
    }

    modalOpen() {
        this.setState({ modal: true });
    }

    modalClose() {
        this.setState({
            modalInputName: "",
            modal: false
        });
    }



//////

    render() {
        const [dueDate, setDueDate] = useState(new Date());
        return (
            // <div>
                <div className="form-popup" id={"myForm"}>
                    <Modal show={this.state.modal} handleClose={e => this.modalClose(e)}>
                        <h2>Hello Modal</h2>
                        <div className="form-group">
                            <label>Enter Name:</label>
                            <input
                                type="text"
                                value={this.state.assignmentName}
                                name="modalInputName"
                                onChange={e => this.handleChange(e)}
                                className="form-control"
                            />
                            <input
                                type="text"
                                value={this.state.course}
                                name="assignmentName"
                                onChange={e => this.handleChange(e)}
                                className="form-control"
                            />

                            <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} />
                        </div>
                        <div className="form-group">
                            <button onClick={e => this.handleSubmit(e)} type="button">
                                Submit
                            </button>
                        </div>
                    </Modal>
                </div>
            // </div>
        )
    }
}

export default NewAssignment;