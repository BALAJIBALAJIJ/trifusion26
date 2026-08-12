package com.trifusion.repository;

import com.trifusion.model.Registration;
import com.trifusion.model.RegistrationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends MongoRepository<Registration, String> {
    Optional<Registration> findByUserId(String userId);
    boolean existsByTeamName(String teamName);
    
    @Query("{ '$or': [ { 'teamName': { $regex: ?0, $options: 'i' } }, { 'collegeName': { $regex: ?0, $options: 'i' } } ] }")
    Page<Registration> searchByTeamOrCollege(String search, Pageable pageable);
    
    long countByStatus(RegistrationStatus status);
    long countByTrack(String track);
}
