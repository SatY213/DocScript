const getCertificatePreview = () => {
  const today = new Date().toLocaleDateString("fr-FR");

  const doctorInfoHTML = `
    <div style="padding: 10px; margin-bottom: 30px; display: inline-block;">
      <div style="font-size: 13px;">
        <p style="margin: 0; font-weight: bold;">${doctorName}</p>
        <p style="margin: 0;">${specialty}</p>
        <p style="margin: 0;">${doctorAddress}</p>
        <p style="margin: 0;">Tél: ${doctorPhone}</p>
      </div>
    </div>
  `;

  const cert = certTypes.find((c) => c.key === selectedCert);

  const titles = {
    arret: "CERTIFICAT MÉDICAL D'ARRÊT DE TRAVAIL",
    bonne: "CERTIFICAT DE BONNE SANTÉ",
    presence: "CERTIFICAT DE PRÉSENCE",
    suivi: "CERTIFICAT DE SUIVI MÉDICAL",
    grossesse: "CERTIFICAT DE GROSSESSE",
    invalidite: "CERTIFICAT D'INVALIDITÉ",
    deces: "CERTIFICAT DE DÉCÈS",
    noncontagion: "CERTIFICAT DE NON-CONTAGION",
    prenuptial: "CERTIFICAT PRÉNUPTIAL",
    scolaire: "CERTIFICAT MÉDICAL SCOLAIRE",
    chronique: "CERTIFICAT DE MALADIE CHRONIQUE",
    vaccination: "CERTIFICAT DE VACCINATION",
  };

  const body =
    bodies[selectedCert] ||
    `
      <p style="margin-bottom: 15px; color: #666;">
        Modèle de certificat "${cert?.label || selectedCert}"
      </p>

      <p style="margin-bottom: 15px; color: #666;">
        Veuillez personnaliser le contenu selon les besoins spécifiques.
      </p>
    `;

  return buildCertificate({
    title: titles[selectedCert] || "CERTIFICAT MÉDICAL",
    body,
    doctorInfoHTML,
    today,
  });
};
