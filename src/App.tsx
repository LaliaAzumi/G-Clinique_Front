import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./components/layout/Navbar"; // <-- Import de ta nouvelle Navbar
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

import PatientsPage from "@/pages/PatientsPage.tsx";
import SecretariesPage from "@/pages/SecretariesPage.tsx";
import DashboardPage from "@/pages/DashboardPage.tsx";
import ClinicsPage from "@/pages/ClinicsPage.tsx";
import ServicesPage from "@/pages/ServicesPage.tsx";
import AppointmentsPage from "@/pages/AppointmentsPage.tsx";
import SettingsPage from "@/pages/SettingsPage.tsx";
import MedecinsPage from "@/pages/MedecinsPage.tsx";
import ChambresPage from "@/pages/ChambresPage.tsx";
import FullProject from "./pages/FullProject.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* La Navbar est ici pour être visible sur toutes les routes */}
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/medecins" element={<MedecinsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/secretaires" element={<SecretariesPage />} />
          <Route path="/fullProject" element={<FullProject />} />


          <Route path="*" element={<NotFound />} />
          <Route path="/chambres" element={<ChambresPage />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;