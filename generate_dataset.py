import csv
import random

# Configure seed for reproducibility
random.seed(42)

# List of top 15 colleges in Maharashtra
COLLEGES = [
    {"code": "3012", "name": "Veermata Jijabai Technological Institute (VJTI)", "city": "Mumbai", "status": "Government Aided", "base": 99.0},
    {"code": "6006", "name": "College of Engineering, Pune (COEP)", "city": "Pune", "status": "Government Aided", "base": 98.8},
    {"code": "3215", "name": "Sardar Patel Institute of Technology (SPIT)", "city": "Mumbai", "status": "Private", "base": 98.5},
    {"code": "6271", "name": "Pune Institute of Computer Technology (PICT)", "city": "Pune", "status": "Private", "base": 98.3},
    {"code": "6273", "name": "Vishwakarma Institute of Technology (VIT)", "city": "Pune", "status": "Private", "base": 97.2},
    {"code": "3199", "name": "K. J. Somaiya College of Engineering", "city": "Mumbai", "status": "Private", "base": 97.0},
    {"code": "3185", "name": "Thadomal Shahani Engineering College", "city": "Mumbai", "status": "Private", "base": 96.5},
    {"code": "3207", "name": "Dwarkadas J. Sanghvi College of Engineering", "city": "Mumbai", "status": "Private", "base": 97.8},
    {"code": "6278", "name": "Walchand College of Engineering", "city": "Sangli", "status": "Government Aided", "base": 96.8},
    {"code": "6007", "name": "Government College of Engineering", "city": "Karad", "status": "Government", "base": 95.0},
    {"code": "6005", "name": "Government College of Engineering", "city": "Aurangabad", "status": "Government", "base": 94.5},
    {"code": "6274", "name": "Pune Vidyarthi Griha's College of Engineering", "city": "Pune", "status": "Private", "base": 94.0},
    {"code": "3218", "name": "M. H. Saboo Siddik College of Engineering", "city": "Mumbai", "status": "Private", "base": 91.5},
    {"code": "6275", "name": "D. Y. Patil College of Engineering", "city": "Akurdi, Pune", "status": "Private", "base": 93.5},
    {"code": "3197", "name": "Agnel Polytechnic (Fr. C. Rodrigues Institute of Technology)", "city": "Navi Mumbai", "status": "Private", "base": 94.2}
]

# List of engineering branches with choice code suffix and base offset relative to college base
BRANCHES = [
    {"code_suffix": "24210", "name": "Computer Engineering", "offset": 0.8},
    {"code_suffix": "24610", "name": "Information Technology", "offset": 0.5},
    {"code_suffix": "26310", "name": "Artificial Intelligence and Data Science", "offset": 0.3},
    {"code_suffix": "37210", "name": "Electronics and Telecommunication Engineering", "offset": -0.2},
    {"code_suffix": "29310", "name": "Electrical Engineering", "offset": -1.2},
    {"code_suffix": "61210", "name": "Mechanical Engineering", "offset": -1.8},
    {"code_suffix": "19110", "name": "Civil Engineering", "offset": -2.8},
    {"code_suffix": "50710", "name": "Chemical Engineering", "offset": -2.5}
]

# Years
YEARS = [2022, 2023, 2024]

# CAP Rounds
ROUNDS = [1, 2, 3]

# Reservation Categories and their base offsets relative to OPEN
CATEGORIES = {
    "OPEN": 0.0,
    "EWS": -0.15,
    "TFWS": 0.08, # TFWS cutoffs are usually higher than OPEN
    "OBC": -0.45,
    "SC": -2.2,
    "ST": -5.5
}

# Year-based shifts (representing competition level changes)
YEAR_SHIFTS = {
    2024: 0.0,      # Baseline
    2023: -0.08,    # Slightly easier cutoffs in 2023
    2022: -0.22     # Lower cutoffs in 2022
}

# Round-based shifts (cutoffs drop in successive rounds)
ROUND_SHIFTS = {
    1: 0.0,        # Baseline
    2: -0.15,      # Round 2 drops slightly
    3: -0.35       # Round 3 drops further
}

def generate_data():
    records = []
    
    for clg in COLLEGES:
        for branch in BRANCHES:
            # Not all colleges have all branches, skip some to make it realistic
            # E.g., Civil/Chemical might not be present in private IT-focused colleges like SPIT or PICT
            if clg["code"] in ["3215", "6271"] and branch["name"] in ["Civil Engineering", "Chemical Engineering"]:
                continue
                
            base_pct = clg["base"] + branch["offset"]
            branch_code = f"{clg['code']}{branch['code_suffix']}"
            
            for year in YEARS:
                year_shift = YEAR_SHIFTS[year]
                
                for round_num in ROUNDS:
                    round_shift = ROUND_SHIFTS[round_num]
                    
                    for category, cat_shift in CATEGORIES.items():
                        # Calculate final cutoff
                        cutoff = base_pct + year_shift + round_shift + cat_shift
                        
                        # Add a small random noise (-0.08 to +0.08) for realistic variation
                        noise = random.uniform(-0.08, 0.08)
                        cutoff += noise
                        
                        # Clamp cutoffs to realistic bounds
                        if cutoff > 99.9999:
                            cutoff = 99.9999
                        elif cutoff < 45.0:
                            cutoff = random.uniform(45.0, 52.0) # Bottom clamp for engineering cutoffs
                            
                        # Format cutoff to 4 decimal places
                        cutoff = round(cutoff, 4)
                        
                        records.append({
                            "college_code": clg["code"],
                            "college_name": clg["name"],
                            "city": clg["city"],
                            "status": clg["status"],
                            "branch_code": branch_code,
                            "branch_name": branch["name"],
                            "year": year,
                            "round": round_num,
                            "category": category,
                            "cutoff_percentile": cutoff
                        })
                        
    return records

def main():
    print("Generating MHT CET cutoff dataset...")
    data = generate_data()
    print(f"Generated {len(data)} cutoff records.")
    
    output_file = "mht_cet_cutoffs.csv"
    
    # Write to CSV
    with open(output_file, mode="w", newline="", encoding="utf-8") as f:
        fieldnames = [
            "college_code", "college_name", "city", "status", 
            "branch_code", "branch_name", "year", "round", 
            "category", "cutoff_percentile"
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        writer.writeheader()
        for row in data:
            writer.writerow(row)
            
    print(f"Successfully saved to {output_file}")

if __name__ == "__main__":
    main()
