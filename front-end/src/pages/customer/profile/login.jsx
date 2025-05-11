import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../services/api';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const user = await authApi.login(values);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('Đăng nhập thành công!');
      navigate('/checkout');
    } catch (error) {
      message.error(error.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #f0f1f2', padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Đăng nhập</Title>
      <Form form={form} layout="vertical" onFinish={handleLogin}>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
          <Input placeholder="Nhập email" size="large" />
        </Form.Item>
        <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
          <Input.Password placeholder="Nhập mật khẩu" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Đăng nhập
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          Chưa có tài khoản? <a onClick={() => navigate('/register')}>Đăng ký</a>
        </div>
      </Form>
    </div>
  );
};

export default Login;
