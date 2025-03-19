import { Button, Form, Input } from 'antd';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKENDURL } from '../helper/Urls';
import { useAuth } from '../AuthContext'; // Import useAuth
import { AlertContext } from '../context/AlertContext'; // Assuming you have this

const Auth = () => {
  const [loginPage, setLoginPage] = useState(true);
  const { openNotification } = useContext(AlertContext);
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const HandleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BACKENDURL}/auth/login`, {
        email: values.email,
        password: values.password,
      });
      localStorage.setItem('ERPUSER_Token', res.data.token);
      openNotification('Success', 'Login Success', 3, 'green');
      login(res.data.owner); // Call login with owner data from response
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      openNotification('Error', error.response.data.message, 3, 'red');
      setLoading(false);
    }
  };

  const HandelPasswordReset = async (values) => {
    setLoading(true);
    try {
      // const res=await axios.post(`${BACKENDURL}/auth/forgot`,{email:values.email})
      setLoginPage(true);
      openNotification('Success', 'Check your Email', 3, 'green');
      setLoading(false);
    } catch (error) {
      openNotification('Error', error.response.data.message, 3, 'red');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        background: 'rgb(14,51,93)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: '100',
      }}
    >
      {loginPage ? (
        <Form
          layout="vertical"
          name="login"
          style={{
            width: '400px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '600px',
          }}
          onFinish={HandleLogin}
          autoComplete="on"
          autoFocus="true"
        >
          <span style={{ fontSize: '30px', fontWeight: 'bold', margin: '10px 0' }}>
            Login Page
          </span>
          <Form.Item
            label="Email"
            name="email"
            style={{ margin: '5px 0', width: '70%' }}
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            style={{ margin: '5px 0', width: '70%' }}
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button
            style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
            type="link"
            onClick={() => setLoginPage(false)}
          >
            Forgot Password?
          </Button>
          <Form.Item style={{ display: 'flex', justifyContent: 'center', margin: '5px 0', width: '70%' }}>
            <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          layout="vertical"
          name="login"
          style={{
            width: '400px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '400px',
          }}
          autoComplete="on"
          onFinish={HandelPasswordReset}
          autoFocus="true"
        >
          <span style={{ fontSize: '30px', fontWeight: 'bold', margin: '10px 0' }}>
            Reset Password
          </span>
          <Form.Item
            label="Email"
            name="email"
            style={{ margin: '5px 0', width: '70%' }}
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button
            style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
            type="link"
            onClick={() => setLoginPage(true)}
          >
            Back to Login
          </Button>
          <Form.Item style={{ display: 'flex', justifyContent: 'center', margin: '5px 0', width: '70%' }}>
            <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Auth;