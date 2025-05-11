package com.example.BTJava.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "san_pham")
@Data // Lombok annotation to generate getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Lombok annotation to generate a no-args constructor
public class SanPham {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_san_pham")
    private Integer maSanPham;

    // Basic fields
    @Column(name = "ten_san_pham", nullable = false)
    private String tenSanPham;

    @Column(name = "gia", nullable = false)
    private Double giaSanPham;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuongSanPham;

    @Column(name = "mo_ta")
    private String moTa;    
    
    @Column(name = "hinh_anh", columnDefinition = "TEXT")
    private String hinhAnh;

    @Column(name = "is_active", nullable = true)
    private boolean isActive = true; // Default to true

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_loai_san_pham", nullable = false)
    private LoaiSanPham loaiSanPham;

    @OneToMany(mappedBy = "sanPham", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDonHang> chiTietDonHangs = new ArrayList<>();
}