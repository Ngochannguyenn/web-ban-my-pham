package com.example.BTJava.DTO.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DonHangRequest {
    @NotNull(message = "Ngày đặt không được để trống")
    private LocalDate ngayDat;

    @NotNull(message = "Tổng tiền không được để trống")
    @Positive(message = "Tổng tiền phải lớn hơn 0")
    private Double tongTien;

    @NotNull(message = "Trạng thái không được để trống")
    private String trangThai;

    @NotNull(message = "Mã khách hàng không được để trống")
    private Integer maKhachHang;

    @NotEmpty(message = "Chi tiết đơn hàng không được để trống")
    @Valid
    private List<ChiTietDonHangRequest> chiTietDonHangs;
}
