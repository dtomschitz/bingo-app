import React from 'react';
import { withRouter } from "react-router-dom";
import "../../styling/login/Login.scss";

class Login extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.routeChange = this.routeChange.bind(this);
        this.goToRegister = this.goToRegister.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event: any) {
        const target = event.target;
        const name = target.name;

        this.setState((state: any) => {
            return { [name]: target.value }
        });
    }

    submit(event: any) {
    }

    routeChange() {
        let path = `app`;
        this.props.history.push(path);
    }

    goToRegister() {
        let path = `register`;
        this.props.history.push(path);
    }

    render() {
        return (
            <div className="login-form">
                <div className="login-input">
                    <span>Username:</span>
                <input
                        name="username"
                        id="username"
                        type="input"
                        onChange={this.handleInputChange} />
                </div>
                <div className="login-input">
                    <span>Password:</span>
              <input
                        name="password"
                        id="password"
                        type="password"
                        onChange={this.handleInputChange} />
                </div>
                <div className="button-area">
                    <button onClick={this.routeChange}>Login</button>
                    <button onClick={this.goToRegister}>Register</button>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);