import React from 'react';
import _ from 'lodash';

import ToggleDisplay from './toggle-display';

export default class Header extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      showLoginForm: false,
      username: '',
      password: '',
    }
  }

  handleLogin = (e) => {
    e.preventDefault();

    this.setState({showLoginForm: false});

    this.props.onLogin({
      username: this.state.username,
      password: this.state.password
    });
  }

  handleClick = () => {
    this.setState({ showLoginForm: ! this.state.showLoginForm});
  }

  handleUsernameChange = (event) => {
    this.setState({username: event.target.value});
  }

  handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  render() {
   let loginText =_.isUndefined(this.props.username)? "Login" : this.props.username;

   return (
      <div>
        <div id="header" className="row">
          <div className="col-xs-4"> <h1 id="bop_header" className="pull-left"> Bop </h1>
            <h2 id="seattle_header" className="pull-left"> {this.props.playlist.substring(0,10)} </h2>
          </div>
          <div className="col-xs-3 col-xs-offset-5">
            <h3 className="pull-right pointer" onClick={this.handleClick}> {loginText} </h3>
            <ToggleDisplay show={this.state.showLoginForm}>
              <div className="dropdown-menu" style={{padding: '17px'}}>
                <form>
                  <input type="text" placeholder="username" value={this.state.username} onChange={this.handleUsernameChange} />
                  <input type="password" placeholder="password" value={this.state.password} onChange={this.handlePasswordChange} />
                  <input type="submit" style={{display: 'none'}}  onClick={this.handleLogin}/>
                </form>
              </div>
            </ToggleDisplay>
          </div>
        </div>
      </div>
    );
  }
}

