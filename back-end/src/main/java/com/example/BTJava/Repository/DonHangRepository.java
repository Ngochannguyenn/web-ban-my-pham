package com.example.BTJava.Repository;

import com.example.BTJava.Entity.DonHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Integer> {

    // Find orders by customer ID
    List<DonHang> findByKhachHang_MaKhachHang(Integer maKhachHang);

    // Find orders by customer ID with pagination
    Page<DonHang> findByKhachHang_MaKhachHang(Integer maKhachHang, Pageable pageable);


    // Find orders by date range
    List<DonHang> findByNgayDatBetween(LocalDate startDate, LocalDate endDate);

    // Find orders by customer email
    @Query("SELECT d FROM DonHang d WHERE d.khachHang.email = :email")
    List<DonHang> findByKhachHangEmail(String email);

    // Find orders by status
    List<DonHang> findByTrangThai(String trangThai);

    // Find orders by total amount greater than or equal to a value
    List<DonHang> findByTongTienGreaterThanEqual(Double tongTien);

    // Find orders by customer ID and status
    List<DonHang> findByKhachHang_MaKhachHangAndTrangThai(Integer maKhachHang, String trangThai);

}