// src/App.js
import React, { Component } from 'react';
import { Layout, Form, Input, Button, List, Card, notification, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'antd/dist/reset.css';
import './App.css';
import LoginScreen from './Components/LoginScreen';
import SignUpScreen from './Components/SignUpScreen';
import Main from './Components/Main';
import SignUpConfirm from './Components/SignUpConfirm';
import Profile from './Components/Profile';

let { Header, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { users: [] },
      name: '',
      lastName: '',
      updateName: '',
      updateLastName: '',
      updatePassword: '',
      isUpdating: false,
      updateId: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    this.setState({ loading: true });
    fetch("/users")
      .then(res => res.json())
      .then(data => {
        this.setState({ data, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
        notification.error({ message: 'Failed to fetch users.' });
      });
  };

  handleInputChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (values) => {
    let { name, lastName, eMail, password } = values;
    let newUser = { name, lastName, eMail, password };

    fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
    .then(res => res.json())
    .then(() => {
      this.setState(prevState => ({
        data: { users: [...prevState.data.users, newUser] },
        name: '',
        lastName: '',
        eMail: '',
        password: '',
      }));
      notification.success({ message: 'User added successfully.' });
    })
    .catch(() => {
      notification.error({ message: 'Failed to add user.' });
    });
  };

  handleDelete = (name, lastName, eMail, password) => {
    fetch("/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lastName, eMail, password }),
    })
    .then(res => res.json())
    .then(() => {
      this.fetchUsers();
      notification.success({ message: 'User deleted successfully.' });
    })
    .catch(() => {
      notification.error({ message: 'Failed to delete user.' });
    });
  };

  handleUpdate = (name, lastName, eMail, password) => {
    this.setState({
      isUpdating: true,
      updateName: name,
      updateLastName: lastName,
      updateEmail: eMail,
      updatePassword: password,
      updateId: `${name}-${lastName}-${eMail}-${password}`
    });
  };

  handleUpdateSubmit = (values) => {
    let { updateId } = this.state;
    let [name, lastName, eMail, password] = updateId.split('-');
    let updatedUser = { name: values.updateName, lastName: values.updateLastName, eMail: values.updateEmail, password: values.updatePassword };

    fetch("/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lastName, eMail, password, newData: updatedUser }),
    })
    .then(res => res.json())
    .then(() => {
      this.setState({ isUpdating: false, updateName: '', updateLastName: '', updateEmail: '', updatePassword: '', updateId: null });
      this.fetchUsers();
      notification.success({ message: 'User updated successfully.' });
    })
    .catch(() => {
      notification.error({ message: 'Failed to update user.' });
    });
  };

  render() {
    let { data, name, lastName, eMail, password, updateName, updateLastName, updateEmail, updatePassword, isUpdating, loading } = this.state;

    return (
      <Router>
        <Routes>
          <Route
            path="/admin-page"
            element={
              <Layout className="layout">
                <Header className="header">
                  <div className="logo">Admin Page</div>
                </Header>
                <Content className="content">
                  <div className="app-container">
                    <div className="form-container">
                      <Form
                        layout="inline"
                        onFinish={this.handleSubmit}
                        style={{ marginBottom: '20px' }}
                      >
                        <Form.Item name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
                          <Input placeholder="Name" />
                        </Form.Item>

                        <Form.Item name="lastName" rules={[{ required: true, message: 'Please input the last name!' }]}>
                          <Input placeholder="Last Name" />
                        </Form.Item>

                        <Form.Item name="eMail" rules={[{ required: true, message: 'Please input the e mail!' }]}>
                          <Input placeholder="E Mail" />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
                          <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item>

                          <Button 
                            id='addUser' 
                            type="primary" 
                            htmlType="submit"
                            style={{
                              marginTop: '10px',
                              marginLeft: '10px',
                            }}
                          >Add User
                          </Button>
                        </Form.Item>
                      </Form>

                      {isUpdating && (
                        <Form
                          layout="inline"
                          onFinish={this.handleUpdateSubmit}
                          style={{ marginBottom: '20px' }}
                        >
                          <Form.Item name="updateName" initialValue={updateName} rules={[{ required: true, message: 'Please input the updated name!' }]}>
                            <Input placeholder="Update Name" />
                          </Form.Item>
                          <Form.Item name="updateLastName" initialValue={updateLastName} rules={[{ required: true, message: 'Please input the updated last name!' }]}>
                            <Input placeholder="Update Last Name" />
                          </Form.Item>
                          <Form.Item name="updateEmail" initialValue={updateEmail} rules={[{ required: true, message: 'Please input the updated e mail!' }]}>
                            <Input placeholder="Update E Mail" />
                          </Form.Item>
                          <Form.Item name="updatePassword" initialValue={updatePassword} rules={[{ required: true, message: 'Please input the updated password!' }]}>
                            <Input.Password 
                            style={{width: "180px"}} 
                            placeholder="Update Password" />
                          </Form.Item>
                          <Form.Item>
                            <Button 
                              type="primary" 
                              htmlType="submit"
                              style={{
                                marginTop: '10px',
                                marginLeft: '10px',
                              }}
                            >Update User
                            </Button>
                            <Button 
                            style={{
                              marginTop: '10px',
                              marginLeft: '10px',
                            }}
                            onClick={() => this.setState({ isUpdating: false })}
                            >Cancel</Button>
                          </Form.Item>
                        </Form>
                      )}

                      {loading ? (
                        <Spin size="large" />
                      ) : (
                        <List
                          grid={{ gutter: 16, column: 1 }}
                          dataSource={data.users}
                          renderItem={user => (
                            <List.Item>
                              <Card
                                title={`${user.name} ${user.lastName}`}
                                actions={[
                                  <EditOutlined 
                                    key="edit" 
                                    style={{ color: "#ff9f00" }}
                                    onClick={() => this.handleUpdate(user.name, user.lastName, user.eMail, user.password)} />,
                                  <DeleteOutlined
                                    key="delete"
                                    style={{ color: "red" }}
                                    onClick={() => this.handleDelete(user.name, user.lastName, user.eMail, user.password)}
                                  />,
                                ]}
                              >
                                <p>Name: {user.name}</p>
                                <p>Last Name: {user.lastName}</p>
                                <p>E Mail: {user.eMail}</p>
                              </Card>
                            </List.Item>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </Content>
              </Layout>
            }
          />
          <Route path="/" element={<LoginScreen />} />
          <Route path="/sign-up" element={<SignUpScreen />} />
          <Route path="/sign-up-confirm" element={<SignUpConfirm />} />
          <Route path="/main" element={<Main />} />
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </Router>
    );
  }
}

export default App;
