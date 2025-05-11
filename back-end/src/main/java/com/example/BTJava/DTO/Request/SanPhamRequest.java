package com.example.BTJava.DTO.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SanPhamRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String tenSanPham;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    private Double giaSanPham;

    @NotNull(message = "Số lượng sản phẩm không được để trống")
    @Min(value = 0, message = "Số lượng sản phẩm không được âm")
    private Integer soLuongSanPham;

    private String moTa;
    
    private String hinhAnh;
    
    @NotNull(message = "Trạng thái không được để trống")
    private boolean isActive;

    @NotNull(message = "Mã loại sản phẩm không được để trống")
    private Integer maLoaiSanPham;
}
