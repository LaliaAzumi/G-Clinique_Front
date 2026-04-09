import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CliniqueAppLayout from "./clinique/CliniqueAppLayout";
import Dashboard from "./clinique/pages/Dashboard";
import ListePatients from "./clinique/pages/ListePatients";
import ListeMedecins from "./clinique/pages/ListeMedecins";
import ListeSecretaires from "./clinique/pages/ListeSecretaires";
import PlaceholderPage from "./clinique/pages/PlaceholderPage";
import AgendaMedecins from "./clinique/pages/AgendaMedecins.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
            <Route path="agenda" element={<AgendaMedecins/>} />

            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
