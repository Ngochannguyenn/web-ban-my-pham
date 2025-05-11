package com.example.BTJava.Controller;

import com.example.BTJava.DTO.Request.DonHangRequest;
import com.example.BTJava.DTO.Response.ApiResponse;
import com.example.BTJava.DTO.Response.DonHangResponse;
import com.example.BTJava.Entity.DonHang;
import com.example.BTJava.Entity.KhachHang;
import com.example.BTJava.Repository.DonHangRepository;
import com.example.BTJava.Repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/don-hang")
@Validated
public class DonHangController {
    @Autowired
    private DonHangRepository donHangRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;

    // Lấy danh sách tất cả đơn hàng
    @GetMapping
    public ResponseEntity<ApiResponse<List<DonHangResponse>>> getAllDonHang() {
        List<DonHangResponse> donHangList = donHangRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(donHangList));
    }

    // Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonHangResponse>> getDonHangById(@PathVariable(name = "id") Integer id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ID đơn hàng không hợp lệ"));
        }
        Optional<DonHang> donHang = donHangRepository.findById(id);
        if (donHang.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(convertToResponse(donHang.get())));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng không tồn tại"));
        }
    }

    // Thêm đơn hàng mới
    @PostMapping
    public ResponseEntity<ApiResponse<DonHangResponse>> addDonHang(@Validated @RequestBody DonHangRequest request) {
        Optional<KhachHang> khachHangOptional = khachHangRepository.findById(request.getMaKhachHang());
        if (khachHangOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Khách hàng không tồn tại"));
        }
        DonHang donHang = new DonHang();
        donHang.setNgayDat(request.getNgayDat());
        donHang.setTongTien(request.getTongTien());
        donHang.setTrangThai(request.getTrangThai());
        donHang.setKhachHang(khachHangOptional.get());
        DonHang savedDonHang = donHangRepository.save(donHang);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(savedDonHang)));
    }

    // Cập nhật đơn hàng
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DonHangResponse>> updateDonHang(@PathVariable(name = "id") Integer id, @Validated @RequestBody DonHangRequest request) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ID đơn hàng không hợp lệ"));
        }
        Optional<DonHang> donHangOptional = donHangRepository.findById(id);
        if (donHangOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng không tồn tại"));
        }
        Optional<KhachHang> khachHangOptional = khachHangRepository.findById(request.getMaKhachHang());
        if (khachHangOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Khách hàng không tồn tại"));
        }
        DonHang donHang = donHangOptional.get();
        donHang.setNgayDat(request.getNgayDat());
        donHang.setTongTien(request.getTongTien());
        donHang.setTrangThai(request.getTrangThai());
        donHang.setKhachHang(khachHangOptional.get());
        DonHang updatedDonHang = donHangRepository.save(donHang);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(updatedDonHang)));
    }

    // Xóa đơn hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDonHang(@PathVariable(name = "id") Integer id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ID đơn hàng không hợp lệ"));
        }
        Optional<DonHang> donHang = donHangRepository.findById(id);
        if (donHang.isPresent()) {
            donHangRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success(null));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng không tồn tại"));
    }

    // Helper: convert Entity to Response DTO
    private DonHangResponse convertToResponse(DonHang donHang) {
        DonHangResponse dto = new DonHangResponse();
        dto.setMaDonHang(donHang.getMaDonHang());
        dto.setNgayDat(donHang.getNgayDat());
        dto.setTongTien(donHang.getTongTien());
        dto.setTrangThai(donHang.getTrangThai());
        if (donHang.getKhachHang() != null) {
            dto.setMaKhachHang(donHang.getKhachHang().getMaKhachHang());
            dto.setTenKhachHang(donHang.getKhachHang().getHoTen());
        }
        // Có thể set thêm chiTietDonHangs nếu cần
        return dto;
    }
}
