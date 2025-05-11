import { useState, useEffect } from 'react';
import { Table, Space, Button, message, Typography, Form, Input, Empty, Card, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { customerApi } from '../../../services/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerApi.getAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Không cho phép thêm khách hàng mới
  // Chỉ cho phép sửa và xóa
  const handleSubmit = async (values) => {
    try {
      const trimmedValues = Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: typeof values[key] === 'string' ? values[key].trim() : values[key]
      }), {});
      if (editingCustomer) {
        await customerApi.updateCustomer(editingCustomer.maKhachHang, trimmedValues);
        message.success('Cập nhật thông tin khách hàng thành công');
        setIsModalVisible(false);
        form.resetFields();
        setEditingCustomer(null);
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle customer deletion
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await customerApi.deleteCustomer(record.maKhachHang);
      message.success('Xóa khách hàng thành công');
      await fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      message.error('Xóa khách hàng thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      sorter: (a, b) => (a.hoTen || '').localeCompare(b.hoTen || ''),
      render: (text) => text || '--',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || '--',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      render: (text) => text || '--',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      ellipsis: true,
      render: (text) => text || '--',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Ẩn nút thêm khách hàng
  const renderEmptyState = () => (
    <Card style={{ textAlign: 'center', padding: '24px' }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span>Chưa có khách hàng nào.</span>}
      />
    </Card>
  );

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16 
      }}>
        <Title level={2}>Quản Lý Khách Hàng</Title>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={customers}
        rowKey="maKhachHang"
        locale={{
          emptyText: renderEmptyState()
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khách hàng`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title={'Sửa Thông Tin Khách Hàng'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCustomer(null);
        }}
        footer={null}
        maskClosable={false}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editingCustomer}
        >
          <Form.Item
            name="hoTen"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên khách hàng' },
              { whitespace: true, message: 'Họ tên không được để trống' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
              { whitespace: true, message: 'Email không được để trống' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="soDienThoai"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="diaChi"
            label="Địa chỉ"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ' },
              { whitespace: true, message: 'Địa chỉ không được để trống' }
            ]}
          >
            <Input.TextArea 
              prefix={<HomeOutlined />} 
              rows={3}
              placeholder="Nhập địa chỉ"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingCustomer(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCustomers;
