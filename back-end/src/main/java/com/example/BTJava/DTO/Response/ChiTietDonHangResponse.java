package com.example.BTJava.DTO.Response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ChiTietDonHangResponse {
    private Integer maChiTiet;
    private Integer soLuong;
    private BigDecimal gia;
    private Integer maSanPham;
    private String tenSanPham;
    private Integer maDonHang;
}
