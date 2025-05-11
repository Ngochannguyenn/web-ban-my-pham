import { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Select, Typography, Row, Col, Tag, Switch, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { productApi, categoryApi } from '../../../services/api';

const { Title } = Typography;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [imageLoading, setImageLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Không thể tải danh sách loại sản phẩm');
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelect = async (e) => {
    try {
      setImageLoading(true);
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        message.error('Vui lòng chọn file hình ảnh hợp lệ!');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        message.error('Kích thước hình ảnh không được vượt quá 2MB!');
        return;
      }

      const base64String = await convertToBase64(file);
      setPreviewImage(base64String);
      form.setFieldsValue({ hinhAnh: base64String });
    } catch (error) {
      console.error('Error handling image:', error);
      message.error('Xử lý hình ảnh thất bại. Vui lòng thử lại!');
    } finally {
      setImageLoading(false);
    }
  };

  const handleReset = () => {
    setIsModalVisible(false);
    form.resetFields();
    setPreviewImage('');
    setEditingProduct(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (!values.hinhAnh || (!editingProduct && !values.hinhAnh.startsWith('data:image/'))) {
        message.error('Vui lòng chọn hình ảnh cho sản phẩm!');
        return;
      }      const submitData = {
        tenSanPham: values.tenSanPham.trim(),
        giaSanPham: values.giaSanPham,
        soLuongSanPham: values.soLuongSanPham,
        moTa: values.moTa.trim(),
        hinhAnh: values.hinhAnh,
        maLoaiSanPham: values.maLoaiSanPham,
        active: Boolean(values.active)
      };

      if (editingProduct) {
        // For update, only include new image if one was selected
        if (!submitData.hinhAnh.startsWith('data:image/')) {
          submitData.hinhAnh = editingProduct.hinhAnh;
        }
        await productApi.updateProduct(editingProduct.maSanPham, submitData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await productApi.createProduct(submitData);
        message.success('Thêm sản phẩm mới thành công');
      }
      handleReset();
      fetchProducts();
    } catch (error) {
      console.error('Operation failed:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Thao tác thất bại. Vui lòng thử lại');
      }
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      const res = await productApi.deleteProduct(id);
      // If API returns { success, message }, handle accordingly
      if (res && res.success === false) {
        message.error(res.message || 'Xóa sản phẩm thất bại');
        return;
      }
      message.success('Xóa sản phẩm thành công');
      setProducts(prev => prev.filter(product => product.maSanPham !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
      // Try to show backend message if available
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Xóa sản phẩm thất bại');
      }
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Hình Ảnh',
      dataIndex: 'hinhAnh',
      key: 'hinhAnh',
      render: (hinhAnh) => (
        <img 
          src={hinhAnh} 
          alt="Sản phẩm" 
          style={{ 
            width: 50, 
            height: 50, 
            objectFit: 'cover',
            borderRadius: '4px'
          }} 
        />
      ),
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      sorter: (a, b) => a.tenSanPham.localeCompare(b.tenSanPham),
    },
    {
      title: 'Giá',
      dataIndex: 'giaSanPham',
      key: 'giaSanPham',
      render: (giaSanPham) => `${giaSanPham.toLocaleString()}₫`,
      sorter: (a, b) => a.giaSanPham - b.giaSanPham,
    },
    {
      title: 'Số Lượng',
      dataIndex: 'soLuongSanPham',
      key: 'soLuongSanPham',
      sorter: (a, b) => a.soLuongSanPham - b.soLuongSanPham,
    },
    {
      title: 'Loại Sản Phẩm',
      dataIndex: 'maLoaiSanPham',
      key: 'maLoaiSanPham',
      render: (maLoaiSanPham) => {
        const cat = categories.find(c => c.maLoaiSanPham === maLoaiSanPham);
        return cat ? cat.tenLoaiSanPham : '';
      },
      filters: categories.map(cat => ({ text: cat.tenLoaiSanPham, value: cat.maLoaiSanPham })),
      onFilter: (value, record) => record.maLoaiSanPham === value,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'active',
      key: 'active',
      render: (active) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? 'Đang bán' : 'Ngừng bán'}
        </Tag>
      ),
      filters: [
        { text: 'Đang bán', value: true },
        { text: 'Ngừng bán', value: false }
      ],
      onFilter: (value, record) => record.active === value,
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
              setEditingProduct(record);              form.setFieldsValue({
                tenSanPham: record.tenSanPham,
                giaSanPham: record.giaSanPham,
                soLuongSanPham: record.soLuongSanPham,
                moTa: record.moTa,
                hinhAnh: record.hinhAnh,
                maLoaiSanPham: record.maLoaiSanPham,
                active: Boolean(record.active)
              });
              setPreviewImage(record.hinhAnh);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.maSanPham)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Quản Lý Sản Phẩm</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setPreviewImage('');
            setIsModalVisible(true);
          }}
        >
          Thêm Sản Phẩm
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={products}
        rowKey="maSanPham"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
        }}
      />

      <Modal
        title={editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
        open={isModalVisible}
        onCancel={handleReset}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ active: true }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tenSanPham"
                label="Tên Sản Phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maLoaiSanPham"
                label="Loại Sản Phẩm"
                rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}
              >
                <Select>
                  {categories.map(cat => (
                    <Select.Option key={cat.maLoaiSanPham} value={cat.maLoaiSanPham}>
                      {cat.tenLoaiSanPham}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="giaSanPham"
                label="Giá Sản Phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                  addonAfter="₫"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="soLuongSanPham"
                label="Số Lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="moTa"
            label="Mô Tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="hinhAnh"
            label="Hình Ảnh Sản Phẩm"
            rules={[{ required: true, message: 'Vui lòng chọn hình ảnh sản phẩm' }]}
          >
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <Button 
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
                loading={imageLoading}
              >
                Chọn Hình Ảnh
              </Button>
              {previewImage && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ 
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              )}
            </div>
          </Form.Item>          <Form.Item
            name="active"
            label="Trạng Thái"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch 
              checkedChildren="Đang bán" 
              unCheckedChildren="Ngừng bán"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading || imageLoading}>
                {editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
              </Button>
              <Button onClick={handleReset}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
