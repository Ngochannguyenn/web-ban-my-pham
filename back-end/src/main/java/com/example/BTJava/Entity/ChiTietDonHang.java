package com.example.BTJava.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_don_hang")
@Data
@NoArgsConstructor
public class ChiTietDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet")
    private Integer maChiTiet;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "gia", nullable = false)
    private BigDecimal gia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_hang", nullable = false,
                foreignKey = @ForeignKey(name = "fk_chi_tiet_don_hang_don_hang"))
    @com.fasterxml.jackson.annotation.JsonIgnore
    private DonHang donHang;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham", nullable = false,
                foreignKey = @ForeignKey(name = "fk_chi_tiet_don_hang_san_pham"))
    @com.fasterxml.jackson.annotation.JsonIgnore
    private SanPham sanPham;    

    // Custom setters for validation
    public void setSoLuong(Integer soLuong) {
        if (soLuong == null || soLuong <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }
        this.soLuong = soLuong;
    }

    public void setGia(BigDecimal gia) {
        if (gia == null || gia.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Giá phải lớn hơn 0");
        }
        this.gia = gia;
    }

    public ChiTietDonHang(Integer soLuong, BigDecimal gia, SanPham sanPham, DonHang donHang) {
        setSoLuong(soLuong);
        setGia(gia);
        this.sanPham = sanPham;
        this.donHang = donHang;
    }
}