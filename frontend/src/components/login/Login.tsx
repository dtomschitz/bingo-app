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

    render() {
        return (
            <div className="login-form">
                <label>
                    Username:
                <input
                        name="username"
                        id="username"
                        type="input"
                        onChange={this.handleInputChange} />
                </label>
                <label>
                    Password:
              <input
                        name="password"
                        id="password"
                        type="password"
                        onChange={this.handleInputChange} />
                </label>
                <div className="button-area">
                    <button onClick={this.routeChange}>Login</button>
                    <button>Register</button>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);