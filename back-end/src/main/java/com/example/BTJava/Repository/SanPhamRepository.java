package com.example.BTJava.Repository;

import com.example.BTJava.Entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    // Tìm sản phẩm theo tên (gần đúng, không phân biệt hoa thường)
    List<SanPham> findByTenSanPhamContainingIgnoreCase(String tenSanPham);

    // Tìm sản phẩm theo loại sản phẩm
    List<SanPham> findByLoaiSanPham_MaLoaiSanPham(Integer maLoaiSanPham);

    // Kiểm tra sự tồn tại của sản phẩm theo tên (không phân biệt hoa thường)
    boolean existsByTenSanPhamIgnoreCase(String tenSanPham);

    // Tìm sản phẩm theo trạng thái hoạt động
    List<SanPham> findByIsActiveTrue();
    List<SanPham> findByIsActiveFalse();

    // Tìm sản phẩm theo ID và trạng thái hoạt động
    Optional<SanPham> findByMaSanPhamAndIsActiveTrue(Integer maSanPham);

    // Tìm sản phẩm theo khoảng giá
    List<SanPham> findByGiaSanPhamBetween(Double giaMin, Double giaMax);

    // Tìm sản phẩm theo loại và trạng thái hoạt động
    List<SanPham> findByLoaiSanPham_MaLoaiSanPhamAndIsActiveTrue(Integer maLoaiSanPham);

    // Đếm số sản phẩm theo loại
    long countByLoaiSanPham_MaLoaiSanPham(Integer maLoaiSanPham);

    // Lấy tất cả sản phẩm và sắp xếp theo tên
    List<SanPham> findAllByOrderByTenSanPhamAsc();

    // Tìm sản phẩm có số lượng dưới mức cảnh báo
    List<SanPham> findBySoLuongSanPhamLessThan(Integer soLuongCanhBao);

    // Tìm sản phẩm theo tên chính xác (không phân biệt hoa thường)
    Optional<SanPham> findByTenSanPhamIgnoreCase(String tenSanPham);
}