import { Layout, Menu, Badge, Space, Button, Avatar, Dropdown, Input } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  HeartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();

  const mainMenuItems = [
    {
      key: '/',
      label: 'Trang Chủ',
    },
    {
      key: '/products',
      label: 'Sản Phẩm',
    },
  ];

  // Kiểm tra trạng thái đăng nhập
  const user = JSON.parse(localStorage.getItem('user'));

  // Menu tài khoản: chỉ hiện đăng xuất nếu đã đăng nhập, ngược lại hiện đăng nhập/đăng ký
  const userMenuItems = user
    ? [
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Đăng xuất',
          danger: true,
        },
      ]
    : [
        { key: 'login', label: 'Đăng nhập', icon: <UserOutlined /> },
        { key: 'register', label: 'Đăng ký', icon: <UserOutlined /> },
      ];

  const headerStyle = {
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    width: '100%',
    padding: '0 50px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  };

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginRight: '40px',
  };

  const contentStyle = {
    padding: '0 50px',
    marginTop: 64,
    minHeight: 'calc(100vh - 64px - 70px)',
    background: '#f0f2f5',
  };

  const menuStyle = {
    flex: 1,
    minWidth: 400,
    border: 'none',
    background: 'transparent',
  };

  const iconButtonStyle = {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  };

  return (
    <Layout>
      <Header style={headerStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          maxWidth: 1400,
          margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={logoStyle}>COSMETICS SHOP</div>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={mainMenuItems}
              onClick={({ key }) => navigate(key)}
              style={{ ...menuStyle, background: 'transparent', fontWeight: 500, fontSize: 16, borderRadius: 8 }}
            />
          </div>

          <Space size={24} align="center">
    
            <Badge count={cart?.items ? cart.items.length : 0} offset={[0, 2]}>
              <Button
                type="text"
                icon={<ShoppingCartOutlined />}
                style={{ ...iconButtonStyle, background: '#fff', borderRadius: '50%' }}
                onClick={() => navigate('/cart')}
              />
            </Badge>

            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => {
                  if (key === 'logout') {
                    localStorage.removeItem('user');
                    window.location.reload();
                  } else if (key === 'login') {
                    navigate('/login');
                  } else if (key === 'register') {
                    navigate('/register');
                  } else {
                    navigate(key);
                  }
                },
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ background: '#ff4d4f', boxShadow: '0 2px 8px #ff4d4f33' }}>
                  <UserOutlined />
                </Avatar>
                <span style={{ fontWeight: 500 }}>Tài khoản</span>
              </Space>
            </Dropdown>
          </Space>
        </div>
      </Header>

      <Content style={{ ...contentStyle, margin: '80px', borderRadius: 12, boxShadow: '0 2px 12px #e0e0e0' }}>
        <div style={{ padding: '24px 0' }}>
          <Outlet />
        </div>
      </Content>

      <Footer style={{
        textAlign: 'center',
        background: '#fff',
        padding: '20px 50px',
        borderTop: '1px solid #f0f0f0',
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: 1,
      }}>
        COSMETICS SHOP ©{new Date().getFullYear()} - Đẹp từ sự tự tin
      </Footer>
    </Layout>
  );
};

export default CustomerLayout;
