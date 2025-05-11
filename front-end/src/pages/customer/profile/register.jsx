import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../services/api';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      await authApi.register(values);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Đăng ký tài khoản</Title>
      <Form form={form} layout="vertical" onFinish={handleRegister}>
        <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item name="soDienThoai" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }, { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}>
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng ký
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </div>
      </Form>
    </div>
  );
};

export default Register;
