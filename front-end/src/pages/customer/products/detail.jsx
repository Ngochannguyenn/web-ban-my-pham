import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Spin, message, Space } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { productApi } from '../../../services/api';
import { useCart } from '../../../context/CartContext';

const { Title, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProductById(id);
        setProduct(res || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.soLuongSanPham === 0) return;
    addToCart({
      id: product.maSanPham,
      name: product.tenSanPham,
      price: product.giaSanPham,
      image: product.hinhAnh,
      soLuong: 1,
    });
    message.success('Đã thêm vào giỏ hàng');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  }
  if (!product) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Paragraph>Không tìm thấy sản phẩm.</Paragraph></div>;
  }

  return (
    <Row gutter={32} style={{ marginTop: 32 }}>
      <Col xs={24} md={10}>
        <Card
          cover={<img alt={product.tenSanPham} src={product.hinhAnh} style={{ width: '100%', height: 350, objectFit: 'contain', background: '#fafafa' }} />}
          bordered={false}
        />
      </Col>
      <Col xs={24} md={14}>
        <Title level={2}>{product.tenSanPham}</Title>
        <div style={{ color: '#f50', fontWeight: 600, fontSize: 24, margin: '16px 0' }}>{product.giaSanPham?.toLocaleString()}₫</div>
        <Paragraph>{product.moTa}</Paragraph>
        <div style={{ margin: '16px 0' }}>
          <span style={{ fontWeight: 500 }}>Số lượng còn lại: </span>
          <span>{product.soLuongSanPham > 0 ? product.soLuongSanPham : 'Hết hàng'}</span>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="large"
            disabled={product.soLuongSanPham === 0}
            onClick={handleAddToCart}
          >
            {product.soLuongSanPham === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </Button>
          <Button
            icon={<ArrowLeftOutlined />}
            size="large"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductDetail;
