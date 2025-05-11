package com.example.BTJava.Repository;

import com.example.BTJava.Entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    // Tìm khách hàng theo email (không phân biệt hoa thường)
    Optional<KhachHang> findByEmailIgnoreCase(String email);

    // Kiểm tra sự tồn tại của khách hàng theo email
    boolean existsByEmailIgnoreCase(String email);

    // Tìm khách hàng theo số điện thoại
    Optional<KhachHang> findBySoDienThoai(String soDienThoai);

    // Tìm khách hàng theo tên (gần đúng, không phân biệt hoa thường)
    List<KhachHang> findByHoTenContainingIgnoreCase(String hoTen);

    // Lấy tất cả khách hàng và sắp xếp theo tên
    List<KhachHang> findAllByOrderByHoTenAsc();

    // Tìm khách hàng có đơn hàng trong khoảng ngày
    @Query("SELECT DISTINCT kh FROM KhachHang kh JOIN kh.danhSachDonHang dh WHERE dh.ngayDat BETWEEN :startDate AND :endDate")
    List<KhachHang> findKhachHangByDonHangDateRange(LocalDate startDate, LocalDate endDate);

    // Đếm số đơn hàng của khách hàng
    @Query("SELECT kh.maKhachHang, kh.hoTen, COUNT(dh) FROM KhachHang kh LEFT JOIN kh.danhSachDonHang dh GROUP BY kh.maKhachHang, kh.hoTen")
    List<Object[]> countDonHangByKhachHang();
}