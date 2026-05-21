import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./middlewares/PrivateRoute";
import { Provider } from "react-redux";
import store from "./Redux/store";
import DashboardLayout from "./dashboard/layout/DashboardLayout";
import PatientsTable from "./dashboard/patients/PatientsTable";
import CreateEditPatient from "./dashboard/patients/CreateEditPatient";
import ViewPatient from "./dashboard/patients/ViewPatient";
import MedicinesTable from "./dashboard/medicines/MedicinesTable";
import CreateEditMedicine from "./dashboard/medicines/CreateEditMedicine";
import ViewMedicine from "./dashboard/medicines/ViewMedicine";
import CreateEditPrescription from "./dashboard/prescriptions/CreateEditPrescription";
import PrescriptionsTable from "./dashboard/prescriptions/PrescriptionTable";
import ViewPrescription from "./dashboard/prescriptions/ViewPrescription";
import CreateEditArticle from "./dashboard/stock/CreateEditArticle";
import ArticlesTable from "./dashboard/stock/ArticlesTable";
import Support from "./dashboard/support/Support";
import Billing from "./dashboard/billing/Billing";
import Agenda from "./dashboard/agenda/Agenda";
import AuthentificationPage from "./pages/authentication/AuthenticationPage";
import PublicRoute from "./middlewares/PublicRoute";
import Settings from "./dashboard/settings/settings";
import { AdminAuth } from "./admin/auth/AdminAuth";
import Certificates from "./dashboard/certificates/Certificates";
import ToolsPage from "./dashboard/tools/toolsPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<AuthentificationPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="patients" element={<PatientsTable />} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="patients/create" element={<CreateEditPatient />} />
              <Route
                path="patients/update/:id"
                element={<CreateEditPatient />}
              />
              <Route path="patients/view/:id" element={<ViewPatient />} />
              {/* Medicines routes */}
              <Route path="medicines" element={<MedicinesTable />} />
              <Route path="medicines/create" element={<CreateEditMedicine />} />
              <Route
                path="medicines/update/:id"
                element={<CreateEditMedicine />}
              />
              <Route path="medicines/view/:id" element={<ViewMedicine />} />
              {/* Prescription routes */}
              <Route path="prescriptions" element={<PrescriptionsTable />} />
              <Route
                path="prescriptions/create"
                element={<CreateEditPrescription />}
              />
              <Route
                path="prescriptions/create/:patientId"
                element={<CreateEditPrescription />}
              />
              <Route
                path="prescriptions/update/:id"
                element={<CreateEditPrescription />}
              />{" "}
              <Route
                path="prescriptions/view/:id"
                element={<ViewPrescription />}
              />
              {/* Stock routes */}
              <Route path="stock" element={<ArticlesTable />} />
              <Route
                path="stock/articles/create"
                element={<CreateEditArticle />}
              />
              <Route
                path="stock/articles/update/:id"
                element={<CreateEditArticle />}
              />
              {/* Support routes */}
              <Route path="support" element={<Support />} />
              {/* Billing routes */}
              <Route path="billing" element={<Billing />} />
              {/* Agenda routes */}
              <Route path="agenda" element={<Agenda />} />
              {/* Setting routes */}
              <Route path="settings" element={<Settings />} />
              {/* Certificate routes */}
              <Route path="certificates" element={<Certificates />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
