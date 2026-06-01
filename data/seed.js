import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Location from "../models/Location.js";
import QrLocation from "../models/QrLocation.js";

dotenv.config();

const seedLocations = [
  {
    _id: "Main entrance",
    name: "Main entrance",
    floor: 1,
    landmark: "Hospital Main Entrance",
    description: "Primary entry for patients and visitors.",
    connections: [
      { to: "Seating area", distance: 8, direction: "Go straight from Main entrance. Seating area will be ahead." },
      { to: "Reception", distance: 10, direction: "Move towards Reception on the right side." },
    ],
  },
  {
    _id: "Seating area",
    name: "Seating area",
    floor: 1,
    landmark: "Patient Waiting Area",
    description: "Waiting area near the main entrance.",
    connections: [
      { to: "Pharmacy", distance: 12, direction: "Continue straight and turn left towards Pharmacy." },
      { to: "Main entrance", distance: 8, direction: "Move straight towards Main entrance." },
    ],
  },
  {
    _id: "Reception",
    name: "Reception",
    floor: 1,
    landmark: "Help Desk",
    description: "Information desk and check-in counter.",
    connections: [
      { to: "Insurance department", distance: 14, direction: "Move straight towards Insurance department." },
      { to: "MRD", distance: 10, direction: "Move forward towards MRD." },
      { to: "Main entrance", distance: 10, direction: "Move back towards Main entrance." },
    ],
  },
  {
    _id: "Pharmacy",
    name: "Pharmacy",
    floor: 1,
    landmark: "Medicine Collection Counter",
    description: "Pharmacy for prescriptions and medical supplies.",
    connections: [
      { to: "Pediatric", distance: 12, direction: "Move forward from Pharmacy. Pediatric will be ahead." },
      { to: "Fetal medicine", distance: 16, direction: "Continue straight. Fetal medicine will be on your left." },
      { to: "Seating area", distance: 12, direction: "Exit Pharmacy and move towards Seating area." },
    ],
  },
  {
    _id: "Pediatric",
    name: "Pediatric",
    floor: 1,
    landmark: "Children Care Unit",
    description: "Pediatric department for child healthcare.",
    connections: [
      { to: "Dental", distance: 12, direction: "Move straight. Dental will be nearby." },
      { to: "Fetal medicine", distance: 10, direction: "Continue straight and Fetal medicine will be on your left." },
      { to: "Orthopedic", distance: 18, direction: "Move forward towards Orthopedic department." },
      { to: "Pharmacy", distance: 12, direction: "Go back towards Pharmacy." },
    ],
  },
  {
    _id: "Dental",
    name: "Dental",
    floor: 1,
    landmark: "Dental Consultation Room",
    description: "Dental care and consultation rooms.",
    connections: [
      { to: "Pediatric", distance: 12, direction: "Move forward and Pediatric will be ahead." },
      { to: "Lift 1", distance: 14, direction: "Continue straight towards Lift 1." },
    ],
  },
  {
    _id: "Fetal medicine",
    name: "Fetal medicine",
    floor: 1,
    landmark: "Fetal Medicine Section",
    description: "Fetal medicine and maternity care.",
    connections: [
      { to: "OBG", distance: 10, direction: "Move straight and you can find OBG ahead." },
      { to: "Pediatric", distance: 10, direction: "Move back towards Pediatric." },
      { to: "Pharmacy", distance: 16, direction: "Walk back towards Pharmacy." },
    ],
  },
  {
    _id: "OBG",
    name: "OBG",
    floor: 1,
    landmark: "Obstetrics and Gynecology",
    description: "OBG ward for maternity and gynecology.",
    connections: [
      { to: "Orthopedic", distance: 18, direction: "Continue straight towards Orthopedic." },
      { to: "Fetal medicine", distance: 10, direction: "Go back towards Fetal medicine." },
    ],
  },
  {
    _id: "Orthopedic",
    name: "Orthopedic",
    floor: 1,
    landmark: "Orthopedic Department",
    description: "Orthopedic care and treatment.",
    connections: [
      { to: "Geriatric", distance: 14, direction: "Move straight and Geriatric department will be ahead." },
      { to: "Lift 1", distance: 10, direction: "Turn right and move towards Lift 1." },
      { to: "Pediatric", distance: 18, direction: "Move back towards Pediatric." },
      { to: "OBG", distance: 18, direction: "Go back towards OBG." },
    ],
  },
  {
    _id: "Geriatric",
    name: "Geriatric",
    floor: 1,
    landmark: "Senior Citizen Care",
    description: "Geriatric care for senior patients.",
    connections: [
      { to: "Orthopedic", distance: 14, direction: "Move back towards Orthopedic department." },
    ],
  },
  {
    _id: "Lift 1",
    name: "Lift 1",
    floor: 1,
    landmark: "Lift Near Orthopedic",
    description: "Lift 1 provides vertical access within the hospital.",
    connections: [
      { to: "Blood collection lab", distance: 16, direction: "Continue straight towards Blood collection lab." },
      { to: "Dental", distance: 14, direction: "Move towards Dental section." },
      { to: "Orthopedic", distance: 10, direction: "Turn left and move towards Orthopedic." },
    ],
  },
  {
    _id: "Blood collection lab",
    name: "Blood collection lab",
    floor: 1,
    landmark: "Blood Sample Collection",
    description: "Lab for blood tests and sample collection.",
    connections: [
      { to: "EMD", distance: 12, direction: "Go straight and EMD will be ahead." },
      { to: "Lift 2", distance: 8, direction: "Turn right towards Lift 2." },
      { to: "Lift 1", distance: 16, direction: "Move back towards Lift 1." },
    ],
  },
  {
    _id: "Lift 2",
    name: "Lift 2",
    floor: 1,
    landmark: "Lift Near Lab",
    description: "Lift near the laboratory area.",
    connections: [
      { to: "Blood collection lab", distance: 8, direction: "Move straight and turn left towards Blood collection lab." },
    ],
  },
  {
    _id: "EMD",
    name: "EMD",
    floor: 1,
    landmark: "Emergency Medical Department",
    description: "Emergency care and urgent medical treatment.",
    connections: [
      { to: "Blood collection lab", distance: 12, direction: "Move back towards Blood collection lab." },
    ],
  },
  {
    _id: "Insurance department",
    name: "Insurance department",
    floor: 1,
    landmark: "Insurance Claim Section",
    description: "Insurance and billing support.",
    connections: [
      { to: "Billing", distance: 12, direction: "Continue straight towards Billing counter." },
      { to: "Neuro surgery", distance: 18, direction: "Turn right and move towards Neuro surgery." },
      { to: "Reception", distance: 14, direction: "Move back towards Reception." },
    ],
  },
  {
    _id: "Billing",
    name: "Billing",
    floor: 1,
    landmark: "Billing Counter",
    description: "Payments and billing services.",
    connections: [
      { to: "Gents Toilet", distance: 10, direction: "Move forward and Gents Toilet will be ahead." },
      { to: "Neurology", distance: 16, direction: "Continue straight towards Neurology." },
      { to: "Insurance department", distance: 12, direction: "Move back towards Insurance department." },
    ],
  },
  {
    _id: "Gents Toilet",
    name: "Gents Toilet",
    floor: 1,
    landmark: "Restroom Area",
    description: "General restroom facilities.",
    connections: [
      { to: "Stairs", distance: 8, direction: "Continue through corridor towards Stairs." },
      { to: "Billing", distance: 10, direction: "Move back towards Billing." },
    ],
  },
  {
    _id: "Stairs",
    name: "Stairs",
    floor: 1,
    landmark: "Central Staircase",
    description: "Central stairs connecting floors.",
    connections: [
      { to: "Lift 3", distance: 10, direction: "Continue through corridor towards Lift 3." },
      { to: "Gents Toilet", distance: 8, direction: "Move back towards Gents Toilet." },
    ],
  },
  {
    _id: "Lift 3",
    name: "Lift 3",
    floor: 1,
    landmark: "Lift Near Home Care",
    description: "Lift 3 near home care services.",
    connections: [
      { to: "Home care service", distance: 14, direction: "Move straight and turn right towards Home care service." },
      { to: "Stairs", distance: 10, direction: "Move back towards Stairs." },
    ],
  },
  {
    _id: "Home care service",
    name: "Home care service",
    floor: 1,
    landmark: "Home Care Unit",
    description: "Support services for home care.",
    connections: [
      { to: "HOD room", distance: 10, direction: "Continue straight and HOD room will be ahead." },
      { to: "Lift 3", distance: 14, direction: "Move back towards Lift 3." },
    ],
  },
  {
    _id: "HOD room",
    name: "HOD room",
    floor: 1,
    landmark: "Head of Department Room",
    description: "Head of Department office and meeting room.",
    connections: [
      { to: "Classroom", distance: 10, direction: "Move straight and Classroom will be ahead." },
      { to: "Home care service", distance: 10, direction: "Move back towards Home care service." },
    ],
  },
  {
    _id: "Classroom",
    name: "Classroom",
    floor: 1,
    landmark: "Training Classroom",
    description: "Classroom for training and teaching.",
    connections: [
      { to: "MRI", distance: 12, direction: "Continue straight towards MRI room." },
      { to: "Ultrasound", distance: 10, direction: "Turn left and move towards Ultrasound." },
      { to: "HOD room", distance: 10, direction: "Move back towards HOD room." },
    ],
  },
  {
    _id: "Ultrasound",
    name: "Ultrasound",
    floor: 1,
    landmark: "Ultrasound Scan Center",
    description: "Ultrasound imaging and scans.",
    connections: [
      { to: "MRI", distance: 10, direction: "Move straight towards MRI." },
      { to: "Classroom", distance: 10, direction: "Move back towards Classroom." },
    ],
  },
  {
    _id: "MRI",
    name: "MRI",
    floor: 1,
    landmark: "MRI Scan Room",
    description: "MRI scanning facility.",
    connections: [
      { to: "Ultrasound", distance: 10, direction: "Move towards Ultrasound room." },
      { to: "Classroom", distance: 12, direction: "Move back towards Classroom." },
    ],
  },
  {
    _id: "Neurology",
    name: "Neurology",
    floor: 1,
    landmark: "Neurology Department",
    description: "Neurology services and consultation.",
    connections: [
      { to: "Gastro", distance: 14, direction: "Continue straight towards Gastro department." },
      { to: "Neuro surgery", distance: 12, direction: "Move towards Neuro surgery." },
      { to: "Billing", distance: 16, direction: "Move back towards Billing counter." },
    ],
  },
  {
    _id: "Gastro",
    name: "Gastro",
    floor: 1,
    landmark: "Gastroenterology",
    description: "Gastroenterology department.",
    connections: [
      { to: "OPD", distance: 12, direction: "Continue straight towards OPD." },
      { to: "Neurology", distance: 14, direction: "Move back towards Neurology." },
    ],
  },
  {
    _id: "Neuro surgery",
    name: "Neuro surgery",
    floor: 1,
    landmark: "Neuro Surgery Unit",
    description: "Neurological surgery and operating theaters.",
    connections: [
      { to: "HPBLT surgical gastro", distance: 14, direction: "Move straight towards HPBLT surgical gastro." },
      { to: "Neurology", distance: 12, direction: "Move towards Neurology." },
      { to: "Insurance department", distance: 18, direction: "Move back towards Insurance department." },
    ],
  },
  {
    _id: "HPBLT surgical gastro",
    name: "HPBLT surgical gastro",
    floor: 1,
    landmark: "HPBLT Surgical Gastro",
    description: "Surgical gastroenterology department.",
    connections: [
      { to: "OPD", distance: 14, direction: "Continue straight towards OPD." },
      { to: "Neuro surgery", distance: 14, direction: "Move back towards Neuro surgery." },
    ],
  },
  {
    _id: "MRD",
    name: "MRD",
    floor: 1,
    landmark: "Medical Records Department",
    description: "Medical records and documentation services.",
    connections: [
      { to: "Reception", distance: 10, direction: "Move towards Reception." },
    ],
  },
  {
    _id: "OPD",
    name: "OPD",
    floor: 1,
    landmark: "Out Patient Department",
    description: "Outpatient consultation and treatment.",
    connections: [
      { to: "Gastro", distance: 12, direction: "Move towards Gastro department." },
      { to: "HPBLT surgical gastro", distance: 14, direction: "Move towards HPBLT surgical gastro." },
    ],
  },
];

const seedQrs = seedLocations.map((location) => ({
  locationId: location._id,
  label: location.name,
}));

const seed = async () => {
  await connectDB();
  await Location.deleteMany({});
  await QrLocation.deleteMany({});

  await Location.insertMany(seedLocations);
  await QrLocation.insertMany(seedQrs);

  console.log("Seed data created successfully");
  mongoose.connection.close();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
