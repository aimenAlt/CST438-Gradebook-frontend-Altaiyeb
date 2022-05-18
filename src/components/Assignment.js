import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import {DataGrid} from '@mui/x-data-grid';
import {SERVER_URL} from '../constants.js'
import { Modal } from 'react-bootstrap';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

class Assignment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {selected: 0, assignments: [],
          modal: false,
          name: "",
          modalInputName: ""
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
  fetchAssignments = () => {
    console.log("Assignment.fetchAssignments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}/gradebook`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token }
      } )
    .then((response) => response.json()) 
    .then((responseData) => { 
      if (Array.isArray(responseData.assignments)) {
        //  add to each assignment an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
        this.setState({ assignments: responseData.assignments.map((assignment, index) => ( { id: index, ...assignment } )) });
      } else {
        toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }        
    })
    .catch(err => console.error(err)); 
  }
  
   onRadioClick = (event) => {
    console.log("Assignment.onRadioClick " + event.target.value);
    this.setState({selected: event.target.value});
  }
  
  render() {
     const columns = [
      {
        field: 'assignmentName',
        headerName: 'Assignment',
        width: 400,
        renderCell: (params) => (
          <div>
          <Radio
            checked={params.row.id == this.state.selected}
            onChange={this.onRadioClick}
            value={params.row.id}
            color="default"
            size="small"
          />
          {params.value}
          </div>
        )
      },
      { field: 'courseTitle', headerName: 'Course', width: 300 },
      { field: 'dueDate', headerName: 'Due Date', width: 200 }
      ];
      
      const assignmentSelected = this.state.assignments[this.state.selected];
      return (
          <div>
              <div align="right">
                  <Button component={Link} to={{pathname:'/new-assignment' }}
                      onClick={e => this.modalOpen(e)} variant="outlined" color="primary"  style={{margin: 10}}>
                      New Assignment
                  </Button>
              </div>
              {/*<div className="form-popup" id={"myForm"}>*/}
              {/*    <Modal show={this.state.modal} handleClose={e => this.modalClose(e)}>*/}
              {/*        <h2>Hello Modal</h2>*/}
              {/*        <div className="form-group">*/}
              {/*            <label>Enter Name:</label>*/}
              {/*            <input*/}
              {/*                type="text"*/}
              {/*                value={this.state.modalInputName}*/}
              {/*                name="modalInputName"*/}
              {/*                onChange={e => this.handleChange(e)}*/}
              {/*                className="form-control"*/}
              {/*            />*/}
              {/*        </div>*/}
              {/*        <div className="form-group">*/}
              {/*            <button onClick={e => this.handleSubmit(e)} type="button">*/}
              {/*                Save*/}
              {/*            </button>*/}
              {/*        </div>*/}
              {/*    </Modal>*/}
              {/*</div>*/}
              <div align="left" >
                  <h4>Assignment(s) ready to grade: </h4>
                  <div style={{ height: 450, width: '100%', align:"left"   }}>
                      <DataGrid rows={this.state.assignments} columns={columns} />
                  </div>
                  <Button component={Link} to={{pathname:'/gradebook',   assignment: assignmentSelected }}
                          variant="outlined" color="primary" disabled={this.state.assignments.length===0}  style={{margin: 10}}>
                      Grade
                  </Button>
                  <ToastContainer autoClose={1500} />
              </div>
          </div>
      )
  }
}  

export default Assignment;