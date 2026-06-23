package com.admission.analytics.config;

import com.admission.analytics.model.College;
import com.admission.analytics.model.Cutoff;
import com.admission.analytics.repository.CollegeRepository;
import com.admission.analytics.repository.CutoffRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final CollegeRepository collegeRepository;
    private final CutoffRepository cutoffRepository;

    public DatabaseSeeder(CollegeRepository collegeRepository, CutoffRepository cutoffRepository) {
        this.collegeRepository = collegeRepository;
        this.cutoffRepository = cutoffRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (collegeRepository.count() == 0) {
            logger.info("Database is empty. Starting database seeding from CSV...");
            seedData();
        } else {
            logger.info("Database already contains data (colleges count: {}). Skipping seeding.", collegeRepository.count());
        }
    }

    private void seedData() {
        String csvFileName = "mht_cet_cutoffs.csv";
        File csvFile = new File(csvFileName);

        if (!csvFile.exists()) {
            logger.error("Seeding failed: File '{}' not found in workspace directory.", csvFile.getAbsolutePath());
            return;
        }

        Map<String, College> collegeCache = new HashMap<>();
        List<Cutoff> cutoffsToSave = new ArrayList<>();
        int recordCount = 0;

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            String line;
            // Read header
            String header = br.readLine();
            if (header == null) {
                logger.error("Seeding failed: CSV file is empty.");
                return;
            }

            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }

                List<String> values = parseCsvLine(line);
                if (values.size() < 10) {
                    logger.warn("Skipping invalid CSV line: {}", line);
                    continue;
                }

                String collegeCode = values.get(0);
                String collegeName = values.get(1);
                String city = values.get(2);
                String status = values.get(3);
                String branchCode = values.get(4);
                String branchName = values.get(5);
                int year = Integer.parseInt(values.get(6));
                int roundNum = Integer.parseInt(values.get(7));
                String category = values.get(8);
                double cutoffPercentile = Double.parseDouble(values.get(9));

                // Cache colleges locally to avoid database hits during parsing
                College college = collegeCache.get(collegeCode);
                if (college == null) {
                    college = new College(collegeCode, collegeName, city, status);
                    college = collegeRepository.save(college);
                    collegeCache.put(collegeCode, college);
                }

                Cutoff cutoff = new Cutoff(college, branchCode, branchName, year, roundNum, category, cutoffPercentile);
                cutoffsToSave.add(cutoff);
                recordCount++;

                // Batch save to avoid out-of-memory for 6000+ records
                if (cutoffsToSave.size() >= 500) {
                    cutoffRepository.saveAll(cutoffsToSave);
                    cutoffsToSave.clear();
                }
            }

            // Save remaining records
            if (!cutoffsToSave.isEmpty()) {
                cutoffRepository.saveAll(cutoffsToSave);
            }

            logger.info("Database seeding completed successfully. Loaded {} colleges and {} cutoff records.", 
                    collegeCache.size(), recordCount);

        } catch (IOException | NumberFormatException e) {
            logger.error("Error occurred while seeding database from CSV: ", e);
        }
    }

    private List<String> parseCsvLine(String line) {
        List<String> values = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder sb = new StringBuilder();
        
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '\"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                values.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        values.add(sb.toString().trim());
        return values;
    }
}
