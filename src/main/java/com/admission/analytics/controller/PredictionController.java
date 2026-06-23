package com.admission.analytics.controller;

import com.admission.analytics.model.Cutoff;
import com.admission.analytics.service.PredictionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predict")
@CrossOrigin(origins = "*") // Allow frontend access
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping
    public Map<String, List<Cutoff>> predictColleges(@RequestBody PredictionRequest request) {
        return predictionService.predictColleges(request.getPercentile(), request.getCategory());
    }

    // DTO class for receiving request body parameters
    public static class PredictionRequest {
        private double percentile;
        private String category;

        public PredictionRequest() {}

        public PredictionRequest(double percentile, String category) {
            this.percentile = percentile;
            this.category = category;
        }

        public double getPercentile() {
            return percentile;
        }

        public void setPercentile(double percentile) {
            this.percentile = percentile;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }
}
