package com.example.BTJava.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoaiSanPhamRequest {
    @NotBlank(message = "Tên loại sản phẩm không được để trống")
    private String tenLoaiSanPham;
}
