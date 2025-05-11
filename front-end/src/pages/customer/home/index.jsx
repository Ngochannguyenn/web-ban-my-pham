import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Button, message, Spin } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../../services/api';
import { useCart } from '../../../context/CartContext';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getAllProducts();

        setProducts(Array.isArray(res) ? res : []);
      } catch {
        message.error('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.maSanPham,
      name: product.tenSanPham,
      price: product.giaSanPham,
      image: product.hinhAnh,
      soLuong: 1,
    });
    message.success('Đã thêm vào giỏ hàng');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title>Chào mừng đến với cửa hàng trực tuyến</Title>
        <Paragraph>
          Khám phá các sản phẩm tuyệt vời với giá ưu đãi
        </Paragraph>
        <Button type="primary" size="large" icon={<ShoppingOutlined />} onClick={() => navigate('/products')}>
          Mua sắm ngay
        </Button>
      </div>

      <Title level={2} style={{ marginBottom: 24 }}>Sản phẩm nổi bật</Title>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {products.slice(0, 8).map((product) => (
            <Col xs={24} sm={12} md={6} key={product.maSanPham}>
              <Card
                hoverable
                cover={<img alt={product.tenSanPham} src={product.hinhAnh} style={{ height: 180, objectFit: 'cover' }} />}
                actions={[
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.soLuongSanPham === 0}
                  >
                    {product.soLuongSanPham === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </Button>,
                  <Button type="link" onClick={() => navigate(`/products/${product.maSanPham}`)}>
                    Xem chi tiết
                  </Button>
                ]}
              >
                <Card.Meta
                  title={product.tenSanPham}
                  description={<>
                    <div style={{ color: '#f50', fontWeight: 500 }}>{product.giaSanPham.toLocaleString()}₫</div>
                    <div style={{ marginTop: 8 }}>{product.moTa}</div>
                  </>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Home;
