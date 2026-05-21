import { react } from "react";
function buildCertificate({ title, body }) {
  const today = new Date().toLocaleDateString("fr-FR");
  const doctorInfoHTML = `
      <div style=" padding: 10px; margin-bottom: 30px; display: inline-block;">
        <div style="font-size: 13px;">
          <p style="margin: 0; font-weight: bold;">Merini Abdelhakim</p>
          <p style="margin: 0;">Cardiologue</p>
          <p style="margin: 0;">Tlemcen, Birouana nord N°16</p>
          <p style="margin: 0;">Tél: +213 542 09 18 97</p>
        </div>
      </div>
    `;
  return `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; font-size: 14px;">
      ${doctorInfoHTML}

      <div style="text-align: center; margin-top: 20px;">
        <h2 style="font-size: 20px; text-decoration: underline; margin-bottom: 30px; font-weight: bold;">
          ${title}
        </h2>
      </div>

      ${body}

      <div style="margin-top: 80px; border-top: 1px solid #000; padding-top: 20px;">
        <p style="text-align: right; margin-bottom: 40px;">
          Fait à Alger, le ${today}
        </p>

        <div style="text-align: center;">
          <p style="margin-bottom: 40px;"><b>Cachet et signature</b></p>
     
        </div>
      </div>
    </div>
  `;
}
export default buildCertificate;
