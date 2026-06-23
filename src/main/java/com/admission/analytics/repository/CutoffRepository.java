package com.admission.analytics.repository;

import com.admission.analytics.model.Cutoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CutoffRepository extends JpaRepository<Cutoff, Long> {
    List<Cutoff> findByCollegeId(Long collegeId);
    List<Cutoff> findByCategory(String category);
    List<Cutoff> findByCategoryOrderByCutoffPercentileDesc(String category);
}
