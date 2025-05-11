import { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal, message, Typography, Select, Divider } from 'antd';
import { orderApi } from '../../../services/api';

const { Title } = Typography;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();

      setOrders(response);
    } catch (error) {
      message.error('Không thể lấy danh sách đơn hàng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrder(orderId, { trangThai: newStatus });
      message.success('Cập nhật trạng thái đơn hàng thành công');
      fetchOrders(); // Refresh order list
    } catch (error) {
      message.error('Không thể cập nhật trạng thái đơn hàng');
      console.error(error);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Chờ Xử Lý' },
    { value: 'processing', label: 'Đang Xử Lý' },
    { value: 'shipped', label: 'Đang Giao' },
    { value: 'delivered', label: 'Đã Giao' },
    { value: 'cancelled', label: 'Đã Hủy' }
  ];

  const getStatusLabel = (status) => {
    return statusOptions.find(opt => opt.value === status)?.label || status;
  };

  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'tenKhachHang',
      key: 'tenKhachHang',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <small>{record.email}</small>
        </div>
      ),
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'ngayDatHang',
      key: 'ngayDatHang',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.ngayDatHang) - new Date(b.ngayDatHang),
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (amount) => `${amount.toLocaleString()}₫`,
      sorter: (a, b) => a.tongTien - b.tongTien,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => {
        const color = 
          status === 'delivered' ? 'green' :
          status === 'processing' ? 'blue' :
          status === 'shipped' ? 'cyan' :
          status === 'cancelled' ? 'red' : 'gold';
        return <Tag color={color}>{getStatusLabel(status)}</Tag>;
      },
      filters: statusOptions.map(opt => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.trangThai === value,
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              Modal.info({
                title: `Chi Tiết Đơn Hàng #${record.id}`,
                width: 800,
                content: (
                  <OrderDetails order={record} />
                ),
              });
            }}
          >
            Xem Chi Tiết
          </Button>
          <Select
            value={record.trangThai}
            style={{ width: 140 }}
            onChange={(value) => handleStatusUpdate(record.id, value)}
            options={statusOptions}
          />
        </Space>
      ),
    },
  ];

  // Component hiển thị chi tiết đơn hàng
  const OrderDetails = ({ order }) => (
    <div>
      <h3>Thông Tin Đơn Hàng</h3>
      <p><strong>Ngày Đặt:</strong> {new Date(order.ngayDatHang).toLocaleString('vi-VN')}</p>
      <p><strong>Khách Hàng:</strong> {order.tenKhachHang}</p>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Số Điện Thoại:</strong> {order.soDienThoai}</p>
      <p><strong>Địa Chỉ Giao Hàng:</strong> {order.diaChiGiaoHang}</p>
      <p><strong>Phương Thức Thanh Toán:</strong> {order.phuongThucThanhToan === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</p>
      
      <Divider />
      
      <h3>Chi Tiết Sản Phẩm</h3>
      <Table
        dataSource={order.chiTietDonHang}
        pagination={false}
        columns={[
          {
            title: 'Sản Phẩm',
            dataIndex: 'tenSanPham',
            key: 'tenSanPham',
          },
          {
            title: 'Số Lượng',
            dataIndex: 'soLuong',
            key: 'soLuong',
          },
          {
            title: 'Đơn Giá',
            dataIndex: 'donGia',
            key: 'donGia',
            render: (price) => `${price.toLocaleString()}₫`,
          },
          {
            title: 'Thành Tiền',
            key: 'subtotal',
            render: (_, item) => `${(item.soLuong * item.donGia).toLocaleString()}₫`,
          },
        ]}
        rowKey="id"
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3}><strong>Tổng Cộng</strong></Table.Summary.Cell>
              <Table.Summary.Cell>
                <strong>{order.tongTien.toLocaleString()}₫</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );

  return (
    <div>
      <Title level={2}>Quản Lý Đơn Hàng</Title>
      <Table
        loading={loading}
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
        }}
      />
    </div>
  );
};

export default AdminOrders;
