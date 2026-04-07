import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
<<<<<<<<< Temporary merge branch 1
import PatientsPage from "@/pages/PatientsPage.tsx";
import SecretariesPage from "@/pages/SecretariesPage.tsx";
import DashboardPage from "@/pages/DashboardPage.tsx";
import ClinicsPage from "@/pages/ClinicsPage.tsx";
import ServicesPage from "@/pages/ServicesPage.tsx";
import AppointmentsPage from "@/pages/AppointmentsPage.tsx";
import SettingsPage from "@/pages/SettingsPage.tsx";
import MedecinsPage from "@/pages/MedecinsPage.tsx";
<<<<<<< HEAD
=========
import CliniqueAppLayout from "./clinique/CliniqueAppLayout";
import Dashboard from "./clinique/pages/Dashboard";
import ListePatients from "./clinique/pages/ListePatients";
import ListeMedecins from "./clinique/pages/ListeMedecins";
import ListeSecretaires from "./clinique/pages/ListeSecretaires";
import PlaceholderPage from "./clinique/pages/PlaceholderPage";
>>>>>>>>> Temporary merge branch 2
=======
import ChambresPage from "@/pages/ChambresPage.tsx";
>>>>>>> main

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        
        <Routes>
          {/* Routes principales */}
          <Route path="/" element={<Index />} />
<<<<<<<<< Temporary merge branch 1
          <Route path="/medecins" element={<MedecinsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/secretaires" element={<SecretariesPage />} />
<<<<<<< HEAD
=========
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/patients" element={<Navigate to="/app/patients" replace />} />
          <Route path="/medecins" element={<Navigate to="/app/medecins" replace />} />
          <Route path="/secretaires" element={<Navigate to="/app/secretaires" replace />} />
          <Route path="/app" element={<CliniqueAppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<ListePatients />} />
            <Route path="medecins" element={<ListeMedecins />} />
            <Route path="secretaires" element={<ListeSecretaires />} />
            <Route path="rendez-vous" element={<PlaceholderPage title="Rendez-vous" />} />
            <Route path="consultations" element={<PlaceholderPage title="Consultations" />} />
            <Route path="ordonnances" element={<PlaceholderPage title="Ordonnances" />} />
            <Route path="paiements" element={<PlaceholderPage title="Paiements" />} />
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
>>>>>>>>> Temporary merge branch 2
=======

>>>>>>> main
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;