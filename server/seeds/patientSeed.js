const mongoose = require("mongoose");
const Patient = require("../models/patient"); // ajuste le chemin

const MONGO_URI = "mongodb://127.0.0.1:27017/docscript"; // à modifier
const USER_ID = new mongoose.Types.ObjectId("69654be2904a82ff40c71105");

// helpers
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const prenoms = [
  "Ahmed",
  "Sara",
  "Youssef",
  "Lina",
  "Karim",
  "Nadia",
  "Omar",
  "Hakim",
  "Hassan",
  "Imane",
];

const noms = [
  "Benali",
  "Kaci",
  "Mansouri",
  "Bouzid",
  "Amrani",
  "Saidi",
  "Cherif",
  "Merini",
  "Brahimi",
  "Touati",
];

const professions = [
  "Ingénieur",
  "Médecin",
  "Enseignant",
  "Développeur",
  "Infirmier",
  "Chauffeur",
  "Étudiant",
  "Avocat",
];

const groupesSanguins = ["A+", "A-", "B+", "B-", "AB+", "O+", "O-"];

const relations = ["Père", "Mère", "Frère", "Sœur", "Ami"];

const dateAleatoire = (anneeMin = 1950, anneeMax = 2020) => {
  const annee = Math.floor(Math.random() * (anneeMax - anneeMin)) + anneeMin;
  const mois = Math.floor(Math.random() * 12);
  const jour = Math.floor(Math.random() * 28);
  return new Date(annee, mois, jour);
};

const genererPatient = () => {
  const prenom = randomItem(prenoms);
  const nom = randomItem(noms);

  return {
    user_ref: USER_ID,

    personalInfo: {
      firstName: prenom,
      lastName: nom,
      birthDate: dateAleatoire(),
      sexe: Math.random() > 0.5 ? "Homme" : "Femme",
      phone: "0" + Math.floor(500000000 + Math.random() * 400000000),
      email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@gmail.com`,
      address: "Alger, Algérie",
      civilState: Math.random() > 0.5 ? "Célibataire" : "Marié",
      profession: randomItem(professions),
      employer: "Entreprise privée",
      socialSecutiryNumber: Math.floor(
        100000000000 + Math.random() * 900000000000,
      ).toString(),
      chifaCardNumber: Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString(),
    },

    medicalInfo: {
      bloodGroup: randomItem(groupesSanguins),
      weight: Math.floor(50 + Math.random() * 50),
      height: Math.floor(150 + Math.random() * 40),
      CranialPerimeter: Math.floor(50 + Math.random() * 10),
      medicalHistory: "Aucun antécédent majeur",
      drugAllergies: Math.random() > 0.7 ? "Pénicilline" : "Aucune",
      chronicIllnesses: Math.random() > 0.8 ? "Diabète" : "Aucune",
      medicalFollowUp: "Suivi régulier",
    },

    emergencyContact: {
      fullName: `${randomItem(prenoms)} ${randomItem(noms)}`,
      relationship: randomItem(relations),
      phone: "0" + Math.floor(500000000 + Math.random() * 400000000),
    },
  };
};

const seedPatients = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connecté à la base de données");

    const patients = [];

    for (let i = 0; i < 100; i++) {
      patients.push(genererPatient());
    }

    await Patient.insertMany(patients);

    console.log("✅ 100 patients insérés avec succès");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPatients();
