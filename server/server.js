// imports
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const cookieParser = require("cookie-parser");
const http = require("http"); // <-- Add this
const { Server } = require("socket.io"); // <-- Add this
const { loginMongoose } = require("./config/database");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
// routes declare
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const articleRoutes = require("./routes/articleRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const settingRoutes = require("./routes/settingRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
// -------------------

require("./config/passport");

// Import your socket configuration
const socketConfig = require("./config/socket"); // <-- Add this
const { startImapListener } = require("./config/imap");

// ---------------------------
const app = express();
const server = http.createServer(app); // <-- Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Use socket configuration
socketConfig(io); // <-- Call socket handler

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "x-auth-token",
      "Content-Disposition",
      "Cookie",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "x-auth-token",
      "Content-Disposition",
      "Cookie",
    ],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/assistants", assistantRoutes);
app.use("/api/admin", adminAuthRoutes);

// Serve pictures statically
app.use("/cdn/pictures", express.static("pictures"));

// MongoDB connection
console.log("connecting to server... ");
loginMongoose();

// Start the server
server.listen(process.env.PORT || 3000, () =>
  console.log(`*** Server is running on port ${process.env.PORT || 3000} ***`),
);

// startImapListener({
//   user: process.env.IMAP_USER,
//   password: process.env.IMAP_PASSWORD,
//   host: process.env.IMAP_HOST || "imap.privateemail.com",
//   port: process.env.IMAP_PORT || 993,
// });
