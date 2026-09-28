# System Architecture & Project Documentation

## 1. System Architecture Diagram

```mermaid
graph TD
    User([Student / User]) -->|Browser UI| React[React + Tailwind CSS Client]
    
    subgraph Frontend [Frontend Layer - Port 5173 / Vercel]
        React --> Input[Score & Category Input]
        React --> Compare[College Comparison Panel]
        React --> Analytics[Custom SVG Cutoff Charts]
        React --> Auth[Login / Signup Views]
    end

    React -->|REST API Calls JSON| SpringBoot[Spring Boot 3.2 Backend - Port 8080]

    subgraph Backend [Backend Layer - Java 17]
        SpringBoot --> AuthCtrl[AuthController - BCrypt Auth]
        SpringBoot --> PredictCtrl[PredictionController]
        SpringBoot --> CollegeCtrl[CollegeController]
        SpringBoot --> Seeder[DatabaseSeeder - Auto CSV Loader]
    end

    SpringBoot -->|Spring Data JPA / Hibernate| MySQL[(MySQL Database - Port 3306)]
    Seeder -->|Parses on Startup| CSV[(mht_cet_cutoffs.csv - 6200+ Records)]