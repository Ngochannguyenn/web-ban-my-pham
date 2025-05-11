package com.example.BTJava.DTO.Response;

import lombok.Data;

@Data
public class SanPhamResponse {
    private Integer maSanPham;
    private String tenSanPham;
    private Double giaSanPham;
    private Integer soLuongSanPham;
    private String moTa;
    private String hinhAnh;
    private boolean isActive;
    private Integer maLoaiSanPham;
    private String tenLoaiSanPham;
}
