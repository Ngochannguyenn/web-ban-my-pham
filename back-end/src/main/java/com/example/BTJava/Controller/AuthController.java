package com.example.BTJava.Controller;

import com.example.BTJava.DTO.Response.ApiResponse;
import com.example.BTJava.Entity.KhachHang;
import com.example.BTJava.Repository.KhachHangRepository;
import com.example.BTJava.DTO.Request.ResetPasswordRequest;
import com.example.BTJava.DTO.Request.KhachHangRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final KhachHangRepository khachHangRepository;

    public AuthController(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    // Đăng ký (không hash mật khẩu, không bảo mật)
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody KhachHangRequest request) {
        if (khachHangRepository.existsByEmailIgnoreCase(request.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email đã được sử dụng"));
        }
        KhachHang kh = new KhachHang();
        kh.setHoTen(request.getHoTen());
        kh.setEmail(request.getEmail());
        kh.setSoDienThoai(request.getSoDienThoai());
        kh.setDiaChi(request.getDiaChi());
        kh.setMatKhau(request.getMatKhau());
        KhachHang saved = khachHangRepository.save(kh);
        saved.setMatKhau(null); // Không trả về mật khẩu
        return ResponseEntity.ok(ApiResponse.success(saved));
    }

    // Đăng nhập (không hash mật khẩu, không bảo mật)
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody KhachHang request) {
        Optional<KhachHang> userOpt = khachHangRepository.findByEmailIgnoreCase(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email hoặc mật khẩu không đúng"));
        }
        KhachHang user = userOpt.get();
        if (!request.getMatKhau().equals(user.getMatKhau())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email hoặc mật khẩu không đúng"));
        }
        user.setMatKhau(null); // Không trả về mật khẩu
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    // Đặt lại mật khẩu
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<KhachHang> userOpt = khachHangRepository.findByEmailIgnoreCase(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email không tồn tại"));
        }
        KhachHang user = userOpt.get();
        user.setMatKhau(request.getNewPassword());
        khachHangRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công"));
    }
}
