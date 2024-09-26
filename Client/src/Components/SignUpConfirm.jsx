import React, { Component } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Navigate } from 'react-router-dom';

export default class SignUpConfirm extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      redirectToLoginPage: false,
    };
  }

  // Handles e-mail verify processes
  handleVerify = (values) => {
    let { verifyNumber } = values;
  
    fetch("/verify-number")
      .then(res => res.json())
      .then(data => {
        let intVerifyNumber = parseInt(verifyNumber);
        if (intVerifyNumber === data.random_number) {
          fetch("/users-temp")
            .then(res => res.json())
            .then(user => {
  
              fetch("/users", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: user.users[0].name,
                  lastName: user.users[0].lastName,
                  email: user.users[0].eMail,
                  password: user.users[0].password,
                }),
              })
              .then(res => res.json())
              .then(response => {
  
                fetch(`/users-temp?name=${encodeURIComponent(user.users[0].name)}&lastName=${encodeURIComponent(user.users[0].lastName)}&eMail=${encodeURIComponent(user.users[0].eMail)}&password=${encodeURIComponent(user.users[0].password)}`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                })
                .then(() => {
                  this.setState({
                    redirectToLoginPage: true
                  });
                  notification.success({ message: 'You are being redirected to the login page!' });
                })
                .catch(error => {
                  console.error('Error deleting temp user data:', error);
                  notification.error({ message: 'Failed to delete temporary user data.' });
                });
              })
              .catch(error => {
                console.error('Error posting user data:', error);
                notification.error({ message: 'Failed to verify user.' });
              });
            });
        } else {
          notification.error({ message: 'Please enter the correct code!' });
        }
      });
  }

  render() {
    let { redirectToLoginPage } = this.state;

    if (redirectToLoginPage) {
      return <Navigate to="/" />;
    }

    return (
      <div className="login-screen">
        <div className="login-form-container">
          <h1>Verify your Email</h1>
          <Form
            name="verify"
            onFinish={this.handleVerify}
            className="verify-form"
          >
            <Form.Item
              name="verifyNumber"
              rules={[{ required: true, message: 'Please input six digit verification number!' }]}
            >
              <Input placeholder="Verification code" />
            </Form.Item>

            <div className="button-group">
              <Form.Item>
                <Button type="default" htmlType="submit">
                  Verify
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
