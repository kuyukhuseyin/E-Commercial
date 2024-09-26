import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import { Navigate } from 'react-router-dom';
import './LoginScreen.css';

class LoginScreen extends Component {
  state = {
    redirectToMainPage: false,
    redirectToSignUpPage: false,
    rememberMe: false,
  };

  // Handles login process
  handleSubmit = (values) => {
    this.setState({ loading: true });
    fetch("/users")
      .then(res => res.json())
      .then(data => {
        let userFound = false;

        data.users.forEach(user => {
          if (user.eMail === values.eMail && user.password === values.password) {
            this.setState({ 
              redirectToMainPage: true,
            });
            userFound = true;
          }
        });

        if (!userFound) {
          notification.error({ message: 'Your email or password is wrong!' });
        }
      });
  };

  // Handles routing to sign up page
  handleSignUp = () => {
    this.setState({ redirectToSignUpPage: true });
  };

  // Remember me checkbox
  handleRememberMeChange = (e) => {
    this.setState({ rememberMe: e.target.checked });
  };

  render() {
    let { redirectToMainPage, redirectToSignUpPage } = this.state;

    if (redirectToMainPage) {
      return <Navigate to="/main"/>;
    }

    if (redirectToSignUpPage) {
      return <Navigate to="/sign-up" />;
    }

    return (
      <div className="login-screen">
        <div className="login-form-container">
          {/* Logo */}
          <div className="logo-container">
            <img src='/logos/infinitedeals-high-resolution-logo-transparent.png' alt="Logo" className="logo" />
          </div>

          <Form
            name="login"
            onFinish={this.handleSubmit}
            className="login-form"
          >
            <Form.Item
              name="eMail"
              rules={[{ required: true, message: 'Please input your e mail!' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Checkbox onChange={this.handleRememberMeChange}>Remember me</Checkbox>
            </Form.Item>
            <div className="button-group">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="default" onClick={this.handleSignUp}>
                  Sign Up
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginScreen;
