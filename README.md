# MHT CET College Recommendation & Admission Analytics System

A full-stack admissions analytics dashboard designed to help engineering aspirants in Maharashtra analyze past MHT CET cutoff trends and predict their admission chances into top colleges (such as VJTI, COEP, SPIT, and PICT) based on historical cutoff percentiles.

---

## 🚀 Key Features

* **Dynamic College Predictor**: Inputs student percentile (floating point precision) and reservation category (`OPEN`, `OBC`, `SC`, `ST`, `EWS`, `TFWS`) to categorize admission probabilities into:
  * **Safe Colleges**: High probability (Cutoff percentile $\le$ score - $3.0\%$).
  * **Moderate Colleges**: Target matches (Cutoff percentile between score - $3.0\%$ and score + $1.0\%$).
  * **Dream Colleges**: Aspirational reaches (Cutoff percentile $>$ score + $1.0\%$).
* **Automatic Database Seeding**: A custom Spring Boot component parses historical data from CSV format on startup and seeds a local MySQL instance with over 6,200+ historical records.
* **Premium Dashboard Interface**: Styled with React, Tailwind CSS, Lucide icons, glassmorphism card layouts, and responsive panels.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, PostCSS
* **Backend**: Java 17, Spring Boot 3.2.0, Spring Data JPA (Hibernate)
* **Database**: MySQL 8.0+
* **Version Control**: Git & GitHub

---

## 📁 Project Structure

```text
mht-cet-college-predictor/
├── frontend/                  # React Client application (Vite + Tailwind)
│   ├── src/
│   │   ├── components/        # InputForm and ResultDashboard views
│   │   ├── App.jsx            # Main app controller & API interface
│   │   └── index.css          # Global Tailwind directives & custom utilities
│   └── package.json           # Node.js dependencies (Tailwind v3, Lucide)
│
├── src/main/                  # Spring Boot Backend application
│   ├── java/com/admission/analytics/
│   │   ├── config/            # DatabaseSeeder config for CSV reading
│   │   ├── controller/        # REST Controllers (College, Prediction)
│   │   ├── model/             # JPA Entities (College, Cutoff)
│   │   ├── repository/        # Data Access Interfaces
│   │   └── service/           # Recommendation & Filtering Service Layer
│   └── resources/
│       └── application.properties  # Database connection configs
│
├── mht_cet_cutoffs.csv        # Seed data (6,200+ admissions records)
├── pom.xml                    # Maven configuration and dependency manager
└── README.md                  # Project documentation
```

---

## ⚙️ Setup and Running Instructions

### Prerequisites
* **Java**: JDK 17 installed and configured.
* **Node.js**: Version 18+ installed.
* **MySQL**: Server installed and running on port `3306` with default credentials (`root` / `root`).

### 1. Backend Server Setup
1. Clone this repository and navigate to the project root:
   ```bash
   git clone https://github.com/chakshukaremore/mht-cet-college-predictor.git
   cd mht-cet-college-predictor
   ```
2. Start the Spring Boot application using the Maven wrapper:
   ```bash
   # On Windows (PowerShell/CMD):
   .\mvnw.cmd spring-boot:run
   
   # On Unix/macOS:
   ./mvnw spring-boot:run
   ```
3. The server will start on `http://localhost:8080`. On its initial run, it will automatically create the schema in your MySQL instance and load the CSV records into the tables.

### 2. Frontend Client Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.
