package com.example.BTJava.Repository;

import com.example.BTJava.Entity.ChiTietDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Integer> {
    // Xóa chi tiết đơn hàng theo mã sản phẩm
    @Transactional
    @Modifying
    void deleteBySanPhamMaSanPham(Integer maSanPham);

    // Xóa chi tiết đơn hàng theo mã đơn hàng
    @Transactional
    @Modifying
    void deleteByDonHangMaDonHang(Integer maDonHang);

    // Lấy danh sách chi tiết đơn hàng theo mã đơn hàng
    List<ChiTietDonHang> findByDonHangMaDonHang(Integer maDonHang);

    // Lấy danh sách chi tiết đơn hàng theo mã sản phẩm
    List<ChiTietDonHang> findBySanPhamMaSanPham(Integer maSanPham);

    // Kiểm tra sự tồn tại của chi tiết đơn hàng theo mã sản phẩm
    boolean existsBySanPhamMaSanPham(Integer maSanPham);

    // Kiểm tra sự tồn tại của chi tiết đơn hàng theo mã đơn hàng
    boolean existsByDonHangMaDonHang(Integer maDonHang);

    // Đếm số lượng chi tiết đơn hàng theo mã đơn hàng
    long countByDonHangMaDonHang(Integer maDonHang);

    // Đếm số lượng chi tiết đơn hàng theo mã sản phẩm
    long countBySanPhamMaSanPham(Integer maSanPham);
}