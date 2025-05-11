package com.example.BTJava.Entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "loai_san_pham")
@Data // Lombok annotation to generate getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Lombok annotation to generate a no-args constructor
public class LoaiSanPham {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_loai_san_pham")
    private Integer maLoaiSanPham;

    // Basic fields
    @Column(name = "ten_loai_san_pham", nullable = false)
    private String tenLoaiSanPham;

    // Relationships
    @OneToMany(
        mappedBy = "loaiSanPham",
        cascade = {CascadeType.PERSIST, CascadeType.MERGE},
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @JsonManagedReference
    private List<SanPham> danhSachSanPham = new ArrayList<>();
}