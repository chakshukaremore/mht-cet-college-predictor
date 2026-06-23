package com.admission.analytics.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cutoffs", indexes = {
    @Index(name = "idx_cutoffs_category_percentile", columnList = "category, cutoff_percentile"),
    @Index(name = "idx_cutoffs_college_id", columnList = "college_id")
})
public class Cutoff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(name = "branch_code", nullable = false, length = 20)
    private String branchCode;

    @Column(name = "branch_name", nullable = false, length = 255)
    private String branchName;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private int round;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "cutoff_percentile", nullable = false)
    private double cutoffPercentile;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public Cutoff() {}

    public Cutoff(College college, String branchCode, String branchName, int year, int round, String category, double cutoffPercentile) {
        this.college = college;
        this.branchCode = branchCode;
        this.branchName = branchName;
        this.year = year;
        this.round = round;
        this.category = category;
        this.cutoffPercentile = cutoffPercentile;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public College getCollege() {
        return college;
    }

    public void setCollege(College college) {
        this.college = college;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getCutoffPercentile() {
        return cutoffPercentile;
    }

    public void setCutoffPercentile(double cutoffPercentile) {
        this.cutoffPercentile = cutoffPercentile;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
