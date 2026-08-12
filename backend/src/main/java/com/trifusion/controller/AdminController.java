package com.trifusion.controller;

import com.trifusion.dto.ApiResponse;
import com.trifusion.dto.DashboardStats;
import com.trifusion.dto.RegistrationResponse;
import com.trifusion.dto.StatusUpdateRequest;
import com.trifusion.model.Registration;
import com.trifusion.model.RegistrationStatus;
import com.trifusion.service.AdminService;
import com.trifusion.service.ExportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ExportService exportService;

    public AdminController(AdminService adminService, ExportService exportService) {
        this.adminService = adminService;
        this.exportService = exportService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats", adminService.getDashboardStats()));
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<Page<Registration>>> getRegistrations(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        
        return ResponseEntity.ok(ApiResponse.success("Registrations list", 
                adminService.getRegistrations(search, pageRequest)));
    }

    @GetMapping("/registrations/{id}")
    public ResponseEntity<ApiResponse<RegistrationResponse>> getRegistrationDetails(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Registration details", adminService.getRegistrationDetails(id)));
    }

    @PutMapping("/registrations/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateRegistrationStatus(
            @PathVariable String id, 
            @Valid @RequestBody StatusUpdateRequest request) {
        
        adminService.updateRegistrationStatus(id, RegistrationStatus.valueOf(request.getStatus()));
        return ResponseEntity.ok(ApiResponse.success("Registration status updated", null));
    }

    @PutMapping("/payments/{id}/verify")
    public ResponseEntity<ApiResponse<Void>> verifyPayment(@PathVariable String id) {
        adminService.verifyPayment(id);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", null));
    }

    @PutMapping("/payments/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectPayment(
            @PathVariable String id, 
            @Valid @RequestBody StatusUpdateRequest request) {
        
        adminService.rejectPayment(id, request.getReason());
        return ResponseEntity.ok(ApiResponse.success("Payment rejected", null));
    }

    @GetMapping("/export/xlsx")
    public ResponseEntity<byte[]> exportExcel() throws IOException {
        byte[] data = exportService.exportToExcel();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=registrations.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv() throws IOException {
        byte[] data = exportService.exportToCsv();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=registrations.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }
}
