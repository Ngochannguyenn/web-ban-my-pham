package com.example.BTJava.DTO.Response;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DonHangResponse {
    private Integer maDonHang;
    private LocalDate ngayDat;
    private Double tongTien;
    private String trangThai;
    private Integer maKhachHang;
    private String tenKhachHang;
    private List<ChiTietDonHangResponse> chiTietDonHangs;
}
