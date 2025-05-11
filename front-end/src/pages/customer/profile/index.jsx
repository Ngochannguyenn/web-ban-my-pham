import { useState, useEffect } from 'react';
import { Card, Tabs, Button, Form, Input, message, Table, Tag, Space, Avatar, Typography, Row, Col, Modal } from 'antd';
import { UserOutlined, ShoppingOutlined } from '@ant-design/icons';
import { customerApi, orderApi } from '../../../services/api';

const { Title } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form] = Form.useForm();

  // Fetch customer information
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual customer ID from auth context
        const customerId = 1; // This should come from authentication
        const data = await customerApi.getCustomerById(customerId);
        setCustomerInfo(data);
        form.setFieldsValue(data);
      } catch (error) {
        console.error('Failed to fetch customer information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerInfo();
  }, [form]);

  // Fetch customer orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrderLoading(true);
        // TODO: Replace with actual customer ID from auth context
        const customerId = 1; // This should come from authentication
        const data = await orderApi.getAllOrders();
        // Filter orders for current customer
        const customerOrders = Array.isArray(data) ? data.filter(order => order.customerId === customerId) : [];
        setOrders(customerOrders);
      } catch (error) {
        console.error('Failed to fetch order history:', error);
        setOrders([]);
      } finally {
        setOrderLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle profile update
  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      await customerApi.updateCustomer(customerInfo.id, values);
      message.success('Profile updated successfully');
      setCustomerInfo({ ...customerInfo, ...values });
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Date',
      dataIndex: 'ngayDatHang',
      key: 'ngayDatHang',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total Amount',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => {
        const color = 
          status === 'delivered' ? 'green' :
          status === 'processing' ? 'blue' :
          status === 'cancelled' ? 'red' : 'gold';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => {
            // Show order details modal
            Modal.info({
              title: `Order Details #${record.id}`,
              width: 600,
              content: (
                <div>
                  <p><strong>Order Date:</strong> {new Date(record.ngayDatHang).toLocaleString()}</p>
                  <p><strong>Shipping Address:</strong> {record.diaChiGiaoHang}</p>
                  <p><strong>Payment Method:</strong> {record.phuongThucThanhToan}</p>
                  <Table
                    dataSource={record.chiTietDonHang}
                    columns={[
                      {
                        title: 'Product',
                        dataIndex: 'tenSanPham',
                        key: 'tenSanPham',
                      },
                      {
                        title: 'Quantity',
                        dataIndex: 'soLuong',
                        key: 'soLuong',
                      },
                      {
                        title: 'Price',
                        dataIndex: 'donGia',
                        key: 'donGia',
                        render: (price) => `$${price.toLocaleString()}`,
                      },
                      {
                        title: 'Subtotal',
                        key: 'subtotal',
                        render: (_, item) => `$${(item.soLuong * item.donGia).toLocaleString()}`,
                      },
                    ]}
                    pagination={false}
                    rowKey="id"
                  />
                </div>
              ),
            });
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 64px)', background: '#f0f2f5' }}>
      <Row justify="center" style={{ padding: '24px' }}>
        <Col xs={24} sm={24} md={6} lg={6} xl={6} style={{ marginBottom: 24 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={120} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
              <Title level={3} style={{ margin: 0 }}>
                {customerInfo?.tenKhachHang}
              </Title>
              <div style={{ color: '#666', marginTop: 8 }}>
                {customerInfo?.email}
              </div>
              <div style={{ color: '#666', marginTop: 4 }}>
                {customerInfo?.soDienThoai}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{ marginLeft: 24 }}>
          <Card style={{ marginBottom: 24 }}>
            <Tabs defaultActiveKey="profile" style={{ marginTop: -16 }}>
              <TabPane
                tab={
                  <span>
                    <UserOutlined />
                    Profile Information
                  </span>
                }
                key="profile"
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                  initialValues={customerInfo}
                  style={{ maxWidth: 600 }}
                >
                  <Form.Item
                    name="tenKhachHang"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    name="soDienThoai"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    name="diaChi"
                    label="Address"
                    rules={[{ required: true, message: 'Please enter your address' }]}
                  >
                    <Input.TextArea rows={4} size="large" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} size="large">
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <ShoppingOutlined />
                    Order History
                  </span>
                }
                key="orders"
              >
                <Table
                  loading={orderLoading}
                  columns={orderColumns}
                  dataSource={orders}
                  rowKey="id"
                  scroll={{ x: true }}
                  pagination={{
                    pageSize: 10,
                    position: ['bottomCenter'],
                    showSizeChanger: false
                  }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
