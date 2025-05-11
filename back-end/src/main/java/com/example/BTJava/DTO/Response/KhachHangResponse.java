package com.example.BTJava.DTO.Response;

import lombok.Data;
import java.util.List;

@Data
public class KhachHangResponse {
    private Integer maKhachHang;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String diaChi;
    private List<DonHangResponse> danhSachDonHang;
}
