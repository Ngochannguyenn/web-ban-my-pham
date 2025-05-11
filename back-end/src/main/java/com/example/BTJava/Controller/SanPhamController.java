package com.example.BTJava.Controller;

import com.example.BTJava.DTO.Request.SanPhamRequest;
import com.example.BTJava.DTO.Response.ApiResponse;
import com.example.BTJava.DTO.Response.SanPhamResponse;
import com.example.BTJava.Entity.SanPham;
import com.example.BTJava.Entity.LoaiSanPham;
import com.example.BTJava.Repository.SanPhamRepository;
import com.example.BTJava.Repository.LoaiSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/san-pham")
public class SanPhamController {
    private final SanPhamRepository sanPhamRepository;
    private final LoaiSanPhamRepository loaiSanPhamRepository;

    @Autowired
    public SanPhamController(SanPhamRepository sanPhamRepository, LoaiSanPhamRepository loaiSanPhamRepository) {
        this.sanPhamRepository = sanPhamRepository;
        this.loaiSanPhamRepository = loaiSanPhamRepository;
    }

    // Lấy danh sách tất cả sản phẩm
    @GetMapping
    public ResponseEntity<ApiResponse<List<SanPhamResponse>>> getAllSanPham() {
        List<SanPhamResponse> result = sanPhamRepository.findAllByOrderByTenSanPhamAsc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // Lấy sản phẩm theo ID    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SanPhamResponse>> getSanPhamById(@PathVariable(name = "id") Integer id) {
        Optional<SanPham> sp = sanPhamRepository.findById(id);
        if (sp.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy sản phẩm với ID: " + id));
        }
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(sp.get())));
    }

    // Thêm sản phẩm mới
    @PostMapping
    public ResponseEntity<ApiResponse<SanPhamResponse>> createSanPham(@Validated @RequestBody SanPhamRequest request) {
        if (sanPhamRepository.existsByTenSanPhamIgnoreCase(request.getTenSanPham())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tên sản phẩm đã tồn tại!"));
        }
        Optional<LoaiSanPham> loai = loaiSanPhamRepository.findById(request.getMaLoaiSanPham());
        if (loai.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Loại sản phẩm không tồn tại!"));
        }
        SanPham entity = convertToEntity(request, loai.get());
        SanPham saved = sanPhamRepository.save(entity);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(saved)));
    }

    // Sửa sản phẩm    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SanPhamResponse>> updateSanPham(@PathVariable(name = "id") Integer id, @Validated @RequestBody SanPhamRequest request) {
        Optional<SanPham> existing = sanPhamRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy sản phẩm với ID: " + id));
        }
        Optional<LoaiSanPham> loai = loaiSanPhamRepository.findById(request.getMaLoaiSanPham());
        if (loai.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Loại sản phẩm không tồn tại!"));
        }
        SanPham update = convertToEntity(request, loai.get());
        update.setMaSanPham(id);
        SanPham saved = sanPhamRepository.save(update);
        return ResponseEntity.ok(ApiResponse.success(convertToResponse(saved)));
    }

    // Xóa sản phẩm    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSanPham(@PathVariable(name = "id") Integer id) {
        try {
            Optional<SanPham> sanPhamOptional = sanPhamRepository.findById(id);
            if (sanPhamOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy sản phẩm với ID: " + id));
            }

            SanPham sanPham = sanPhamOptional.get();
            if (!sanPham.getChiTietDonHangs().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Không thể xóa sản phẩm này vì đã có trong đơn hàng!"));
            }

            sanPhamRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể xóa sản phẩm. Vui lòng thử lại!"));
        }
    }

    // Helper: convert Entity to Response DTO
    private SanPhamResponse convertToResponse(SanPham entity) {
        SanPhamResponse dto = new SanPhamResponse();
        dto.setMaSanPham(entity.getMaSanPham());
        dto.setTenSanPham(entity.getTenSanPham());
        dto.setGiaSanPham(entity.getGiaSanPham());
        dto.setSoLuongSanPham(entity.getSoLuongSanPham());
        dto.setMoTa(entity.getMoTa());
        dto.setHinhAnh(entity.getHinhAnh());
        dto.setActive(entity.isActive());
        if (entity.getLoaiSanPham() != null) {
            dto.setMaLoaiSanPham(entity.getLoaiSanPham().getMaLoaiSanPham());
            dto.setTenLoaiSanPham(entity.getLoaiSanPham().getTenLoaiSanPham());
        }
        return dto;
    }

    // Helper: convert Request DTO to Entity
    private SanPham convertToEntity(SanPhamRequest req, LoaiSanPham loai) {
        SanPham sp = new SanPham();
        sp.setTenSanPham(req.getTenSanPham());
        sp.setGiaSanPham(req.getGiaSanPham());
        sp.setSoLuongSanPham(req.getSoLuongSanPham());
        sp.setMoTa(req.getMoTa());
        sp.setHinhAnh(req.getHinhAnh());
        sp.setActive(req.isActive());
        sp.setLoaiSanPham(loai);
        return sp;
    }
}