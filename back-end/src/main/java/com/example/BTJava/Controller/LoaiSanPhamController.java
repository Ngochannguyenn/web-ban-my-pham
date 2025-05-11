package com.example.BTJava.Controller;

import com.example.BTJava.DTO.Request.LoaiSanPhamRequest;
import com.example.BTJava.DTO.Response.ApiResponse;
import com.example.BTJava.DTO.Response.LoaiSanPhamResponse;
import com.example.BTJava.Entity.LoaiSanPham;
import com.example.BTJava.Repository.LoaiSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/loai-san-pham")
public class LoaiSanPhamController {
    private final LoaiSanPhamRepository loaiSanPhamRepository;

    @Autowired
    public LoaiSanPhamController(LoaiSanPhamRepository loaiSanPhamRepository) {
        this.loaiSanPhamRepository = loaiSanPhamRepository;
    }

    // Lấy tất cả loại sản phẩm
    @GetMapping
    public ResponseEntity<ApiResponse<List<LoaiSanPhamResponse>>> getAll() {
        List<LoaiSanPhamResponse> result = loaiSanPhamRepository.findAllByOrderByTenLoaiSanPhamAsc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // Thêm loại sản phẩm mới
    @PostMapping
    public ResponseEntity<ApiResponse<LoaiSanPhamResponse>> them(@Validated @RequestBody LoaiSanPhamRequest request) {
        if (loaiSanPhamRepository.existsByTenLoaiSanPhamIgnoreCase(request.getTenLoaiSanPham())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tên loại sản phẩm đã tồn tại!"));
        }
        LoaiSanPham entity = new LoaiSanPham();
        entity.setTenLoaiSanPham(request.getTenLoaiSanPham());
        LoaiSanPham saved = loaiSanPhamRepository.save(entity);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(saved)));
    }

    // Cập nhật loại sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LoaiSanPhamResponse>> update(@PathVariable(name = "id") Integer id, @Validated @RequestBody LoaiSanPhamRequest request) {
        Optional<LoaiSanPham> existing = loaiSanPhamRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy loại sản phẩm với ID: " + id));
        }
        LoaiSanPham update = existing.get();
        update.setTenLoaiSanPham(request.getTenLoaiSanPham());
        LoaiSanPham saved = loaiSanPhamRepository.save(update);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(saved)));
    }

    // Xóa loại sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoa(@PathVariable(name = "id") Integer id) {
        if (!loaiSanPhamRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy loại sản phẩm với ID: " + id));
        }
        try {
            loaiSanPhamRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể xóa loại sản phẩm này vì đang có sản phẩm thuộc loại này!"));
        }
    }

    // Helper: convert Entity to Response DTO
    private LoaiSanPhamResponse convertToResponse(LoaiSanPham entity) {
        LoaiSanPhamResponse dto = new LoaiSanPhamResponse();
        dto.setMaLoaiSanPham(entity.getMaLoaiSanPham());
        dto.setTenLoaiSanPham(entity.getTenLoaiSanPham());
        // Có thể set thêm danhSachSanPham nếu cần
        return dto;
    }
}

