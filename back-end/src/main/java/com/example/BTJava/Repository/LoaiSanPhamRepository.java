package com.example.BTJava.Repository;

import com.example.BTJava.Entity.LoaiSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoaiSanPhamRepository extends JpaRepository<LoaiSanPham, Integer> {

    // Tìm loại sản phẩm theo tên (không phân biệt hoa thường)
    Optional<LoaiSanPham> findByTenLoaiSanPhamIgnoreCase(String tenLoaiSanPham);

    // Tìm loại sản phẩm theo tên gần đúng (không phân biệt hoa thường)
    List<LoaiSanPham> findByTenLoaiSanPhamContainingIgnoreCase(String keyword);

    // Kiểm tra tên loại sản phẩm đã tồn tại chưa (không phân biệt hoa thường)
    boolean existsByTenLoaiSanPhamIgnoreCase(String tenLoaiSanPham);

    // Tìm tất cả loại sản phẩm và sắp xếp theo tên
    List<LoaiSanPham> findAllByOrderByTenLoaiSanPhamAsc();

    // Tìm loại sản phẩm có sản phẩm
    @Query("SELECT DISTINCT lsp FROM LoaiSanPham lsp LEFT JOIN FETCH lsp.danhSachSanPham WHERE lsp.danhSachSanPham IS NOT EMPTY")
    List<LoaiSanPham> findLoaiSanPhamCoSanPham();

    // Tìm loại sản phẩm không có sản phẩm
    @Query("SELECT lsp FROM LoaiSanPham lsp WHERE lsp.danhSachSanPham IS EMPTY")
    List<LoaiSanPham> findLoaiSanPhamKhongCoSanPham();

    // Tìm loại sản phẩm có sản phẩm với giá trong khoảng
    @Query("SELECT DISTINCT lsp FROM LoaiSanPham lsp JOIN lsp.danhSachSanPham sp WHERE sp.giaSanPham BETWEEN :giaMin AND :giaMax")
    List<LoaiSanPham> findLoaiSanPhamByKhoangGia(Double giaMin, Double giaMax);

    // Đếm số sản phẩm trong mỗi loại
    @Query("SELECT lsp.maLoaiSanPham, lsp.tenLoaiSanPham, COUNT(sp) FROM LoaiSanPham lsp LEFT JOIN lsp.danhSachSanPham sp GROUP BY lsp.maLoaiSanPham, lsp.tenLoaiSanPham")
    List<Object[]> countSanPhamTrongLoai();
}