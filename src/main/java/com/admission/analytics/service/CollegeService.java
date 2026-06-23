package com.admission.analytics.service;

import com.admission.analytics.model.College;
import com.admission.analytics.model.Cutoff;
import com.admission.analytics.repository.CollegeRepository;
import com.admission.analytics.repository.CutoffRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CollegeService {

    private final CollegeRepository collegeRepository;
    private final CutoffRepository cutoffRepository;

    public CollegeService(CollegeRepository collegeRepository, CutoffRepository cutoffRepository) {
        this.collegeRepository = collegeRepository;
        this.cutoffRepository = cutoffRepository;
    }

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public College getCollegeById(Long id) {
        return collegeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "College not found with ID: " + id));
    }

    public List<Cutoff> getCutoffsByCollegeId(Long collegeId) {
        // Ensure college exists
        getCollegeById(collegeId);
        return cutoffRepository.findByCollegeId(collegeId);
    }
}
