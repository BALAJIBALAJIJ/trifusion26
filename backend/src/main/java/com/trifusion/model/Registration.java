package com.trifusion.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "registrations")
public class Registration {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    @Indexed(unique = true)
    private String teamName;
    
    private String track;
    
    private String collegeName;
    
    private TeamMember leader;
    
    private List<TeamMember> members;
    
    private RegistrationStatus status;
    
    private boolean declarationAccepted;
    
    private boolean termsAccepted;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
