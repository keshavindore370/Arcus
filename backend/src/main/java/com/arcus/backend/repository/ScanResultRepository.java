package com.arcus.backend.repository;

import com.arcus.backend.model.ScanResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanResultRepository extends MongoRepository<ScanResult, String> {
    List<ScanResult> findTop50ByOrderByScannedAtDesc();
    long countByClassificationIgnoreCase(String classification);
}
