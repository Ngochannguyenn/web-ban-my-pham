import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message, Typography, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { categoryApi } from '../../../services/api';

const { Title } = Typography;

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleSubmit = async (values) => {
    try {
      const trimmedValues = {
        tenLoaiSanPham: values.tenLoaiSanPham.trim()
      };

      if (editingCategory) {
    
        await categoryApi.updateCategory(editingCategory.maLoaiSanPham, trimmedValues);
        message.success('Cập nhật loại sản phẩm thành công');
        setIsModalVisible(false);
        form.resetFields();
        setEditingCategory(null);
        fetchCategories();
      } else {
        await categoryApi.createCategory(trimmedValues);
        message.success('Thêm loại sản phẩm mới thành công');
        setIsModalVisible(false);
        form.resetFields();
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (error) {
      message.error('Thao tác không thành công. Vui lòng thử lại!');
      console.error('Error submitting form:', error);
    }
  };
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const response = await categoryApi.deleteCategory(id);
      if (response) {
        message.success('Xóa loại sản phẩm thành công');
        setCategories(prev => prev.filter(category => category.maLoaiSanPham !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      
      if (error.response?.status === 400) {
        // Handle specific backend error message
        message.error(error.response.data.message || 'Xóa không thành công. Vui lòng thử lại!');
      } else {
        message.error('Xóa không thành công. Vui lòng thử lại!');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      title: 'Mã Loại',
      dataIndex: 'maLoaiSanPham',
      key: 'maLoaiSanPham',
    },
    {
      title: 'Tên Loại Sản Phẩm',
      dataIndex: 'tenLoaiSanPham',
      key: 'tenLoaiSanPham',
      sorter: (a, b) => (a.tenLoaiSanPham || '').localeCompare(b.tenLoaiSanPham || ''),
      render: (text) => text || '--',
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
            disabled={deletingId === record.maLoaiSanPham}
          >
            Sửa
          </Button>          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.maLoaiSanPham)}
            loading={deletingId === record.maLoaiSanPham}
            disabled={deletingId !== null}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const renderEmptyState = () => (
    <div style={{ textAlign: 'center', padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        Chưa có loại sản phẩm nào. Bấm nút "Thêm Loại Sản Phẩm" để thêm mới.
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingCategory(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
      >
        Thêm Loại Sản Phẩm
      </Button>
    </div>
  );

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16 
      }}>
        <Title level={2}>Quản Lý Loại Sản Phẩm</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm Loại Sản Phẩm
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={categories}
        rowKey="maLoaiSanPham"
        locale={{
          emptyText: renderEmptyState()
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} loại sản phẩm`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title={editingCategory ? 'Sửa Loại Sản Phẩm' : 'Thêm Loại Sản Phẩm Mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        footer={null}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editingCategory}
        >
          <Form.Item
            name="tenLoaiSanPham"
            label="Tên Loại Sản Phẩm"
            rules={[
              { required: true, message: 'Vui lòng nhập tên loại sản phẩm' },
              { whitespace: true, message: 'Tên loại sản phẩm không được để trống' },
              { min: 2, message: 'Tên loại sản phẩm phải có ít nhất 2 ký tự' },
              { max: 50, message: 'Tên loại sản phẩm không được vượt quá 50 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên loại sản phẩm" />
          </Form.Item>

          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingCategory(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
