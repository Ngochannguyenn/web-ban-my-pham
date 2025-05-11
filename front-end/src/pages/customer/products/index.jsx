import { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Select, Button, Typography, Badge, Empty, Spin, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { productApi } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Title } = Typography;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lấy đúng danh sách sản phẩm, chỉ lấy sản phẩm đang bán
        const res = await productApi.getAllProducts();
        let data = Array.isArray(res) ? res : [];
        // Lọc sản phẩm đang bán (active === true)
        data = data.filter(p => p.active !== false && p.soLuongSanPham > 0);
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getFilteredProducts = () => {
    let filteredProducts = [...products];
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.tenSanPham?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.giaSanPham - b.giaSanPham);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.giaSanPham - a.giaSanPham);
        break;
      case 'name_asc':
        filteredProducts.sort((a, b) => a.tenSanPham.localeCompare(b.tenSanPham));
        break;
      default:
        break;
    }
    return filteredProducts;
  };

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
      <Title level={2}>Danh sách sản phẩm</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={16}>
          <Search
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            style={{ width: '100%' }}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            options={[
              { value: 'newest', label: 'Mới nhất' },
              { value: 'price_asc', label: 'Giá tăng dần' },
              { value: 'price_desc', label: 'Giá giảm dần' },
              { value: 'name_asc', label: 'Tên A-Z' },
            ]}
          />
        </Col>
      </Row>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : getFilteredProducts().length === 0 ? (
        <Empty description="Không có sản phẩm nào" />
      ) : (
        <Row gutter={[16, 16]}>
          {getFilteredProducts().map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.maSanPham}>
              <Card
                hoverable
                cover={<img alt={product.tenSanPham} src={product.hinhAnh} style={{ height: 200, objectFit: 'cover', background: '#fafafa' }} />}
                actions={[
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.soLuongSanPham === 0}
                  >
                    {product.soLuongSanPham === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </Button>,
                  <Button type="link" onClick={() => navigate(`/products/${product.maSanPham}`)}>Xem chi tiết</Button>
                ]}
              >
                <Card.Meta
                  title={product.tenSanPham}
                  description={<>
                    <div style={{ color: '#f50', fontWeight: 500 }}>{product.giaSanPham?.toLocaleString()}₫</div>
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

export default Products;
