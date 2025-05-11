package com.example.BTJava.Controller;

import com.example.BTJava.DTO.Request.KhachHangRequest;
import com.example.BTJava.DTO.Response.ApiResponse;
import com.example.BTJava.DTO.Response.KhachHangResponse;
import com.example.BTJava.Entity.KhachHang;
import com.example.BTJava.Repository.KhachHangRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/khach-hang")
public class KhachHangController {
    private final KhachHangRepository khachHangRepository;

    public KhachHangController(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    // Lấy tất cả khách hàng
    @GetMapping
    public ResponseEntity<ApiResponse<List<KhachHangResponse>>> getAll() {
        List<KhachHangResponse> result = khachHangRepository.findAllByOrderByHoTenAsc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // Lấy khách hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KhachHangResponse>> getKhachHangById(@PathVariable(name = "id") Integer id) {
        Optional<KhachHang> khachHang = khachHangRepository.findById(id);
        if (khachHang.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy khách hàng với ID: " + id));
        }
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(khachHang.get())));
    }

    // Lấy khách hàng theo email
    @GetMapping("/search/email")
    public ResponseEntity<ApiResponse<KhachHangResponse>> getKhachHangByEmail(@RequestParam String email) {
        Optional<KhachHang> khachHang = khachHangRepository.findByEmailIgnoreCase(email);
        if (khachHang.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy khách hàng với email: " + email));
        }
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(khachHang.get())));
    }

    // Thêm khách hàng mới
    @PostMapping
    public ResponseEntity<ApiResponse<KhachHangResponse>> them(@Validated @RequestBody KhachHangRequest request) {
        if (khachHangRepository.existsByEmailIgnoreCase(request.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email đã tồn tại!"));
        }
        KhachHang entity = convertToEntity(request);
        KhachHang saved = khachHangRepository.save(entity);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(saved)));
    }

    // Sửa khách hàng
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KhachHangResponse>> updateKhachHang(@PathVariable(name = "id") Integer id, @Validated @RequestBody KhachHangRequest request) {
        Optional<KhachHang> existing = khachHangRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy khách hàng với ID: " + id));
        }
        KhachHang update = existing.get();
        update.setHoTen(request.getHoTen());
        update.setEmail(request.getEmail());
        update.setSoDienThoai(request.getSoDienThoai());
        update.setDiaChi(request.getDiaChi());
        KhachHang saved = khachHangRepository.save(update);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(saved)));
    }

    // Xóa khách hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteKhachHang(@PathVariable(name = "id") Integer id) {
        if (!khachHangRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy khách hàng với ID: " + id));
        }
        khachHangRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Helper: convert Entity to Response DTO
    private KhachHangResponse convertToResponse(KhachHang entity) {
        KhachHangResponse dto = new KhachHangResponse();
        dto.setMaKhachHang(entity.getMaKhachHang());
        dto.setHoTen(entity.getHoTen());
        dto.setEmail(entity.getEmail());
        dto.setSoDienThoai(entity.getSoDienThoai());
        dto.setDiaChi(entity.getDiaChi());
        // Có thể set thêm danhSachDonHang nếu cần
        return dto;
    }

    // Helper: convert Request DTO to Entity
    private KhachHang convertToEntity(KhachHangRequest req) {
        KhachHang kh = new KhachHang();
        kh.setHoTen(req.getHoTen());
        kh.setEmail(req.getEmail());
        kh.setSoDienThoai(req.getSoDienThoai());
        kh.setDiaChi(req.getDiaChi());
        return kh;
    }
}