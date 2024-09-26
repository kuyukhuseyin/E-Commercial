import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Upload, message, Button, Spin } from 'antd';
import { UserOutlined, EditOutlined, LeftOutlined, LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {
  let [avatarUrl, setAvatarUrl] = useState('');
  let [loading, setLoading] = useState(true);
  let location = useLocation();
  let navigate = useNavigate();
  let user = location.state?.user;

  useEffect(() => {
    let timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handles changing profile photo
  let handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj));
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Handle log out
  let handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dadcf2'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#dadcf2',
      position: 'relative'
    }}>
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate('/main')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
          border: 'none',
          backgroundColor: '#fff',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}
      />

      <Card style={{ width: 400, position: 'relative', paddingBottom: 60 }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={avatarUrl || null}
          />
          <Upload
            showUploadList={false}
            onChange={handleAvatarChange}
            accept="image/*"
          >
            <EditOutlined
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                cursor: 'pointer',
                fontSize: '20px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                padding: '4px',
                boxShadow: '0 0 5px rgba(0,0,0,0.3)'
              }}
            />
          </Upload>
        </div>

        <Card.Meta
          title={user ? user.name : "Guest"}
          description={user ? user.job : "Software Developer"}
          style={{ textAlign: 'center', marginTop: 10 }}
        />

        <Descriptions style={{ marginTop: 20 }} bordered column={1}>
          <Descriptions.Item label="Username">{user ? user.name : "Unknown"}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{user ? user.lastName : "Unknown"}</Descriptions.Item>
          <Descriptions.Item label="Email">{user ? user.eMail : "Unknown"}</Descriptions.Item>
        </Descriptions>

        <Button
          danger="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 1,
          }}
        >
          Log out
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
