const fs = require('fs');
const path = require('path');

// Seeded random number generator for reproducibility
function seedRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

let seed = 42;
function randomUniform(min, max) {
    const r = seedRandom(seed++);
    return min + r * (max - min);
}

// List of top 15 colleges in Maharashtra
const COLLEGES = [
    { code: "3012", name: "Veermata Jijabai Technological Institute (VJTI)", city: "Mumbai", status: "Government Aided", base: 99.0 },
    { code: "6006", name: "College of Engineering, Pune (COEP)", city: "Pune", status: "Government Aided", base: 98.8 },
    { code: "3215", name: "Sardar Patel Institute of Technology (SPIT)", city: "Mumbai", status: "Private", base: 98.5 },
    { code: "6271", name: "Pune Institute of Computer Technology (PICT)", city: "Pune", status: "Private", base: 98.3 },
    { code: "6273", name: "Vishwakarma Institute of Technology (VIT)", city: "Pune", status: "Private", base: 97.2 },
    { code: "3199", name: "K. J. Somaiya College of Engineering", city: "Mumbai", status: "Private", base: 97.0 },
    { code: "3185", name: "Thadomal Shahani Engineering College", city: "Mumbai", status: "Private", base: 96.5 },
    { code: "3207", name: "Dwarkadas J. Sanghvi College of Engineering", city: "Mumbai", status: "Private", base: 97.8 },
    { code: "6278", name: "Walchand College of Engineering", city: "Sangli", status: "Government Aided", base: 96.8 },
    { code: "6007", name: "Government College of Engineering", city: "Karad", status: "Government", base: 95.0 },
    { code: "6005", name: "Government College of Engineering", city: "Aurangabad", status: "Government", base: 94.5 },
    { code: "6274", name: "Pune Vidyarthi Griha's College of Engineering", city: "Pune", status: "Private", base: 94.0 },
    { code: "3218", name: "M. H. Saboo Siddik College of Engineering", city: "Mumbai", status: "Private", base: 91.5 },
    { code: "6275", name: "D. Y. Patil College of Engineering", city: "Akurdi, Pune", status: "Private", base: 93.5 },
    { code: "3197", name: "Agnel Polytechnic (Fr. C. Rodrigues Institute of Technology)", city: "Navi Mumbai", status: "Private", base: 94.2 }
];

// List of engineering branches with choice code suffix and base offset relative to college base
const BRANCHES = [
    { code_suffix: "24210", name: "Computer Engineering", offset: 0.8 },
    { code_suffix: "24610", name: "Information Technology", offset: 0.5 },
    { code_suffix: "26310", name: "Artificial Intelligence and Data Science", offset: 0.3 },
    { code_suffix: "37210", name: "Electronics and Telecommunication Engineering", offset: -0.2 },
    { code_suffix: "29310", name: "Electrical Engineering", offset: -1.2 },
    { code_suffix: "61210", name: "Mechanical Engineering", offset: -1.8 },
    { code_suffix: "19110", name: "Civil Engineering", offset: -2.8 },
    { code_suffix: "50710", name: "Chemical Engineering", offset: -2.5 }
];

// Years
const YEARS = [2022, 2023, 2024];

// CAP Rounds
const ROUNDS = [1, 2, 3];

// Reservation Categories and their base offsets relative to OPEN
const CATEGORIES = {
    "OPEN": 0.0,
    "EWS": -0.15,
    "TFWS": 0.08,
    "OBC": -0.45,
    "SC": -2.2,
    "ST": -5.5
};

// Year-based shifts
const YEAR_SHIFTS = {
    2024: 0.0,
    2023: -0.08,
    2022: -0.22
};

// Round-based shifts
const ROUND_SHIFTS = {
    1: 0.0,
    2: -0.15,
    3: -0.35
};

function generateData() {
    const records = [];
    
    for (const clg of COLLEGES) {
        for (const branch of BRANCHES) {
            // Not all colleges have all branches, skip some to make it realistic
            if (["3215", "6271"].includes(clg.code) && ["Civil Engineering", "Chemical Engineering"].includes(branch.name)) {
                continue;
            }
            
            const basePct = clg.base + branch.offset;
            const branchCode = `${clg.code}${branch.code_suffix}`;
            
            for (const year of YEARS) {
                const yearShift = YEAR_SHIFTS[year];
                
                for (const roundNum of ROUNDS) {
                    const roundShift = ROUND_SHIFTS[roundNum];
                    
                    for (const [category, catShift] of Object.entries(CATEGORIES)) {
                        // Calculate final cutoff
                        let cutoff = basePct + yearShift + roundShift + catShift;
                        
                        // Add a small random noise (-0.08 to +0.08)
                        const noise = randomUniform(-0.08, 0.08);
                        cutoff += noise;
                        
                        // Clamp cutoffs to realistic bounds
                        if (cutoff > 99.9999) {
                            cutoff = 99.9999;
                        } else if (cutoff < 45.0) {
                            cutoff = randomUniform(45.0, 52.0);
                        }
                        
                        // Format cutoff to 4 decimal places
                        cutoff = parseFloat(cutoff.toFixed(4));
                        
                        records.push({
                            college_code: clg.code,
                            college_name: clg.name,
                            city: clg.city,
                            status: clg.status,
                            branch_code: branchCode,
                            branch_name: branch.name,
                            year: year,
                            round: roundNum,
                            category: category,
                            cutoff_percentile: cutoff
                        });
                    }
                }
            }
        }
    }
    
    return records;
}

function main() {
    console.log("Generating MHT CET cutoff dataset via Node.js...");
    const data = generateData();
    console.log(`Generated ${data.length} cutoff records.`);
    
    const outputFile = path.join(__dirname, 'mht_cet_cutoffs.csv');
    
    // Convert to CSV string
    const headers = [
        "college_code", "college_name", "city", "status", 
        "branch_code", "branch_name", "year", "round", 
        "category", "cutoff_percentile"
    ];
    
    let csvContent = headers.join(",") + "\n";
    
    for (const row of data) {
        const line = headers.map(header => {
            let val = row[header];
            // Escape double quotes and wrap in quotes if value contains comma
            if (typeof val === 'string' && val.includes(',')) {
                val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        });
        csvContent += line.join(",") + "\n";
    }
    
    fs.writeFileSync(outputFile, csvContent, 'utf8');
    console.log(`Successfully saved to ${outputFile}`);
}

main();
