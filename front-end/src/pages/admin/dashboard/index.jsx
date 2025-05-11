import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const AdminDashboard = () => {
  const formatCurrency = (value) => {
    return `${value.toLocaleString()}₫`;
  };

  return (
    <div>
      <Title level={2}>Trang Chủ</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng Sản Phẩm"
              value={120}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng Đơn Hàng"
              value={43}
              prefix={<OrderedListOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng Khách Hàng"
              value={25}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh Thu"
              value={9280000}
              formatter={formatCurrency}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
