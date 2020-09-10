import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../viewlist.css';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import {withRouter} from 'react-router-dom'


class DepartmentList extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const {cookies} = props;
    this.state = {department: [],csrfToken: cookies.get('XSRF-TOKEN') , isLoading: true};
    this.remove = this.remove.bind(this);
  }
  

  componentDidMount() {
    this.setState({isLoading: true});
    fetch('../api/department',{credentials: 'include'})
      .then(response => response.json())
      .then(data => this.setState({department: data, isLoading: false}))
      .catch(() => this.props.history.push('../'));
  }

  async remove(id) {
    await fetch(`../api/department/${id}`, {
      method: 'DELETE',
      headers: {
        'X-XSRF-TOKEN': this.state.csrfToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(() => {
      let updatedDepartments  = [...this.state.department].filter(i => i.id !== id);
      this.setState({department: updatedDepartments});
    });
  }

  render() {
    const {department, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <div className = "container  no-gutters mx-auto">
        <div className = "row no-gutters pb-5 pt-5">
          <div className = "col-4">
           
          </div>
          <div className = "col-4">
            <h5>Departments</h5>
            <hr id="hr2" />
          </div>
          <div className = "col-4">
            <Button className="btn btn-primary" color = "primary" tag={Link} to={this.props.match.path+"/" + department.id}>+</Button>
          </div>
        </div>
        <div className = "row no-gutters">
          <div className ="col-12 no-gutters pb-5">
             <ul className="list-group">
            {department.map(department =>
             <li className="list-group-item" key={department.id}> 
                {department.name} 
                <Button className="float-right" size="sm" color="primary"   tag={Link} to={this.props.match.path+"/" + department.id}>Edit</Button>
                <Button className="float-right" size="sm" color="danger" onClick={() => this.remove(department.id)}>Delete</Button>
              </li>
              
            )}
            </ul>
          </div>
          </div>
          </div>
    );
  }
}

export default withCookies(withRouter(DepartmentList));