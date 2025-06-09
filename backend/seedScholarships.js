const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const connectDB = require('./config/db');
const Scholarship = require('./models/Scholarship');

dotenv.config(); // Assumes .env is in the project root

connectDB();

const sampleUniversities = [
    "Harvard University", "Stanford University", "MIT", "University of Cambridge",
    "University of Oxford", "University of California, Berkeley", "University of Toronto",
    "University of Sydney", "National University of Singapore", "ETH Zurich",
    "Peking University", "University of Tokyo", "University of Melbourne",
    "University of Delhi", "Indian Institute of Technology Bombay", "University of Cape Town",
    "University of São Paulo", "Sorbonne University", "Technical University of Munich",
    "University of Zurich", "University of Edinburgh", "King's College London",
    "University of Manchester", "Utrecht University", "Heidelberg University",
    "Kyoto University", "Seoul National University", "Tsinghua University",
    "University of Buenos Aires", "University of British Columbia", "McGill University",
    "University of Amsterdam", "Lomonosov Moscow State University", "University of Copenhagen",
    "Stockholm University", "University of Vienna", "University of Helsinki",
    "University of Oslo", "University of Warsaw", "Charles University",
    "Trinity College Dublin", "University of Bologna", "University of Rome La Sapienza",
    "Complutense University of Madrid", "University of Barcelona", "University of Lisbon",
    "University of Porto", "University of Zurich", "Ghent University",
    "Catholic University of Leuven", "University of Geneva", "University of Lausanne",
    "University of Bern", "University of Basel", "University of Innsbruck",
    "Graz University of Technology", "Vienna University of Technology", "Karlsruhe Institute of Technology",
    "RWTH Aachen University", "Ludwig Maximilian University of Munich", "Free University of Berlin",
    "Technical University of Berlin", "Humboldt University of Berlin", "University of Cologne",
    "University of Hamburg", "University of Stuttgart", "University of Tübingen",
    "University of Freiburg", "University of Göttingen", "University of Leipzig",
    "Dresden University of Technology", "University of Erlangen-Nuremberg", "University of Jena",
    "University of Mainz", "University of Münster", "University of Würzburg",
    "University of Düsseldorf", "University of Bremen", "University of Konstanz",
    "University of Passau", "University of Regensburg", "University of Bayreuth",
    "University of Potsdam", "University of Rostock", "University of Greifswald",
    "University of Halle-Wittenberg", "University of Magdeburg", "University of Oldenburg",
    "University of Osnabrück", "University of Paderborn", "University of Siegen",
    "University of Trier", "University of Ulm", "University of Wuppertal"
];

const sampleLocations = [
    "Lucknow", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Surat", "Kanpur", "Nagpur", "Visakhapatnam",
    "Bhopal", "Patna", "Chandigarh", "Noida", "Gurugram", "Coimbatore", "Kochi",
    "London", "New York", "San Francisco", "Toronto", "Sydney", "Berlin", "Paris",
    "Tokyo", "Beijing", "Singapore", "Dubai", "Amsterdam", "Rome", "Madrid", "Barcelona"
];

const sampleSpecialisations = [
    "Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity",
    "Cloud Computing", "Biotechnology", "Nanotechnology", "Renewable Energy",
    "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
    "Software Development", "Web Development", "Mobile App Development",
    "Marketing", "Finance", "Human Resources", "Supply Chain Management",
    "Clinical Research", "Public Health", "Genetics", "Neuroscience",
    "Fine Arts", "Creative Writing", "History", "Philosophy", "Economics"
];

const scholarshipNamePrefixes = [
    "Excellence", "Merit", "Opportunity", "Achiever", "Pioneer", "Future Leader",
    "Innovation", "Global Talent", "Empowerment", "Bright Minds", "Visionary",
    "NextGen", "Trailblazer", "Rising Star", "Champion", "Distinction",
    "Endeavour", "Ambition", "Aspire", "Inspiration", "Discovery",
    "Leader", "Mastery", "Advance", "Summit", "Elite", "Progress", "Impact",
    "Equity", "Diversity", "Access", "Progression", "Breakthrough", "Hope"
];

const scholarshipNameSuffixes = [
    "Award", "Grant", "Scholarship", "Fellowship", "Bursary", "Program", "Prize", "Fund", "Support", "Assistance", "Accolade"
];

// Function to generate a sensible, realistic scholarship title
function makeScholarshipTitle() {
    const prefix = faker.helpers.arrayElement(scholarshipNamePrefixes);
    const subject = faker.helpers.arrayElement(sampleSpecialisations);
    const suffix = faker.helpers.arrayElement(scholarshipNameSuffixes);
    return `${prefix} in ${subject} ${suffix}`;
}

const generateRandomScholarships = async (numScholarships) => {
    const scholarships = [];
    for (let i = 0; i < numScholarships; i++) {
        const title = makeScholarshipTitle();
        const amount = faker.number.int({ min: 500, max: 20000 });
        const deadline = faker.date.future({ years: 1 });
        const cgpi = faker.number.float({ min: 6.0, max: 10.0, precision: 0.1 });
        const cgpiCriteria = `Minimum CGPI of ${cgpi.toFixed(1)}`;
        const provider = faker.helpers.arrayElement(sampleUniversities);
        const location = faker.helpers.arrayElement(sampleLocations);
        const specialisation = faker.helpers.arrayElement(sampleSpecialisations);

        scholarships.push({
            title,
            amount,
            deadline,
            cgpiCriteria,
            provider,
            location,
            specialisation,
            adminApproved: faker.datatype.boolean()
        });
    }
    return scholarships;
};

const seedDB = async () => {
    try {
        console.log('Seeding database...');
        await Scholarship.deleteMany({});
        console.log('Existing scholarships cleared.');

        const randomScholarships = await generateRandomScholarships(500);
        await Scholarship.insertMany(randomScholarships);

        console.log(`Successfully added ${randomScholarships.length} random scholarships!`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();