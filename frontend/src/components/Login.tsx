import React from 'react';
import "../styling/Login.scss";

class Login extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

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
        //TODO
    }

    render() {
        return (
            <div className="login-form">
                <label>
                    Username:
              <input
                        name="username"
                        type="input"
                        onChange={this.handleInputChange} />
                </label>
                <label>
                    Password:
              <input
                        name="password"
                        type="password"
                        onChange={this.handleInputChange} />
                </label>
                <div className="button-area">
                    <button onClick={this.submit}>Login</button>
                    <button>Register</button>
                </div>
            </div>
        );
    }
}

export default Login