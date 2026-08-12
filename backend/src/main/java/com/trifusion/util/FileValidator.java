package com.trifusion.util;

import com.trifusion.exception.ValidationException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

public class FileValidator {
    
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp", "application/pdf"
    );
    
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public static void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("File is required");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationException("File size exceeds maximum limit of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new ValidationException("Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed");
        }
    }
}
