// // App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import InvoiceManagement from "./Components/InvoiceManagement";
import ProtectedRoute from "./Components/ProtectedRoute";
import Invoice from "./Components/Invoice";
import InvoiceList from "./Components/InvoiceList";
import EditInvoice from "./Components/EditInvoice";
import ClientProfile from "./Components/ClientProfile";
import Navbar from "./Components/Navbar";
import CheckClient from "./Components/CheckClient";
import ClientList from "./Components/ClientList";
import ClientEdit from "./Components/ClientEdit";

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Home" element={<Home />} />
        <Route path="SignUp" element={<SignUp />} />
        <Route path="SignIn" element={<SignIn />} />
        <Route path="invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
        <Route path="/InvoiceList" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
        <Route path="/checkclient" element={<ProtectedRoute><CheckClient /></ProtectedRoute>} />
        <Route path="/invoices/:id/edit" element={<ProtectedRoute><EditInvoice /></ProtectedRoute>} />
        <Route path="/invoicemanagement/:id" element={<ProtectedRoute><InvoiceManagement /></ProtectedRoute>} />
        <Route path="/ClientProfile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
        <Route path="/ClientList" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
        <Route path="/ClientEdit/:clientId" element={<ProtectedRoute><ClientEdit/></ProtectedRoute>} />
        {/* <Route path="/EditInvoice" element={<EditInvoice />} /> */}
        {/* <Route
          path="/InvoiceManagement"
          element={<ProtectedRoute>{<InvoiceManagement />}</ProtectedRoute>}
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
