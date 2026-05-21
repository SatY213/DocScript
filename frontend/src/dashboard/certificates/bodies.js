// bodies.js
import { formatDate } from "../../common/common";

export const getBodies = (params) => {
  const {
    pregnancyWeeks = 12,
    followUpReason = "Suivi cardiologique",
    disabilityRate = "60%",
    deathDate = new Date().toLocaleDateString("fr-FR"),
    deathReason = "Cause naturelle",
    contagiousDisease = "Tuberculose",
    vaccineName = "COVID-19",
    vaccineDate = new Date().toLocaleDateString("fr-FR"),
    chronicDisease = "Hypertension artérielle",
    schoolYear = "2025/2026",
    marriageDate = new Date().toLocaleDateString("fr-FR"),
    startDate = new Date().toLocaleDateString("fr-FR"),
    endDate = new Date().toLocaleDateString("fr-FR"),
    reason = "Maladie chronique",
    selectedPatient = "John Doe",
    doctorName = "Dr. Smith",
    specialty = "Cardiologue",
    days = 3,
    patientInfo = {},
  } = params;

  // Helper function to get patient name with proper title
  const getPatientTitle = () => {
    if (!selectedPatient) return "le patient";
    const sexe = patientInfo?.personalInfo?.sexe;
    if (sexe === "F") return `Mme ${selectedPatient}`;
    if (sexe === "M") return `M. ${selectedPatient}`;
    return `M./Mme/Mlle ${selectedPatient}`;
  };

  const patientNameWithTitle = getPatientTitle();

  return {
    arret: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie avoir examiné ce jour 
        ${patientNameWithTitle}.
      </p>

      <p style="margin-bottom: 15px;">
        Son état de santé nécessite un arrêt de travail de <b>${days} jour(s)</b>,
        à compter du <b>${formatDate(startDate)}</b> jusqu'au <b>${formatDate(endDate)}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        <b>Motif :</b> ${reason}
      </p>

      <p style="margin-bottom: 15px;">
        Le patient est autorisé à quitter son domicile pour se rendre à la consultation médicale.
      </p>
    `,

    bonne: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie avoir examiné ce jour 
        ${patientNameWithTitle}.
      </p>

      <p style="margin-bottom: 15px;">
        Après examen clinique complet, je constate que l'intéressé(e) est en bonne santé 
        et apte à exercer ses activités professionnelles habituelles.
      </p>

      <p style="margin-bottom: 15px;">
        Aucune contre-indication médicale n'a été constatée.
      </p>
    `,

    presence: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie que 
        ${patientNameWithTitle} s'est présenté(e) à ma consultation 
        le <b>${formatDate(startDate)}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        Ce certificat atteste uniquement de la présence du patient à la consultation,
        sans préjuger de son état de santé ou de sa capacité à travailler.
      </p>
    `,

    suivi: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie que 
        ${patientNameWithTitle} est actuellement suivi(e) dans notre établissement
        pour <b>${followUpReason}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        Un suivi médical régulier est nécessaire afin d'assurer une prise en charge adaptée.
      </p>
    `,

    grossesse: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie que 
        Mme <b>${selectedPatient || "la patiente"}</b> présente une grossesse évolutive estimée à 
        <b>${pregnancyWeeks} semaines</b>.
      </p>

      <p style="margin-bottom: 15px;">
        L'état de santé actuel nécessite un suivi médical régulier.
      </p>
    `,

    invalidite: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie que 
        ${patientNameWithTitle} présente un état d'invalidité évalué à 
        <b>${disabilityRate}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        Cette invalidité limite certaines capacités fonctionnelles du patient.
      </p>
    `,

    deces: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie le décès de 
        ${patientNameWithTitle} survenu le <b>${deathDate}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        <b>Cause du décès :</b> ${deathReason}
      </p>
    `,

    noncontagion: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie que 
        ${patientNameWithTitle} ne présente actuellement aucun signe clinique
        de maladie contagieuse, notamment <b>${contagiousDisease}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        Aucune contre-indication sanitaire n'a été constatée à ce jour.
      </p>
    `,

    prenuptial: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie avoir examiné 
        ${patientNameWithTitle} dans le cadre du certificat médical prénuptial.
      </p>

      <p style="margin-bottom: 15px;">
        Aucun élément médical apparent ne contre-indique le mariage prévu le 
        <b>${marriageDate}</b>.
      </p>
    `,

    scolaire: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie que 
        l'élève <b>${selectedPatient || "le patient"}</b> est apte à suivre les activités scolaires
        pour l'année scolaire <b>${schoolYear}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        Aucun problème de santé majeur n'a été constaté lors de l'examen clinique.
      </p>
    `,

    chronique: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie que 
        ${patientNameWithTitle} est atteint(e) d'une maladie chronique :
        <b>${chronicDisease}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        Un traitement et un suivi médical réguliers sont nécessaires.
      </p>
    `,

    vaccination: `
      <p style="margin-bottom: 15px;">
        Je soussigné(e), <b>${doctorName}</b>, ${specialty}, certifie que 
        ${patientNameWithTitle} a reçu le vaccin <b>${vaccineName}</b>
        le <b>${vaccineDate}</b>.
      </p>

      <p style="margin-bottom: 15px;">
        La vaccination a été réalisée conformément aux recommandations médicales en vigueur.
      </p>
    `,
  };
};
