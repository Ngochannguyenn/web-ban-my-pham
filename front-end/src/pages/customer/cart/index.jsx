import { Table, Button, InputNumber, Typography, Space, Row, Col, Card, Image, message, Modal } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

const { Title } = Typography;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Image src={record.image} alt={record.name} width={50} />
          <div>
            <div>{record.name}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          max={99}
          value={record.soLuong}
          onChange={(value) => {
            if (value) {
              updateQuantity(record.id, value);
            }
          }}
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => `${(record.price * record.soLuong).toLocaleString()}₫`,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const handleCheckout = () => {
    if (!cart.length) {
      message.warning('Giỏ hàng trống');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div>
      <Title level={2}>Giỏ hàng</Title>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={3} style={{ color: '#999' }}>Giỏ hàng trống</Title>
          <Button 
            type="primary" 
            size="large" 
            icon={<ShoppingOutlined />}
            onClick={() => navigate('/products')}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <Row gutter={24}>
          <Col span={18}>
            <Table
              columns={columns}
              dataSource={cart}
              rowKey="id"
              pagination={false}
            />
          </Col>
          <Col span={6}>
            <Card title="Tóm tắt đơn hàng" style={{ position: 'sticky', top: 24 }}>
              <p>
                <strong>Tổng số lượng:</strong>{' '}
                {cart.reduce((sum, item) => sum + item.soLuong, 0)}
              </p>
              <p>
                <strong>Tổng tiền:</strong> {total.toLocaleString()}₫
              </p>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingOutlined />}
                  block
                  onClick={handleCheckout}
                >
                  Thanh toán
                </Button>
                <Button 
                  danger 
                  block
                  onClick={() => {
                    Modal.confirm({
                      title: 'Xóa giỏ hàng',
                      content: 'Bạn có chắc muốn xóa toàn bộ giỏ hàng?',
                      okText: 'Đồng ý',
                      okType: 'danger',
                      cancelText: 'Hủy',
                      onOk: clearCart
                    });
                  }}
                >
                  Xóa giỏ hàng
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Cart;
