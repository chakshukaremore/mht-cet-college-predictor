package com.admission.analytics.controller;

import com.admission.analytics.model.College;
import com.admission.analytics.model.Cutoff;
import com.admission.analytics.service.CollegeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
@CrossOrigin(origins = "*") // Allow frontend to fetch data without CORS blocks
public class CollegeController {

    private final CollegeService collegeService;

    public CollegeController(CollegeService collegeService) {
        this.collegeService = collegeService;
    }

    @GetMapping
    public List<College> getAllColleges() {
        return collegeService.getAllColleges();
    }

    @GetMapping("/{id}")
    public College getCollegeById(@PathVariable Long id) {
        return collegeService.getCollegeById(id);
    }

    @GetMapping("/{id}/cutoffs")
    public List<Cutoff> getCutoffsByCollegeId(@PathVariable Long id) {
        return collegeService.getCutoffsByCollegeId(id);
    }
}
