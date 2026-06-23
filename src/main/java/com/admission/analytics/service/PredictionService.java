package com.admission.analytics.service;

import com.admission.analytics.model.Cutoff;
import com.admission.analytics.repository.CutoffRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    private final CutoffRepository cutoffRepository;

    public PredictionService(CutoffRepository cutoffRepository) {
        this.cutoffRepository = cutoffRepository;
    }

    public Map<String, List<Cutoff>> predictColleges(double percentile, String category) {
        // Fetch all cutoffs matching the selected category
        List<Cutoff> allCutoffsForCategory = cutoffRepository.findByCategory(category);

        List<Cutoff> safeList = new ArrayList<>();
        List<Cutoff> moderateList = new ArrayList<>();
        List<Cutoff> dreamList = new ArrayList<>();

        // We will base predictions on the latest year available in our database (e.g., 2024)
        // and latest round (e.g., Round 1 or max round) to ensure relevant predictions.
        int latestYear = allCutoffsForCategory.stream()
                .mapToInt(Cutoff::getYear)
                .max()
                .orElse(2024);

        int targetRound = 1; // Default to CAP Round 1 for prediction baseline

        for (Cutoff cutoff : allCutoffsForCategory) {
            // Filter by latest year and Round 1 for standard prediction baseline
            if (cutoff.getYear() != latestYear || cutoff.getRound() != targetRound) {
                continue;
            }

            double cutoffPercentile = cutoff.getCutoffPercentile();

            if (cutoffPercentile <= percentile - 3.0) {
                safeList.add(cutoff);
            } else if (cutoffPercentile > percentile - 3.0 && cutoffPercentile <= percentile + 1.0) {
                moderateList.add(cutoff);
            } else if (cutoffPercentile > percentile + 1.0) {
                dreamList.add(cutoff);
            }
        }

        // Limit results to top 15 each to avoid rendering huge arrays on the client-side
        // Sort lists so they look beautiful (highest percentile first for Dream/Moderate, and closest to user score for Safe)
        safeList.sort((a, b) -> Double.compare(b.getCutoffPercentile(), a.getCutoffPercentile()));
        moderateList.sort((a, b) -> Double.compare(b.getCutoffPercentile(), a.getCutoffPercentile()));
        dreamList.sort((a, b) -> Double.compare(a.getCutoffPercentile(), b.getCutoffPercentile())); // lowest dream cutoff first

        Map<String, List<Cutoff>> predictions = new HashMap<>();
        predictions.put("safe", safeList.subList(0, Math.min(15, safeList.size())));
        predictions.put("moderate", moderateList.subList(0, Math.min(15, moderateList.size())));
        predictions.put("dream", dreamList.subList(0, Math.min(15, dreamList.size())));

        return predictions;
    }
}
