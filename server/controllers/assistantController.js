const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.addAssistant = async (req, res) => {
  try {
    const doctorId = req.user.id;

    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    const {
      fullName,
      email,
      phone = "",
      password,
      active = true,
      permissions = [],
    } = req.body;

    // Basic validations
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Le nom complet, l'email et le mot de passe sont requis.",
      });
    }

    // Find doctor account
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Docteur non trouvé.",
      });
    }

    // Ensure assistant email is unique inside this doctor's assistants
    const existingAssistant = doctor.assistants.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );

    if (existingAssistant) {
      return res.status(400).json({
        success: false,
        message: "Un assistant avec cette adresse email existe deja.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create assistant object
    const assistantObj = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      active,
      permissions: permissions.map((p) => ({
        route: p.route,
        canView: !!p.canView,
        canEdit: !!p.canEdit,
      })),
    };

    // Push assistant to doctor document
    doctor.assistants.push(assistantObj);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Assistant ajouté avec succès.",
      assistant: {
        fullName,
        email,
        phone,
        active,
        permissions,
      },
    });
  } catch (error) {
    console.error("Error addAssistant:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de l'assistant.",
    });
  }
};
