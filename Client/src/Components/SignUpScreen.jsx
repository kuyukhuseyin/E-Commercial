// src/Components/SignUpScreen.jsx
import React, { Component } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Navigate } from 'react-router-dom';
import './SignUpScreen.css';

class SignUpScreen extends Component {
  state = {
    redirectToLoginPage: false,
  };

  //Handles sign up process and posts data to db
  handleSubmit = (values) => {
    let { name, lastName, eMail, password } = values;
    let newUser = { name, lastName, eMail, password };

    fetch("/users-temp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
    .then(res => res.json())
    .then(() => {
      notification.success({ message: 'Sign up successful!' });
      this.setState({ redirectToLoginPage: true });
    })
    .catch(() => {
      notification.error({ message: 'Failed to sign up. Please try again.' });
    });
  };

  render() {
    let { redirectToLoginPage } = this.state;

    if (redirectToLoginPage) {
      return <Navigate to="/sign-up-confirm" />;
    }

    return (
      <div className="sign-up-screen">
        <div className="sign-up-form-container">
          <div className="logo-container">
            <img src='/logos/infinitedeals-high-resolution-logo-transparent.png' alt="Logo" className="logo" />
          </div>

          <Form
            name="signUp"
            onFinish={this.handleSubmit}
            className="sign-up-form"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
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
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignUpScreen;
