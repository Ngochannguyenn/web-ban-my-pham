import { useState, useEffect } from 'react';
import { Steps, Form, Input, Button, Row, Col, Card, Radio, Space, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { orderApi } from '../../../services/api';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderForm] = Form.useForm();
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();

  // Lấy user từ localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      message.warning('Vui lòng đăng nhập để thanh toán!');
      navigate('/login');
    } else {
      // Tự động điền thông tin khách hàng nếu có
      orderForm.setFieldsValue({
        fullName: user.hoTen,
        email: user.email,
        phone: user.soDienThoai,
        address: user.diaChi,
      });
    }
    // eslint-disable-next-line
  }, []);

  const steps = [
    { title: 'Thông tin khách hàng', content: 'customer-info' },
    { title: 'Vận chuyển', content: 'shipping' },
    { title: 'Thanh toán', content: 'payment' },
  ];

  const handleSubmit = async () => {
    if (!cart.length) {
      message.error('Giỏ hàng trống');
      return;
    }
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const orderData = {
        maKhachHang: user?.maKhachHang, // chỉ gửi mã khách hàng
        ngayDat: new Date().toISOString().slice(0, 10),
        tongTien: total + 5000, // mặc định phí ship 5k
        phuongThucThanhToan: 'cod', // mặc định
        phuongThucVanChuyen: 'standard', // mặc định
        trangThai: 'pending',
        chiTietDonHangs: cart.map(item => ({
          maSanPham: item.id,
          soLuong: item.soLuong,
          gia: item.price
        }))
      };
  
      await orderApi.createOrder(orderData);
      clearCart();
      message.success('Đặt hàng thành công!');
      navigate('/');
    } catch {
      message.error('Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    try {
      await orderForm.validateFields();
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
        message.error('Đặt hàng thất bại. Vui lòng thử lại.' + error);
    }
  };

  const prev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const CustomerInfoForm = () => (
    <Row gutter={24}>
      <Col span={16}>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ giao hàng"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ giao hàng" />
        </Form.Item>
      </Col>
    </Row>
  );

  const ShippingForm = () => (
    <Form.Item
      name="shippingMethod"
      rules={[{ required: true, message: 'Vui lòng chọn phương thức vận chuyển' }]}
    >
      <Radio.Group>
        <Space direction="vertical">
          <Radio value="standard">
            <Card>
              <h4>Giao hàng tiêu chuẩn</h4>
              <p>3-5 ngày làm việc</p>
              <p>5.000₫</p>
            </Card>
          </Radio>
          <Radio value="express">
            <Card>
              <h4>Giao hàng nhanh</h4>
              <p>1-2 ngày làm việc</p>
              <p>15.000₫</p>
            </Card>
          </Radio>
        </Space>
      </Radio.Group>
    </Form.Item>
  );

  const PaymentForm = () => (
    <Form.Item
      name="paymentMethod"
      rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
    >
      <Radio.Group>
        <Space direction="vertical">
          <Radio value="cod">
            <Card>
              <h4>Thanh toán khi nhận hàng</h4>
              <p>Thanh toán khi nhận hàng</p>
            </Card>
          </Radio>
          <Radio value="bank_transfer">
            <Card>
              <h4>Chuyển khoản ngân hàng</h4>
              <p>Thanh toán qua chuyển khoản</p>
            </Card>
          </Radio>
        </Space>
      </Radio.Group>
    </Form.Item>
  );

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={24}>
        <Col span={16}>
          <Card>
            <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />
            
            <Form
              form={orderForm}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                shippingMethod: 'standard',
                paymentMethod: 'cod'
              }}
            >
              {currentStep === 0 && <CustomerInfoForm />}
              {currentStep === 1 && <ShippingForm />}
              {currentStep === 2 && <PaymentForm />}

              <div style={{ marginTop: 24 }}>
                <Space>
                  {currentStep > 0 && (
                    <Button onClick={prev}>Trước</Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button type="primary" onClick={next}>Tiếp</Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button type="primary" htmlType="submit" loading={loading} style={{display: 'inline-block'}} onClick={() => {
                      orderForm
                        .validateFields()
                        .then(() => orderForm.submit())
                        .catch(() => message.error('Vui lòng điền đầy đủ thông tin!'));
                    }}>
                      Đặt hàng
                    </Button>
                  )}
                </Space>
              </div>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Tóm tắt đơn hàng">
            {cart.map((item) => (
              <div key={item.id} style={{ marginBottom: 16 }}>
                <Row justify="space-between">
                  <Col>{item.name}</Col>
                  <Col>x{item.soLuong}</Col>
                  <Col>{(item.price * item.soLuong).toLocaleString()}₫</Col>
                </Row>
              </div>
            ))}
            <Divider />
            <Row justify="space-between">
              <Col>Tạm tính:</Col>
              <Col>{total.toLocaleString()}₫</Col>
            </Row>
            <Row justify="space-between" style={{ marginTop: 8 }}>
              <Col>Phí vận chuyển:</Col>
              <Col>
                {orderForm.getFieldValue('shippingMethod') === 'express' ? '15.000₫' : '5.000₫'}
              </Col>
            </Row>
            <Divider />
            <Row justify="space-between" style={{ fontWeight: 'bold' }}>
              <Col>Tổng cộng:</Col>
              <Col>
                {(total + (orderForm.getFieldValue('shippingMethod') === 'express' ? 15000 : 5000)).toLocaleString()}₫
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
