import React from 'react';
import { withRouter } from "react-router-dom";
import "../../styling/login/Login.scss";

class Register extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.onCancel = this.onCancel.bind(this);
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
        alert("TODO: Daten verarbeiten");
    }

    onCancel() {
        let path = `login`;
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
                <div className="login-input">
                    <span>Confirm Password:</span>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        onChange={this.handleInputChange} />
                </div>
                <div className="button-area">
                    <button onClick={this.submit}>Register</button>
                    <button onClick={this.onCancel}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);