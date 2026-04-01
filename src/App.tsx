import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PatientsPage from "@/pages/PatientsPage.tsx";
import SecretariesPage from "@/pages/SecretariesPage.tsx";
import DashboardPage from "@/pages/DashboardPage.tsx";
import ClinicsPage from "@/pages/ClinicsPage.tsx";
import ServicesPage from "@/pages/ServicesPage.tsx";
import AppointmentsPage from "@/pages/AppointmentsPage.tsx";
import SettingsPage from "@/pages/SettingsPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/secretaires" element={<SecretariesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
