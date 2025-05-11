package com.example.BTJava.DTO.Response;

import lombok.Data;
import java.util.List;

@Data
public class LoaiSanPhamResponse {
    private Integer maLoaiSanPham;
    private String tenLoaiSanPham;
    private List<SanPhamResponse> danhSachSanPham;
}
