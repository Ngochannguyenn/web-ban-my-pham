import { Layout, Menu, Avatar, Badge, Space, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Trang Chủ',
    },
    {
      key: '/admin/categories',
      icon: <AppstoreOutlined />,
      label: 'Loại Sản Phẩm',
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: 'Sản Phẩm',
    },
    {
      key: '/admin/orders',
      icon: <OrderedListOutlined />,
      label: 'Đơn Hàng',
    },
    {
      key: '/admin/customers',
      icon: <UserOutlined />,
      label: 'Khách Hàng',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
    background: '#fff',
  };

  const siderStyle = {
    height: 'calc(100vh - 64px)',
    position: 'fixed',
    left: 0,
    top: 64,
    bottom: 0,
    boxShadow: '2px 0 8px 0 rgba(29,35,41,0.05)',
    zIndex: 999,
    background: '#fff',
  };

  const contentStyle = {
    marginLeft: 248,
    marginTop: 64,
    padding: '24px',
    minHeight: 'calc(100vh - 64px)',
    background: '#f0f2f5',
  };

  const menuStyle = {
    height: '100%',
    borderRight: 0,
    padding: '16px 0',
  };

  const logoStyle = {
    height: 64,
    width: 250,
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    background: 'linear-gradient(45deg, #1890ff, #52c41a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
    fontSize: '20px',
  };

  return (
    <Layout>
      <Header style={headerStyle}>
        <div style={logoStyle}>
          COSMETICS SHOP
        </div>
        <Space size={24}>
          <Badge count={3}>
            <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
          </Badge>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ background: '#1890ff' }}>
                <UserOutlined />
              </Avatar>
              <span>Admin</span>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        <Sider
          width={250}
          style={siderStyle}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={mainMenuItems}
            onClick={({ key }) => navigate(key)}
            style={menuStyle}
          />
        </Sider>

        <Content style={contentStyle}>
          <div style={{
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 64px - 48px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
