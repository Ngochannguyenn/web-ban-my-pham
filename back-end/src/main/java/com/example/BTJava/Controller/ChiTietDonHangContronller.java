package com.example.BTJava.Controller;

import com.example.BTJava.DTO.Request.ChiTietDonHangRequest;
import com.example.BTJava.DTO.Response.ApiResponse;
import com.example.BTJava.DTO.Response.ChiTietDonHangResponse;
import com.example.BTJava.Entity.ChiTietDonHang;
import com.example.BTJava.Entity.DonHang;
import com.example.BTJava.Entity.SanPham;
import com.example.BTJava.Repository.ChiTietDonHangRepository;
import com.example.BTJava.Repository.DonHangRepository;
import com.example.BTJava.Repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chi-tiet-don-hang")
public class ChiTietDonHangContronller {
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DonHangRepository donHangRepository;

    @Autowired
    public ChiTietDonHangContronller(ChiTietDonHangRepository chiTietDonHangRepository,
                                     SanPhamRepository sanPhamRepository,
                                     DonHangRepository donHangRepository) {
        this.chiTietDonHangRepository = chiTietDonHangRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.donHangRepository = donHangRepository;
    }

    // Lấy tất cả chi tiết đơn hàng
    @GetMapping
    public ResponseEntity<ApiResponse<List<ChiTietDonHangResponse>>> getAll() {
        List<ChiTietDonHangResponse> result = chiTietDonHangRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // Thêm chi tiết đơn hàng mới
    @PostMapping
    public ResponseEntity<ApiResponse<ChiTietDonHangResponse>> them(@Validated @RequestBody ChiTietDonHangRequest request) {
        Optional<SanPham> sanPhamOptional = sanPhamRepository.findById(request.getMaSanPham());
        if (sanPhamOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm không tồn tại"));
        }
        Optional<DonHang> donHangOptional = donHangRepository.findById(request.getMaDonHang());
        if (donHangOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng không tồn tại"));
        }
        ChiTietDonHang entity = new ChiTietDonHang();
        entity.setSoLuong(request.getSoLuong());
        entity.setGia(request.getGia());
        entity.setSanPham(sanPhamOptional.get());
        entity.setDonHang(donHangOptional.get());
        ChiTietDonHang saved = chiTietDonHangRepository.save(entity);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(saved)));
    }

    // Sửa chi tiết đơn hàng
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChiTietDonHangResponse>> sua(@PathVariable(name = "id") Integer id, @Validated @RequestBody ChiTietDonHangRequest request) {
        Optional<ChiTietDonHang> existing = chiTietDonHangRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Chi tiết đơn hàng không tồn tại"));
        }
        Optional<SanPham> sanPhamOptional = sanPhamRepository.findById(request.getMaSanPham());
        if (sanPhamOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm không tồn tại"));
        }
        Optional<DonHang> donHangOptional = donHangRepository.findById(request.getMaDonHang());
        if (donHangOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng không tồn tại"));
        }
        ChiTietDonHang update = existing.get();
        update.setSoLuong(request.getSoLuong());
        update.setGia(request.getGia());
        update.setSanPham(sanPhamOptional.get());
        update.setDonHang(donHangOptional.get());
        ChiTietDonHang saved = chiTietDonHangRepository.save(update);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(saved)));
    }

    // Xóa chi tiết đơn hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoa(@PathVariable(name = "id") Integer id) {
        if (!chiTietDonHangRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Chi tiết đơn hàng không tồn tại"));
        }
        chiTietDonHangRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Helper: convert Entity to Response DTO
    private ChiTietDonHangResponse convertToResponse(ChiTietDonHang entity) {
        ChiTietDonHangResponse dto = new ChiTietDonHangResponse();
        dto.setMaChiTiet(entity.getMaChiTiet());
        dto.setSoLuong(entity.getSoLuong());
        dto.setGia(entity.getGia());
        if (entity.getSanPham() != null) {
            dto.setMaSanPham(entity.getSanPham().getMaSanPham());
            dto.setTenSanPham(entity.getSanPham().getTenSanPham());
        }
        if (entity.getDonHang() != null) {
            dto.setMaDonHang(entity.getDonHang().getMaDonHang());
        }
        return dto;
    }
}